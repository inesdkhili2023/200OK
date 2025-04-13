package com.ahch.controller;

import com.ahch.Repo.AgentTowingRepository;
import com.ahch.entity.ChatMessage;
import com.ahch.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
     * Get all notifications, with optional filtering by agentId
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllNotifications(
            @RequestParam(required = false) Integer agentId) {
        try {
            List<ChatMessage> notifications;

            if (agentId != null) {
                // Get notifications for a specific agent
                notifications = notificationService.getAgentNotifications(agentId);
            } else {
                // Get all notifications
                notifications = notificationService.getAllNotifications();
            }

            List<Map<String, Object>> formattedNotifications = notifications.stream()
                    .filter(notification -> notification != null)
                    .map(notification -> {
                        Map<String, Object> formatted = new HashMap<>();
                        formatted.put("id", notification.getId() != null ? notification.getId().toString() : "");
                        formatted.put("message", notification.getContent() != null ? notification.getContent() : "");
                        formatted.put("policyNumber", notification.getId() != null ? "POL-" + (100000 + notification.getId()) : "");
                        formatted.put("date", notification.getTimestamp() != null ? notification.getTimestamp() : LocalDateTime.now());
                        formatted.put("read", notification.isRead());
                        formatted.put("status", determineStatus(notification));

                        // Include agent ID if the notification is for an agent
                        if (notification.getReceiverId() != null) {
                            formatted.put("agentId", notification.getReceiverId());
                        }

                        return formatted;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(formattedNotifications);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error getting notifications: " + e.getMessage());
            // Return empty list with 200 status instead of 500
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Helper method to determine notification status
     */
    private String determineStatus(ChatMessage notification) {
        if (notification == null || notification.getContent() == null) {
            return "new";
        }

        String content = notification.getContent().toLowerCase();
        if (content.contains("completed")) {
            return "completed";
        } else if (content.contains("progress")) {
            return "in-progress";
        } else {
            return "new";
        }
    }

    /**
     * Get all unread notifications for an agent (deprecated, use main endpoint with agentId parameter)
     */
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<Map<String, Object>>> getAgentNotifications(@PathVariable Integer agentId) {
        try {
            List<ChatMessage> notifications = notificationService.getAgentNotifications(agentId);

            List<Map<String, Object>> formattedNotifications = notifications.stream()
                    .filter(notification -> notification != null)
                    .map(notification -> {
                        Map<String, Object> formatted = new HashMap<>();
                        formatted.put("id", notification.getId() != null ? notification.getId().toString() : "");
                        formatted.put("message", notification.getContent() != null ? notification.getContent() : "");
                        formatted.put("policyNumber", notification.getId() != null ? "POL-" + (100000 + notification.getId()) : "");
                        formatted.put("date", notification.getTimestamp() != null ? notification.getTimestamp() : LocalDateTime.now());
                        formatted.put("read", notification.isRead());
                        formatted.put("status", determineStatus(notification));
                        formatted.put("agentId", notification.getReceiverId());

                        // Extract towing ID and location from notification content if present
                        String content = notification.getContent() != null ? notification.getContent().toLowerCase() : "";
                        if (content.contains("towing request")) {
                            try {
                                // Extract towing ID from policy ref
                                String[] parts = content.split("pol-");
                                if (parts.length > 1) {
                                    String policyRef = parts[1].split(" ")[0];
                                    String towingId = policyRef.split("t")[0];
                                    formatted.put("towingId", Long.parseLong(towingId));
                                }

                                // Extract location if present
                                if (content.contains(" at ")) {
                                    String location = content.split(" at ")[1].split(" \\(")[0];
                                    formatted.put("location", location);
                                }
                            } catch (Exception e) {
                                // Log error but continue processing
                                System.err.println("Error parsing towing details: " + e.getMessage());
                            }
                        }

                        return formatted;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(formattedNotifications);
        } catch (Exception e) {
            System.err.println("Error getting agent notifications for agent ID " + agentId + ": " + e.getMessage());
            e.printStackTrace();
            // Return empty list with 200 status instead of 500
            return ResponseEntity.ok(new ArrayList<>());
        }
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

            // Return the formatted notification
            Map<String, Object> formatted = new HashMap<>();
            formatted.put("id", notification.getId().toString());
            formatted.put("message", notification.getContent());
            formatted.put("policyNumber", "POL-" + (100000 + notification.getId()));
            formatted.put("date", notification.getTimestamp());
            formatted.put("read", notification.isRead());
            formatted.put("status", determineStatus(notification));
            formatted.put("agentId", notification.getReceiverId());

            return ResponseEntity.ok(formatted);
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

    /**
     * Update towing status and send notification
     */
    @PostMapping("/towing-status")
    public ResponseEntity<?> updateTowingStatus(@RequestBody Map<String, Object> payload) {
        try {
            Long towingId = Long.parseLong(payload.get("towingId").toString());
            String status = payload.get("status").toString();
            String location = payload.get("location") != null ? payload.get("location").toString() : null;
            Integer agentId = payload.get("agentId") != null ? Integer.parseInt(payload.get("agentId").toString()) : null;

            if (agentId == null) {
                return ResponseEntity.badRequest().body("Agent ID is required");
            }

            String notificationMessage = String.format("Towing request POL-%dT status updated to %s",
                    towingId, status);
            if (location != null) {
                notificationMessage += String.format(" at %s", location);
            }

            ChatMessage notification = notificationService.notifyAgent(agentId, notificationMessage);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Status updated successfully");
            response.put("notification", notification);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating towing status: " + e.getMessage());
        }
    }
}