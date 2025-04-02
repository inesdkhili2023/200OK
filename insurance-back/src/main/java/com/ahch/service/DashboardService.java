package com.ahch.service;

import com.ahch.Repo.AgentTowingRepository;
import com.ahch.Repo.ChatMessageRepository;
import com.ahch.Repo.TowingRepository;
import com.ahch.entity.AgentTowing;
import com.ahch.entity.ChatMessage;
import com.ahch.entity.Towing;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TowingRepository towingRepository;
    private final AgentTowingRepository agentRepository;
    private final ChatMessageRepository chatMessageRepository;

    public DashboardService(TowingRepository towingRepository,
                            AgentTowingRepository agentRepository,
                            ChatMessageRepository chatMessageRepository) {
        this.towingRepository = towingRepository;
        this.agentRepository = agentRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    /**
     * Get dashboard statistics for an agent
     */
    public Map<String, Object> getAgentDashboardStats(Integer agentId) {
        Map<String, Object> stats = new HashMap<>();

        Optional<AgentTowing> agent = agentRepository.findById(agentId);
        if (!agent.isPresent()) {
            throw new IllegalArgumentException("Agent not found with ID: " + agentId);
        }

        // Get all towings for this agent
        List<Towing> agentTowings = towingRepository.findAll().stream()
                .filter(t -> t.getAgent() != null && t.getAgent().getId().equals(agentId))
                .collect(Collectors.toList());

        // Calculate statistics
        int totalRequests = agentTowings.size();
        long pendingRequests = agentTowings.stream()
                .filter(t -> "PENDING".equalsIgnoreCase(t.getStatus()))
                .count();
        long completedRequests = agentTowings.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count();

        // Unread messages count
        long unreadMessages = chatMessageRepository.countUnreadMessagesForUser(agentId);

        // Recent requests (last 5)
        List<Towing> recentRequests = agentTowings.stream()
                .sorted((t1, t2) -> t2.getRequestDate().compareTo(t1.getRequestDate()))
                .limit(5)
                .collect(Collectors.toList());

        // Populate the stats map
        stats.put("agentName", agent.get().getName());
        stats.put("totalRequests", totalRequests);
        stats.put("pendingRequests", pendingRequests);
        stats.put("completedRequests", completedRequests);
        stats.put("unreadMessages", unreadMessages);
        stats.put("recentRequests", recentRequests);

        // Calculate agent rating if available
        double averageRating = 0.0;
        if (completedRequests > 0) {
            // Assume there's a rating field in your Towing entity
            // If not, you'll need to adjust this calculation
            averageRating = agentTowings.stream()
                    .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()) && t.getRating() != null)
                    .mapToDouble(Towing::getRating)
                    .average()
                    .orElse(0.0);
        }
        stats.put("averageRating", averageRating);

        // Add notifications (last 5 system notifications)
        List<ChatMessage> notifications = chatMessageRepository.findRecentMessagesForUser(agentId, 5).stream()
                .filter(m -> m.getType() == ChatMessage.MessageType.NOTIFICATION || m.getType() == ChatMessage.MessageType.SYSTEM)
                .collect(Collectors.toList());
        stats.put("notifications", notifications);

        return stats;
    }
}