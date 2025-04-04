package com.ahch.service;

import com.ahch.Repo.AgentTowingRepository;
import com.ahch.Repo.ChatMessageRepository;
import com.ahch.Repo.UserRepository;
import com.ahch.entity.AgentTowing;
import com.ahch.entity.ChatMessage;
import com.ahch.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final AgentTowingRepository agentRepository;
    private final UserRepository userRepository;

    public ChatService(ChatMessageRepository chatMessageRepository,
                       AgentTowingRepository agentRepository,
                       UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.agentRepository = agentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ChatMessage saveMessage(ChatMessage message) {
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getConversation(Integer user1Id, Integer user2Id) {
        return chatMessageRepository.findConversationBetweenUsers(user1Id, user2Id);
    }

    public List<ChatMessage> getMessagesForAgent(Integer agentId) {
        // Get messages where the agent is either sender or receiver
        return chatMessageRepository.findMessagesByAgentId(agentId);
    }

    @Transactional
    public void markConversationAsRead(Integer senderId, Integer receiverId) {
        List<ChatMessage> messages = chatMessageRepository.findConversationBetweenUsers(senderId, receiverId);
        messages.stream()
                .filter(msg -> msg.getSenderId().equals(senderId) && msg.getReceiverId().equals(receiverId) && !msg.isRead())
                .forEach(msg -> {
                    msg.setRead(true);
                    chatMessageRepository.save(msg);
                });
    }

    public List<Map<String, Object>> getConversationsForAgent(Integer agentId) {
        List<Integer> partnerIds = chatMessageRepository.findAllConversationPartnerIds(agentId);
        List<Map<String, Object>> conversations = new ArrayList<>();

        for (Integer partnerId : partnerIds) {
            Optional<User> partnerOpt = userRepository.findById(partnerId);
            if (partnerOpt.isPresent()) {
                User partner = partnerOpt.get();

                // Get the most recent message
                List<ChatMessage> recentMessages = chatMessageRepository.findConversationBetweenUsers(agentId, partnerId);
                ChatMessage lastMessage = recentMessages.isEmpty() ? null :
                        recentMessages.get(recentMessages.size() - 1);

                // Count unread messages
                long unreadCount = recentMessages.stream()
                        .filter(msg -> msg.getReceiverId().equals(agentId) && !msg.isRead())
                        .count();

                Map<String, Object> conversationData = new HashMap<>();
                conversationData.put("userId", partner.getIdUser());
                conversationData.put("name", partner.getName());
                conversationData.put("lastMessage", lastMessage != null ? lastMessage.getContent() : "");
                conversationData.put("lastMessageTime", lastMessage != null ? lastMessage.getTimestamp() : null);
                conversationData.put("unreadCount", unreadCount);

                conversations.add(conversationData);
            }
        }

        // Sort by last message time, newest first
        conversations.sort((c1, c2) -> {
            LocalDateTime time1 = (LocalDateTime) c1.get("lastMessageTime");
            LocalDateTime time2 = (LocalDateTime) c2.get("lastMessageTime");
            if (time1 == null) return 1;
            if (time2 == null) return -1;
            return time2.compareTo(time1);
        });

        return conversations;
    }

    @Transactional
    public void sendSystemNotification(Integer receiverId, String content) {
        ChatMessage notification = new ChatMessage();
        notification.setSenderId(0); // System sender ID
        notification.setSenderName("System");
        notification.setReceiverId(receiverId);
        notification.setContent(content);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notification.setType(ChatMessage.MessageType.NOTIFICATION);

        chatMessageRepository.save(notification);
    }
}