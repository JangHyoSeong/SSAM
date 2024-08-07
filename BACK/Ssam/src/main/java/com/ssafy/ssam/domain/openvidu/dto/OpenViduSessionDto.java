package com.ssafy.ssam.domain.openvidu.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenViduSessionDto {
	private String accessCode;
	private String webrtcSessionId;
    private String sessionId;
    private String userId;
    private String token;
    private String connectionId;
    private String streamId;
    private String clientData;
    private String serverData;
    private Long createdAt;
    private String customSessionId;
    private boolean recording;
    private String mediaMode;
    private String recordingMode;
}