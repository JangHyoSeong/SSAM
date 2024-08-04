package com.ssafy.ssam.domain.webrtc.model;

import java.io.Closeable;
import java.io.IOException;

import org.kurento.client.IceCandidate;
import org.kurento.client.WebRtcEndpoint;
import org.kurento.jsonrpc.JsonUtils;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.google.gson.JsonObject;

public class UserSession implements Closeable {
    private final String name;
    private final WebSocketSession session;
    
    private final ConsultationRoom room;
    private WebRtcEndpoint webRtcEndpoint;

    public UserSession(String name, WebSocketSession session, ConsultationRoom room) {
        this.name = name;
        this.session = session;
        this.room = room;
    }

    public String getName() {
        return name;
    }

    public WebSocketSession getSession() {
        return session;
    }

    public ConsultationRoom getRoom() {
        return room;
    }

    public void setWebRtcEndpoint(WebRtcEndpoint webRtcEndpoint) {
        this.webRtcEndpoint = webRtcEndpoint;

        webRtcEndpoint.addIceCandidateFoundListener(event -> {
            JsonObject response = new JsonObject();
            response.addProperty("id", "iceCandidate");
            response.addProperty("name", name);
            response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
            try {
                sendMessage(response);
            } catch (IOException e) {
                System.err.println("Error sending ICE candidate: " + e.getMessage());
            }
        });
    }

    public WebRtcEndpoint getWebRtcEndpoint() {
        return webRtcEndpoint;
    }

    public void sendMessage(JsonObject message) throws IOException {
        synchronized (session) {
            session.sendMessage(new TextMessage(message.toString()));
        }
    }

    public void addCandidate(IceCandidate candidate) {
        webRtcEndpoint.addIceCandidate(candidate);
    }

    public void receiveVideoFrom(String senderName, String sdpOffer) throws IOException {
        room.receiveVideoFrom(this, senderName, sdpOffer);
    }

    @Override
    public void close() throws IOException {
        System.out.println("PARTICIPANT " + name + ": Releasing resources");
        if (this.webRtcEndpoint != null) {
            this.webRtcEndpoint.release();
        }
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof UserSession)) {
            return false;
        }
        UserSession other = (UserSession) obj;
        return name.equals(other.name);
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }
}