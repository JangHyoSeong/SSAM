package com.ssafy.ssam.domain.openvidu.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssam.domain.openvidu.dto.OpenViduSessionDto;
import com.ssafy.ssam.domain.openvidu.dto.RecordingDto;
import com.ssafy.ssam.domain.openvidu.dto.RecordingRequestDto;
import com.ssafy.ssam.global.dto.CommonResponseDto;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.ConnectionType;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.OpenViduRole;
import io.openvidu.java.client.Recording;
import io.openvidu.java.client.RecordingProperties;
import io.openvidu.java.client.Session;

// openvidu-recoding-java 백엔드 코드 기반
// 수정 사항
// getToken
//     - 매개변수 변경 (세션 ID => {세션 ID, 유저 이름})
//     - 유저 정보 표시 중복 제거 (json 형식 파괴됨)
//         - 수정 전 {"clientData": "유저 이름"}%/%user_data
//         - 수정 후 {"clientData": "유저 이름"}


@RestController
@RequestMapping("/v1/video")
public class SessionController {
	
	/* openVidu: OpenVidu object as entrypoint of the SDK
	 * mapSessions: Collection to pair session names and OpenVidu Session objects
	 * mapSessionNamesTokens: Collection to pair session names and tokens (the inner Map pairs tokens and role associated)
	 * sessionRecordings: Collection to pair session names and recording objects
	 * OPENVIDU_URL: URL where our OpenVidu server is listening
	 * SECRET: Secret shared with our OpenVidu server
	 */
	private final OpenVidu openVidu;
    private final Map<String, Session> mapSessions = new ConcurrentHashMap<>();
    private final Map<String, Map<String, OpenViduSessionDto>> sessionUserMapping = new ConcurrentHashMap<>();
    private final Map<String, Boolean> sessionRecordings = new ConcurrentHashMap<>();

    public SessionController(@Value("${openvidu.secret:JddU_RuEn5Iqc}") String secret, 
                             @Value("${openvidu.url:https://i11e201.p.ssafy.io:8443/}") String openviduUrl) {
        this.openVidu = new OpenVidu(openviduUrl, secret);
    }

    @PostMapping("/token")
    public ResponseEntity<OpenViduSessionDto> getToken(@RequestBody OpenViduSessionDto requestDto) {
        String webrtcSessionId = requestDto.getWebrtcSessionId();
        String userId = requestDto.getUserId();

        String serverData = "{\"userId\":\"" + userId + "\"}";
        ConnectionProperties connectionProperties = new ConnectionProperties.Builder()
            .type(ConnectionType.WEBRTC)
            .role(OpenViduRole.PUBLISHER)
            .data(serverData)
            .build();

        try {
            Session session = mapSessions.computeIfAbsent(webrtcSessionId, k -> {
                try {
                    return openVidu.createSession();
                } catch (Exception e) {
                    throw new RuntimeException("Error creating session", e);
                }
            });
            Connection c = session.createConnection(connectionProperties);
            
            OpenViduSessionDto responseDto = OpenViduSessionDto.builder()
                .sessionId(session.getSessionId())
                .token(c.getToken())
                .connectionId(c.getConnectionId())
                .createdAt(c.createdAt())
                .serverData(serverData)
                .build();

            sessionUserMapping.computeIfAbsent(webrtcSessionId, k -> new ConcurrentHashMap<>()).put(userId, responseDto);

            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating token", e);
        }
    }
    
    @DeleteMapping("/token")
    public ResponseEntity<CommonResponseDto> deleteToken(@RequestBody OpenViduSessionDto requestDto) {
        String sessionId = requestDto.getSessionId();
        String token = requestDto.getToken();
        String userId = requestDto.getUserId();

        Map<String, OpenViduSessionDto> sessionUsers = sessionUserMapping.get(sessionId);
        if (sessionUsers != null) {
            sessionUsers.remove(userId);
            if (sessionUsers.isEmpty()) {
                mapSessions.remove(sessionId);
                sessionUserMapping.remove(sessionId);
            }
        }
        return ResponseEntity.ok(new CommonResponseDto("Token successfully deleted"));
    }

    @DeleteMapping("/session")
    public ResponseEntity<CommonResponseDto> deleteSession(@RequestBody OpenViduSessionDto requestDto) {
        String sessionId = requestDto.getSessionId();

        Session session = mapSessions.remove(sessionId);
        if (session != null) {
            try {
                session.close();
                sessionUserMapping.remove(sessionId);
                sessionRecordings.remove(sessionId);
                return ResponseEntity.ok(new CommonResponseDto("Session successfully closed and removed"));
            } catch (Exception e) {
                throw new RuntimeException("Error closing session", e);
            }
        }
        return ResponseEntity.ok(new CommonResponseDto("Session not found"));
    }

    @PostMapping("/info")
    public ResponseEntity<OpenViduSessionDto> fetchInfo(@RequestBody OpenViduSessionDto requestDto) {
        String sessionId = requestDto.getSessionId();
        
        Session session = mapSessions.get(sessionId);
        if (session != null) {
            try {
                session.fetch();
                return ResponseEntity.ok(convertSessionToDto(session));
            } catch (Exception e) {
                throw new RuntimeException("Error fetching session info", e);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/info")
    public ResponseEntity<List<OpenViduSessionDto>> fetchAll() {
        try {
            openVidu.fetch();
            List<OpenViduSessionDto> sessionDtos = openVidu.getActiveSessions().stream()
                .map(this::convertSessionToDto)
                .collect(Collectors.toList());

            return ResponseEntity.ok(sessionDtos);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all sessions", e);
        }
    }

    @DeleteMapping("/force-disconnect")
    public ResponseEntity<CommonResponseDto> forceDisconnect(@RequestBody OpenViduSessionDto requestDto) {
        String sessionId = requestDto.getSessionId();
        String connectionId = requestDto.getConnectionId();

        Session session = mapSessions.get(sessionId);
        if (session != null) {
            try {
                session.forceDisconnect(connectionId);
                return ResponseEntity.ok(new CommonResponseDto("Connection forcefully disconnected"));
            } catch (Exception e) {
                throw new RuntimeException("Error force disconnecting", e);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/force-unpublish")
    public ResponseEntity<CommonResponseDto> forceUnpublish(@RequestBody OpenViduSessionDto requestDto) {
        String sessionId = requestDto.getSessionId();
        String streamId = requestDto.getStreamId();

        Session session = mapSessions.get(sessionId);
        if (session != null) {
            try {
                session.forceUnpublish(streamId);
                return ResponseEntity.ok(new CommonResponseDto("Stream forcefully unpublished"));
            } catch (Exception e) {
                throw new RuntimeException("Error force unpublishing", e);
            }
        }
        return ResponseEntity.notFound().build();
    }

    private OpenViduSessionDto convertSessionToDto(Session session) {
        return OpenViduSessionDto.builder()
            .sessionId(session.getSessionId())
            .createdAt(session.createdAt())
            .customSessionId(session.getProperties().customSessionId())
            .recording(session.isBeingRecorded())
            .mediaMode(session.getProperties().mediaMode().name())
            .recordingMode(session.getProperties().recordingMode().name())
            .build();
    }

	/*******************/
	/** Recording API **/
	/*******************/

    @RequestMapping(value = "/recording/start", method = RequestMethod.POST)
	public ResponseEntity<?> startRecording(@RequestBody Map<String, Object> params) {
		String sessionId = (String) params.get("session");
		Recording.OutputMode outputMode = Recording.OutputMode.valueOf((String) params.get("outputMode"));
		boolean hasAudio = (boolean) params.get("hasAudio");
		boolean hasVideo = (boolean) params.get("hasVideo");

		RecordingProperties properties = new RecordingProperties.Builder().outputMode(outputMode).hasAudio(hasAudio)
				.hasVideo(hasVideo).build();

		System.out.println("Starting recording for session " + sessionId + " with properties {outputMode=" + outputMode
				+ ", hasAudio=" + hasAudio + ", hasVideo=" + hasVideo + "}");

		//return ResponseEntity.ok(new CommonResponseDto("Stream forcefully unpublished"));
		try {
			Recording recording = this.openVidu.startRecording(sessionId, properties);
			this.sessionRecordings.put(sessionId, true);
			return new ResponseEntity<>(recording, HttpStatus.OK);
			//return ResponseEntity.ok(new CommonResponseDto("Stream forcefully unpublished"));
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

    /*
    @PostMapping("/recording/start")
    public ResponseEntity<RecordingDto> startRecording(@RequestBody RecordingRequestDto requestDto) {
        try {
        	System.out.println("들어왔음!!");
            RecordingProperties properties = new RecordingProperties.Builder()
                .outputMode(requestDto.getOutputMode())
                .name("321")
                .hasAudio(requestDto.isHasAudio())
                .hasVideo(requestDto.isHasVideo())
                .build();

            Recording recording = this.openVidu.startRecording(requestDto.getSessionId(), properties);
            
            this.sessionRecordings.put(requestDto.getSessionId(), true);
            return ResponseEntity.ok(convertRecordingToDto(recording));
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new RuntimeException("Error starting recording", e);
        }
    }*/

    @PostMapping("/recording/stop")
    public ResponseEntity<RecordingDto> stopRecording(@RequestBody RecordingRequestDto requestDto) {
        try {
            Recording recording = this.openVidu.stopRecording(requestDto.getRecordingId());
            this.sessionRecordings.remove(recording.getSessionId());
            return ResponseEntity.ok(convertRecordingToDto(recording));
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new RuntimeException("Error stopping recording", e);
        }
    }

    @DeleteMapping("/recording")
    public ResponseEntity<Void> deleteRecording(@RequestBody RecordingRequestDto requestDto) {
        try {
            this.openVidu.deleteRecording(requestDto.getRecordingId());
            return ResponseEntity.ok().build();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new RuntimeException("Error deleting recording", e);
        }
    }

    @GetMapping("/recording/{recordingId}")
    public ResponseEntity<RecordingDto> getRecording(@PathVariable String recordingId) {
        try {
            Recording recording = this.openVidu.getRecording(recordingId);
            return ResponseEntity.ok(convertRecordingToDto(recording));
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new RuntimeException("Error getting recording", e);
        }
    }

    @GetMapping("/recording")
    public ResponseEntity<List<RecordingDto>> listRecordings() {
        try {
            List<Recording> recordings = this.openVidu.listRecordings();
            List<RecordingDto> recordingDtos = recordings.stream()
                .map(this::convertRecordingToDto)
                .collect(Collectors.toList());
            return ResponseEntity.ok(recordingDtos);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new RuntimeException("Error listing recordings", e);
        }
    }

    private RecordingDto convertRecordingToDto(Recording recording) {
        return RecordingDto.builder()
            .id(recording.getId())
            .sessionId(recording.getSessionId())
            .name(recording.getName())
            .outputMode(recording.getOutputMode())
            .hasAudio(recording.hasAudio())
            .hasVideo(recording.hasVideo())
            .duration(recording.getDuration())
            .size(recording.getSize())
            .status(recording.getStatus())
            .url(recording.getUrl())
            .createdAt(recording.getCreatedAt())
            .build();
    }

}
