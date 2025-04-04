// ChatController.java
package com.ahch.controller;

import com.ahch.entity.ChatMessage;
import com.ahch.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ChatController {

    private final ChatService chatService;

    // Map to hold active SSE emitters per user (key: user ID)
    private final ConcurrentHashMap<Integer, CopyOnWriteArrayList<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // WebSocket endpoint for sending chat messages
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessageWebSocket(@Payload ChatMessage chatMessage) {
        return chatService.saveMessage(chatMessage);
    }

    // WebSocket endpoint for towing request notifications
    @MessageMapping("/towing.request")
    @SendTo("/topic/towing")
    public Map<String, Object> sendTowingRequest(@Payload Map<String, Object> towingRequest) {
        // You can process/save the towing request here if needed
        return towingRequest;
    }

    // WebSocket endpoint for towing status updates
    @MessageMapping("/towing.update")
    @SendTo("/topic/towing")
    public Map<String, Object> updateTowingStatus(@Payload Map<String, Object> towingUpdate) {
        // You can process the status update here if needed
        return towingUpdate;
    }

    // SSE endpoint: clients subscribe to receive events.
    @GetMapping("/stream/{userId}")
    public SseEmitter stream(@PathVariable Integer userId) {
        // Create emitter with no timeout
        SseEmitter emitter = new SseEmitter(0L);
        emitters.computeIfAbsent(userId, key -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> emitters.get(userId).remove(emitter));
        emitter.onTimeout(() -> emitters.get(userId).remove(emitter));
        emitter.onError((ex) -> emitters.get(userId).remove(emitter));

        return emitter;
    }

    // POST endpoint to send a chat message
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage chatMessage) {
        ChatMessage savedMessage = chatService.saveMessage(chatMessage);

        // Send message to the receiver's SSE stream
        if (emitters.containsKey(chatMessage.getReceiverId())) {
            for (SseEmitter emitter : emitters.get(chatMessage.getReceiverId())) {
                try {
                    emitter.send(SseEmitter.event().name("chat").data(savedMessage));
                } catch (IOException e) {
                    emitter.completeWithError(e);
                }
            }
        }

        return ResponseEntity.ok(savedMessage);
    }

    // Get chat history for an agent
    @GetMapping("/history/{agentId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable Integer agentId) {
        List<ChatMessage> messages = chatService.getMessagesForAgent(agentId);
        return ResponseEntity.ok(messages);
    }

    // Get conversation between two users
    @GetMapping("/conversation/{userId1}/{userId2}")
    public ResponseEntity<List<ChatMessage>> getConversation(
            @PathVariable Integer userId1,
            @PathVariable Integer userId2) {
        List<ChatMessage> messages = chatService.getConversation(userId1, userId2);
        return ResponseEntity.ok(messages);
    }

    // Mark conversation as read
    @PostMapping("/mark-read/{senderId}/{receiverId}")
    public ResponseEntity<?> markAsRead(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId) {
        chatService.markConversationAsRead(senderId, receiverId);
        return ResponseEntity.ok().build();
    }

    // Get all conversations for an agent
    @GetMapping("/conversations/agent/{agentId}")
    public ResponseEntity<List<Map<String, Object>>> getAgentConversations(
            @PathVariable Integer agentId) {
        List<Map<String, Object>> conversations = chatService.getConversationsForAgent(agentId);
        return ResponseEntity.ok(conversations);
    }

    // Send system notification to a user
    @PostMapping("/notify/{userId}")
    public ResponseEntity<?> sendNotification(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> notification) {
        chatService.sendSystemNotification(userId, notification.get("content"));
        return ResponseEntity.ok().build();
    }

    // Simple connectivity test endpoint
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testConnection() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Chat API connection successful");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    // Special endpoint to test CORS with no authentication requirements
    @GetMapping("/cors-test")
    @CrossOrigin(origins = "*", allowCredentials = "false")
    public ResponseEntity<Map<String, Object>> corsTest() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "CORS test passed");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("cors", "enabled");
        return ResponseEntity.ok(response);
    }

    // Test endpoint to send a WebSocket message
    @GetMapping("/send-test")
    public ResponseEntity<Map<String, Object>> sendTestMessage() {
        // Create a test chat message
        ChatMessage testMessage = new ChatMessage();
        testMessage.setSenderId(0);
        testMessage.setSenderName("System Test");
        testMessage.setContent("This is a test message from the server. If you can see this, WebSocket is working!");
        testMessage.setTimestamp(LocalDateTime.now());
        testMessage.setRead(false);
        testMessage.setType(ChatMessage.MessageType.NOTIFICATION);

        // Save the message
        ChatMessage savedMessage = chatService.saveMessage(testMessage);

        // Create response
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Test message sent via WebSocket");
        response.put("sentMessageId", savedMessage.getId());

        // Send via WebSocket
        try {
            // Send via WebSocket - bypassing the return value
            ChatMessage broadcasted = sendMessageWebSocket(savedMessage);
            response.put("broadcastedMessage", broadcasted);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error sending test message: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
