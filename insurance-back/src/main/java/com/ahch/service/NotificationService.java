package com.ahch.service;

import com.ahch.Repo.ChatMessageRepository;
import com.ahch.entity.ChatMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final ChatMessageRepository chatMessageRepository;

    public NotificationService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    /**
     * Get all notifications
     * @return List of all notifications
     */
    public List<ChatMessage> getAllNotifications() {
        try {
            return chatMessageRepository.findAll().stream()
                    .filter(msg -> msg != null && msg.getType() != null &&
                            (msg.getType() == ChatMessage.MessageType.NOTIFICATION ||
                                    msg.getType() == ChatMessage.MessageType.SYSTEM))
                    .toList();
        } catch (Exception e) {
            // Log the error with stack trace
            System.err.println("Error getting all notifications: " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of throwing
            return new ArrayList<>();
        }
    }

    /**
     * Get all notifications for a specific agent (read and unread)
     * @param agentId The ID of the agent
     * @return List of notifications for the agent
     */
    public List<ChatMessage> getAgentNotifications(Integer agentId) {
        if (agentId == null) {
            return new ArrayList<>();
        }

        try {
            return chatMessageRepository.findMessagesByAgentId(agentId).stream()
                    .filter(msg -> msg != null &&
                            msg.getType() != null &&
                            (msg.getType() == ChatMessage.MessageType.NOTIFICATION ||
                                    msg.getType() == ChatMessage.MessageType.SYSTEM))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // Log the error with stack trace
            System.err.println("Error getting notifications for agent " + agentId + ": " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of throwing
            return new ArrayList<>();
        }
    }

    /**
     * Send a notification to an agent
     * @param agentId The ID of the agent to notify
     * @param message The notification message
     * @return The created notification
     */
    @Transactional
    public ChatMessage notifyAgent(Integer agentId, String message) {
        ChatMessage notification = new ChatMessage();
        notification.setReceiverId(agentId);
        notification.setContent(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notification.setType(ChatMessage.MessageType.NOTIFICATION);

        return chatMessageRepository.save(notification);
    }

    public ChatMessage notifyTowingRequest(Integer agentId, Long towingId, String location) {
        String message = String.format("New towing request POL-%dT at %s", towingId, location);
        return notifyAgent(agentId, message);
    }

    public ChatMessage notifyTowingUpdate(Integer agentId, Long towingId, String status, String location) {
        String message = String.format("Towing request POL-%dT status updated to %s", towingId, status);
        if (location != null && !location.isEmpty()) {
            message += String.format(" at %s", location);
        }
        return notifyAgent(agentId, message);
    }

    /**
     * Get all unread notifications for an agent
     * @param agentId The ID of the agent
     * @return List of unread notifications
     */
    public List<ChatMessage> getAgentUnreadNotifications(Integer agentId) {
        return chatMessageRepository.findAll().stream()
                .filter(msg -> msg.getReceiverId() != null &&
                        msg.getReceiverId().equals(agentId) &&
                        (msg.getType() == ChatMessage.MessageType.NOTIFICATION ||
                                msg.getType() == ChatMessage.MessageType.SYSTEM) &&
                        !msg.isRead())
                .toList();
    }

    /**
     * Mark a notification as read
     * @param notificationId The ID of the notification to mark
     * @return true if successful, false otherwise
     */
    @Transactional
    public boolean markNotificationAsRead(Long notificationId) {
        return chatMessageRepository.findById(notificationId)
                .map(notification -> {
                    notification.setRead(true);
                    chatMessageRepository.save(notification);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Send a notification to all agents (broadcast)
     * @param message The message to broadcast
     * @param recipientIds The IDs of the recipients
     * @return The number of notifications sent
     */
    @Transactional
    public int broadcastNotification(String message, List<Integer> recipientIds) {
        int count = 0;
        for (Integer recipientId : recipientIds) {
            notifyAgent(recipientId, message);
            count++;
        }
        return count;
    }
}