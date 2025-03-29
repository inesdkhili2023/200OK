// ChatController.java
package com.ahch.controller;

import com.ahch.entity.ChatMessage;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    // Map to hold active SSE emitters per user (key: user ID)
    private ConcurrentHashMap<String, CopyOnWriteArrayList<SseEmitter>> emitters = new ConcurrentHashMap<>();

    // SSE endpoint: clients subscribe to receive events.
    @GetMapping("/stream/{userId}")
    public SseEmitter stream(@PathVariable String userId) {
        // Create emitter with no timeout
        SseEmitter emitter = new SseEmitter(0L);
        emitters.computeIfAbsent(userId, key -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> emitters.get(userId).remove(emitter));
        emitter.onTimeout(() -> emitters.get(userId).remove(emitter));
        emitter.onError((ex) -> emitters.get(userId).remove(emitter));

        return emitter;
    }

    // POST endpoint to send a chat message (or notification)
    @PostMapping("/send")
    public void sendMessage(@RequestBody ChatMessage chatMessage) {
        // Set the timestamp when message is sent
        chatMessage.setTimestamp(LocalDateTime.now());
        // Send message to the receiver's SSE stream
        if (emitters.containsKey(chatMessage.getReceiver())) {
            for (SseEmitter emitter : emitters.get(chatMessage.getReceiver())) {
                try {
                    emitter.send(SseEmitter.event().name("chat").data(chatMessage));
                } catch (IOException e) {
                    emitter.completeWithError(e);
                }
            }
        }
        // Optionally, echo the message to the sender’s stream as well.
        if (emitters.containsKey(chatMessage.getSender())) {
            for (SseEmitter emitter : emitters.get(chatMessage.getSender())) {
                try {
                    emitter.send(SseEmitter.event().name("chat").data(chatMessage));
                } catch (IOException e) {
                    emitter.completeWithError(e);
                }
            }
        }
    }
}
