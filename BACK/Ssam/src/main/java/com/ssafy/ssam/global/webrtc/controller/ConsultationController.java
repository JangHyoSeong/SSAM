package com.ssafy.ssam.domain.webrtc.controller;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import org.kurento.client.KurentoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.ssafy.ssam.domain.webrtc.model.ConsultationRoom;

@RestController
@RequestMapping("/api/consultation")
public class ConsultationController extends TextWebSocketHandler {

    @Autowired
    private KurentoClient kurentoClient;

    private final ConcurrentHashMap<String, ConsultationRoom> consultationRooms = new ConcurrentHashMap<>();

    @PostMapping("/room")
    public ResponseEntity<String> createRoom(@RequestParam String roomName) {
        if (consultationRooms.containsKey(roomName)) {
            return ResponseEntity.badRequest().body("Room already exists");
        }
        try {
            ConsultationRoom room = new ConsultationRoom(roomName, kurentoClient);
            consultationRooms.put(roomName, room);
            return ResponseEntity.ok("Room created: " + roomName);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to create room: " + e.getMessage());
        }
    }

    @DeleteMapping("/room/{roomName}")
    public ResponseEntity<String> closeRoom(@PathVariable String roomName) {
        ConsultationRoom room = consultationRooms.remove(roomName);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            room.closeRoom();
            return ResponseEntity.ok("Room closed: " + roomName);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to close room: " + e.getMessage());
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // WebSocket 연결 성공 시 처리
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        JsonObject jsonMessage = new Gson().fromJson(payload, JsonObject.class);

        switch (jsonMessage.get("id").getAsString()) {
            case "join":
                joinRoom(jsonMessage, session);
                break;
            case "leave":
                leaveRoom(jsonMessage, session);
                break;
            case "onIceCandidate":
                handleIceCandidate(jsonMessage, session);
                break;
            default:
                handleError(session, "Invalid message with id " + jsonMessage.get("id").getAsString());
                break;
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

        if (room.join(userName, session)) {
            // 성공적으로 방에 입장
            JsonObject response = new JsonObject();
            response.addProperty("id", "joinedRoom");
            response.addProperty("roomName", roomName);
            sendMessage(session, response.toString());
        } else {
            handleError(session, "Room " + roomName + " is full");
        }
    }

    private void leaveRoom(JsonObject params, WebSocketSession session) throws IOException {
        String roomName = params.get("room").getAsString();
        String userName = params.get("name").getAsString();

        ConsultationRoom room = consultationRooms.get(roomName);
        if (room != null) {
            room.leave(userName);
            JsonObject response = new JsonObject();
            response.addProperty("id", "leftRoom");
            sendMessage(session, response.toString());
        } else {
            handleError(session, "Room " + roomName + " does not exist");
        }
    }

    private void handleIceCandidate(JsonObject params, WebSocketSession session) {
        // ICE candidate 처리 로직
    }

    private void handleError(WebSocketSession session, String message) throws IOException {
        JsonObject response = new JsonObject();
        response.addProperty("id", "error");
        response.addProperty("message", message);
        sendMessage(session, response.toString());
    }

    private void sendMessage(WebSocketSession session, String message) throws IOException {
        session.sendMessage(new TextMessage(message));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // WebSocket 연결 종료 시 처리
    }
}