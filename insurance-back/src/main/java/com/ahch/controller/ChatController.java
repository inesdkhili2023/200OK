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
        try {
            // Set defaults for null values
            if (chatMessage.getType() == null) {
                chatMessage.setType(ChatMessage.MessageType.TEXT);
            }

            // Ensure message has required fields
            if (chatMessage.getTimestamp() == null) {
                chatMessage.setTimestamp(LocalDateTime.now());
            }

            if (chatMessage.getSenderId() == null) {
                chatMessage.setSenderId(0);
            }

            if (chatMessage.getSenderName() == null || chatMessage.getSenderName().isEmpty()) {
                chatMessage.setSenderName("System");
            }

            return chatService.saveMessage(chatMessage);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error processing WebSocket message: " + e.getMessage());
            e.printStackTrace();

            // Create a fallback message
            ChatMessage errorMessage = new ChatMessage();
            errorMessage.setSenderId(0);
            errorMessage.setSenderName("System");
            errorMessage.setContent("Error processing message: " + e.getMessage());
            errorMessage.setTimestamp(LocalDateTime.now());
            errorMessage.setRead(false);
            errorMessage.setType(ChatMessage.MessageType.SYSTEM);

            return errorMessage;
        }
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
    @GetMapping({"/chat/stream/{userId}", "/api/chat/stream/{userId}"})
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
    @PostMapping({"/chat/send", "/api/chat/send"})
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage chatMessage) {
        try {
            // Set defaults for null values
            if (chatMessage.getType() == null) {
                chatMessage.setType(ChatMessage.MessageType.TEXT);
            }
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
        } catch (Exception e) {
            System.err.println("Error sending message: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Get chat history for an agent
    @GetMapping({"/chat/history/{agentId}", "/api/chat/history/{agentId}"})
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable Integer agentId) {
        try {
            List<ChatMessage> messages = chatService.getMessagesForAgent(agentId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            System.err.println("Error fetching chat history: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Get conversation between two users
    @GetMapping({"/chat/conversation/{userId1}/{userId2}", "/api/chat/conversation/{userId1}/{userId2}"})
    public ResponseEntity<List<ChatMessage>> getConversation(
            @PathVariable Integer userId1,
            @PathVariable Integer userId2) {
        try {
            List<ChatMessage> messages = chatService.getConversation(userId1, userId2);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            System.err.println("Error fetching conversation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Mark conversation as read
    @PostMapping({"/chat/mark-read/{senderId}/{receiverId}", "/api/chat/mark-read/{senderId}/{receiverId}"})
    public ResponseEntity<?> markAsRead(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId) {
        try {
            chatService.markConversationAsRead(senderId, receiverId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error marking conversation as read: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Get all conversations for an agent
    @GetMapping({"/chat/conversations/agent/{agentId}", "/api/chat/conversations/agent/{agentId}"})
    public ResponseEntity<List<Map<String, Object>>> getAgentConversations(
            @PathVariable Integer agentId) {
        try {
            List<Map<String, Object>> conversations = chatService.getConversationsForAgent(agentId);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            System.err.println("Error fetching agent conversations: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Send system notification to a user
    @PostMapping({"/chat/notify/{userId}", "/api/chat/notify/{userId}"})
    public ResponseEntity<?> sendNotification(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> notification) {
        try {
            chatService.sendSystemNotification(userId, notification.get("content"));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error sending notification: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Simple connectivity test endpoint
    @GetMapping({"/chat/test", "/api/chat/test"})
    public ResponseEntity<Map<String, Object>> testConnection() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Chat API connection successful");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    // Special endpoint to test CORS with no authentication requirements
    @GetMapping({"/chat/cors-test", "/api/chat/cors-test"})
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
    @GetMapping({"/chat/send-test", "/api/chat/send-test"})
    public ResponseEntity<Map<String, Object>> sendTestMessage() {
        try {
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

            // Send via WebSocket - bypassing the return value
            ChatMessage broadcasted = sendMessageWebSocket(savedMessage);
            response.put("broadcastedMessage", broadcasted);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in send-test: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error sending test message: " + e.getMessage());
            response.put("exception", e.getClass().getName());
            return ResponseEntity.status(500).body(response);
        }
    }
}
