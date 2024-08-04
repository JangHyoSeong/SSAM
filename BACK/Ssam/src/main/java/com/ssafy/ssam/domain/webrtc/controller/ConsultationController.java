package com.ssafy.ssam.domain.webrtc.controller;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.kurento.client.IceCandidate;
import org.kurento.client.KurentoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ssafy.ssam.domain.webrtc.dto.RoomRequest;
import com.ssafy.ssam.domain.webrtc.model.ConsultationRoom;
import com.ssafy.ssam.domain.webrtc.model.UserSession;

@CrossOrigin(origins = {"http://localhost:5173", "https://i11e201.p.ssafy.io"}, allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/v1/kurento")
@EnableWebSocket
public class ConsultationController extends TextWebSocketHandler implements WebSocketConfigurer {

    @Autowired
    private KurentoClient kurentoClient;

    private final ConcurrentHashMap<String, ConsultationRoom> consultationRooms = new ConcurrentHashMap<>();
    private final Map<String, UserSession> users = new ConcurrentHashMap<>();

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(this, "/v1/kurento")
                .setAllowedOrigins("http://localhost:5173", "https://i11e201.p.ssafy.io");
    }

    // 기존의 PostMapping, DeleteMapping 메서드들은 그대로 유지
    @PostMapping("/room")
    public ResponseEntity<String> createRoom(@RequestBody RoomRequest roomRequest) {
        String roomName = roomRequest.getRoomName();
        if (consultationRooms.containsKey(roomName)) {
            return ResponseEntity.badRequest().body("Room already exists");
        }
        ConsultationRoom room = new ConsultationRoom(roomName, kurentoClient);
		consultationRooms.put(roomName, room);
		return ResponseEntity.ok("Room created: " + roomName);
    }

    @DeleteMapping("/room/{roomName}")
    public ResponseEntity<String> closeRoom(@PathVariable String roomName) {
        ConsultationRoom room = consultationRooms.remove(roomName);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            room.close();
            return ResponseEntity.ok("Room closed: " + roomName);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to close room: " + e.getMessage());
        }
    }
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // WebSocket 연결 설정 후 처리
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JsonObject jsonMessage = JsonParser.parseString(message.getPayload()).getAsJsonObject();
        UserSession user = users.get(session.getId());

        if (user != null) {
            handleMessageFromRegisteredUser(user, jsonMessage);
        } else {
            handleMessageFromNewUser(session, jsonMessage);
        }
    }

    private void handleMessageFromRegisteredUser(UserSession user, JsonObject jsonMessage) throws IOException {
        String messageType = jsonMessage.get("id").getAsString();
        switch (messageType) {
            case "receiveVideoFrom":
                handleReceiveVideoFrom(user, jsonMessage);
                break;
            case "leaveRoom":
                leaveRoom(user);
                break;
            case "onIceCandidate":
                handleOnIceCandidate(user, jsonMessage);
                break;
            default:
                handleError(user.getSession(), "Invalid message type: " + messageType);
                break;
        }
    }

    private void handleMessageFromNewUser(WebSocketSession session, JsonObject jsonMessage) throws IOException {
        String messageType = jsonMessage.get("id").getAsString();
        if ("joinRoom".equals(messageType)) {
            joinRoom(jsonMessage, session);
        } else {
            handleError(session, "Invalid message type for a new user: " + messageType);
        }
    }

    private void joinRoom(JsonObject params, WebSocketSession session) throws IOException {
        String roomName = params.get("room").getAsString();
        String userName = params.get("name").getAsString();

        ConsultationRoom room = consultationRooms.get(roomName);
        if (room == null) {
            handleError(session, "Room " + roomName + " does not exist");
            return;
        }

        UserSession user = room.join(userName, session);
        users.put(session.getId(), user);
    }

    private void handleReceiveVideoFrom(UserSession user, JsonObject jsonMessage) throws IOException {
        String senderName = jsonMessage.get("sender").getAsString();
        String sdpOffer = jsonMessage.get("sdpOffer").getAsString();
        try {
            user.receiveVideoFrom(senderName, sdpOffer);
        } catch (IOException e) {
        	System.out.printf("Error processing receiveVideoFrom: {%s}", e.getMessage());
            handleError(user.getSession(), "Failed to process receiveVideoFrom: " + e.getMessage());
        }
    }

    private void leaveRoom(UserSession user) throws IOException {
        ConsultationRoom room = user.getRoom();
        room.leave(user);
        users.remove(user.getSession().getId());
    }

    private void handleOnIceCandidate(UserSession user, JsonObject jsonMessage) {
        JsonObject candidate = jsonMessage.get("candidate").getAsJsonObject();
        IceCandidate iceCandidate = new IceCandidate(
            candidate.get("candidate").getAsString(),
            candidate.get("sdpMid").getAsString(),
            candidate.get("sdpMLineIndex").getAsInt());
        user.addCandidate(iceCandidate);
    }

    private void handleError(WebSocketSession session, String message) throws IOException {
        JsonObject response = new JsonObject();
        response.addProperty("id", "error");
        response.addProperty("message", message);
        session.sendMessage(new TextMessage(response.toString()));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        UserSession user = users.remove(session.getId());
        if (user != null) {
            leaveRoom(user);
        }
    }
}