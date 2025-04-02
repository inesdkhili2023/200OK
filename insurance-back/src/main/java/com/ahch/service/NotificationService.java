package com.ahch.service;

import com.ahch.Repo.ChatMessageRepository;
import com.ahch.entity.ChatMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final ChatMessageRepository chatMessageRepository;

    public NotificationService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
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
        notification.setSenderId(0); // System sender ID
        notification.setSenderName("System");
        notification.setReceiverId(agentId);
        notification.setContent(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notification.setType(ChatMessage.MessageType.NOTIFICATION);

        return chatMessageRepository.save(notification);
    }

    /**
     * Get all unread notifications for an agent
     * @param agentId The ID of the agent
     * @return List of unread notifications
     */
    public List<ChatMessage> getAgentUnreadNotifications(Integer agentId) {
        return chatMessageRepository.findAll().stream()
                .filter(msg -> msg.getReceiverId().equals(agentId) &&
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