package com.ahch.controller;

import com.ahch.Repo.AgentTowingRepository;
import com.ahch.entity.ChatMessage;
import com.ahch.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationController {

    private final NotificationService notificationService;
    private final AgentTowingRepository agentRepository;

    public NotificationController(NotificationService notificationService,
                                  AgentTowingRepository agentRepository) {
        this.notificationService = notificationService;
        this.agentRepository = agentRepository;
    }

    /**
     * Get all unread notifications for an agent
     */
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<ChatMessage>> getAgentNotifications(@PathVariable Integer agentId) {
        List<ChatMessage> notifications = notificationService.getAgentUnreadNotifications(agentId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Mark a notification as read
     */
    @PostMapping("/{notificationId}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Long notificationId) {
        boolean success = notificationService.markNotificationAsRead(notificationId);

        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Notification not found");
        }
    }

    /**
     * Send a notification to an agent
     */
    @PostMapping("/send/agent/{agentId}")
    public ResponseEntity<?> sendNotificationToAgent(
            @PathVariable Integer agentId,
            @RequestBody Map<String, String> payload) {

        String message = payload.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty");
        }

        try {
            ChatMessage notification = notificationService.notifyAgent(agentId, message);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending notification: " + e.getMessage());
        }
    }

    /**
     * Broadcast a notification to all agents
     */
    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcastNotification(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty");
        }

        try {
            // Get all agent IDs
            List<Integer> agentIds = agentRepository.findAll().stream()
                    .map(a -> a.getIdAgent())
                    .collect(Collectors.toList());

            int count = notificationService.broadcastNotification(message, agentIds);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notification broadcast successful");
            response.put("recipientCount", count);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error broadcasting notification: " + e.getMessage());
        }
    }
}