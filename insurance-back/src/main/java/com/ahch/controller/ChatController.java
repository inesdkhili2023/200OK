// ChatController.java
package com.ahch.controller;

import com.ahch.entity.ChatMessage;
import com.ahch.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatController {

    private final ChatService chatService;

    // Map to hold active SSE emitters per user (key: user ID)
    private final ConcurrentHashMap<Integer, CopyOnWriteArrayList<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
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
}
