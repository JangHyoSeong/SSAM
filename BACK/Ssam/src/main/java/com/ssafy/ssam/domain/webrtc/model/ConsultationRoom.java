package com.ssafy.ssam.domain.webrtc.model;

import java.io.Closeable;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

import org.kurento.client.*;
import org.springframework.web.socket.WebSocketSession;

import com.google.gson.JsonObject;

public class ConsultationRoom implements Closeable {
    private final String roomName;
    private final MediaPipeline pipeline;
    private final ConcurrentMap<String, UserSession> participants = new ConcurrentHashMap<>();

    public ConsultationRoom(String roomName, KurentoClient kurento) {
        this.roomName = roomName;
        this.pipeline = kurento.createMediaPipeline();
    }

    public String getRoomName() {
        return roomName;
    }

    public UserSession join(String userName, WebSocketSession session) throws IOException {
        UserSession participant = new UserSession(userName, session, this);
        joinRoom(participant);
        participants.put(participant.getName(), participant);
        return participant;
    }

    public void leave(UserSession user) throws IOException {
        this.removeParticipant(user.getName());
        user.close();
    }

    private void joinRoom(UserSession newParticipant) throws IOException {
        WebRtcEndpoint endpoint = new WebRtcEndpoint.Builder(pipeline).build();

        newParticipant.setWebRtcEndpoint(endpoint);

        for (UserSession participant : participants.values()) {
            if (!participant.equals(newParticipant)) {
                connectParticipants(newParticipant, participant);
            }
        }

        JsonObject existingParticipantsMsg = new JsonObject();
        existingParticipantsMsg.addProperty("id", "existingParticipants");
        existingParticipantsMsg.addProperty("data", participants.values().stream()
                .map(UserSession::getName)
                .collect(Collectors.joining(",")));
        newParticipant.sendMessage(existingParticipantsMsg);
    }

    private void connectParticipants(UserSession newParticipant, UserSession existingParticipant) {
        WebRtcEndpoint newEndpoint = newParticipant.getWebRtcEndpoint();
        WebRtcEndpoint existingEndpoint = existingParticipant.getWebRtcEndpoint();

        newEndpoint.connect(existingEndpoint);
        existingEndpoint.connect(newEndpoint);

        JsonObject newParticipantMsg = new JsonObject();
        newParticipantMsg.addProperty("id", "newParticipantArrived");
        newParticipantMsg.addProperty("name", newParticipant.getName());
        try {
			existingParticipant.sendMessage(newParticipantMsg);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

    public void receiveVideoFrom(UserSession sender, String remoteUserName, String sdpOffer) throws IOException {
        UserSession remoteUser = participants.get(remoteUserName);
        if (remoteUser == null) {
            throw new IOException("Remote user " + remoteUserName + " not found");
        }

        WebRtcEndpoint remoteEndpoint = remoteUser.getWebRtcEndpoint();
        String ipSdpAnswer = remoteEndpoint.processOffer(sdpOffer);

        JsonObject receiveVideoAnswer = new JsonObject();
        receiveVideoAnswer.addProperty("id", "receiveVideoAnswer");
        receiveVideoAnswer.addProperty("name", remoteUserName);
        receiveVideoAnswer.addProperty("sdpAnswer", ipSdpAnswer);
        sender.sendMessage(receiveVideoAnswer);

        remoteEndpoint.gatherCandidates();
    }

    public void addCandidate(UserSession user, IceCandidate candidate) {
        WebRtcEndpoint endpoint = user.getWebRtcEndpoint();
        endpoint.addIceCandidate(candidate);
    }

    public void removeParticipant(String name) {
        participants.remove(name);

        JsonObject participantLeftMsg = new JsonObject();
        participantLeftMsg.addProperty("id", "participantLeft");
        participantLeftMsg.addProperty("name", name);

        for (UserSession participant : participants.values()) {
            try {
				participant.sendMessage(participantLeftMsg);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
    }

    @Override
    public void close() {
        for (UserSession user : participants.values()) {
            try {
                user.close();
            } catch (IOException e) {
                // 로그 처리
            }
        }

        participants.clear();

        if (pipeline != null) {
            pipeline.release();
        }
    }
}