package com.ahch.service;

import com.ahch.Repo.AgentTowingRepository;
import com.ahch.Repo.TowingRepository;
import com.ahch.Repo.UserRepository;
import com.ahch.entity.Towing;
import com.ahch.entity.AgentTowing;
import com.ahch.entity.User;
import com.ahch.service.WebhookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.context.ApplicationContext;
import java.util.HashMap;
import java.util.Map;
@Service
public class TowingService {
    private static final Logger logger = LoggerFactory.getLogger(TowingService.class);
    private final SimpMessagingTemplate messagingTemplate;
    private final TowingRepository towingRepository;
    private final AgentTowingRepository agentRepository;
    private final UserRepository userRepository;
    private static final List<String> ALLOWED_STATUSES = Arrays.asList("Pending", "Approved", "Rejected");

    @Autowired
    private GeocodingService geocodingService;

    @Autowired
    private ApplicationContext applicationContext;

    public TowingService(SimpMessagingTemplate messagingTemplate,TowingRepository towingRepository, AgentTowingRepository agentRepository, UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.towingRepository = towingRepository;
        this.agentRepository = agentRepository;
        this.userRepository = userRepository;
    }

    public List<Towing> getAllTowings() {
        return towingRepository.findAll();
    }

    public List<AgentTowing> getAllAgents() {
        return agentRepository.findAll();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Towing getTowingById(Long id) {
        return towingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Towing not found with ID: " + id));
    }

    public Towing addTowing(Towing towing) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        System.out.println("🚀 addTowing() called with data: " + towing);

        if (!ALLOWED_STATUSES.contains(towing.getStatus())) {
            throw new IllegalArgumentException("❌ Invalid status: " + towing.getStatus());
        }

        // ✅ Fetch Coordinates if not provided
        if (towing.getLatitude() == 0 || towing.getLongitude() == 0) {
            double[] coordinates = geocodingService.getCoordinates(towing.getLocation());
            towing.setLatitude(coordinates[0]);
            towing.setLongitude(coordinates[1]);
        }

        System.out.println("✅ Saving Towing Request at Lat: " + towing.getLatitude() + " , Lon: " + towing.getLongitude());

        // ✅ Ensure `requestDate` is correctly set
        if (towing.getRequestDate() == null) {
            towing.setRequestDate(LocalDateTime.now()); // Default to now
        } else if (!(towing.getRequestDate() instanceof LocalDateTime)) {
            towing.setRequestDate(LocalDateTime.parse(towing.getRequestDate().toString(), formatter));
        }

        // ✅ Validate Agent and User
        if (towing.getAgent() == null || towing.getAgent().getIdAgent() == null) {
            throw new IllegalArgumentException("Agent ID must be provided.");
        }
        if (towing.getUser() == null || towing.getUser().getIdUser() == null) {
            throw new IllegalArgumentException("User ID must be provided.");
        }

        // ✅ Fetch Agent and User from the database
        AgentTowing agent = agentRepository.findById(towing.getAgent().getIdAgent())
                .orElseThrow(() -> new IllegalArgumentException("Agent not found with ID: " + towing.getAgent().getIdAgent()));
        towing.setAgent(agent);

        User user = userRepository.findById(towing.getUser().getIdUser())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + towing.getUser().getIdUser()));
        towing.setUser(user);

        // ✅ Save Towing Request
        Towing savedTowing = towingRepository.save(towing);

        // 🚀 Send WebSocket Notification to the agent
        messagingTemplate.convertAndSend("/topic/agent-" + agent.getIdAgent(),
                "New towing request assigned at " + towing.getLocation() + " (Status: " + towing.getStatus() + ")");

        // Send to the chat topic for all agents to see
        Map<String, Object> chatNotification = new HashMap<>();
        chatNotification.put("id", savedTowing.getId());
        chatNotification.put("location", savedTowing.getLocation());
        chatNotification.put("status", savedTowing.getStatus());
        chatNotification.put("agentId", agent.getIdAgent());
        chatNotification.put("agentName", agent.getName());
        chatNotification.put("timestamp", LocalDateTime.now().toString());

        messagingTemplate.convertAndSend("/topic/towing", chatNotification);

        return savedTowing;
    }

    public Towing updateTowing(Long id, Towing towingDetails) {
        Towing towing = towingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Towing not found with ID: " + id));

        // Capture old status to check for status changes
        String oldStatus = towing.getStatus();

        towing.setStatus(towingDetails.getStatus());
        towing.setLocation(towingDetails.getLocation());
        towing.setRequestDate(towingDetails.getRequestDate());

        // If rating is provided in the update, set it
        if (towingDetails.getRating() != null) {
            towing.setRating(towingDetails.getRating());
        }

        // ✅ Save updated towing request
        Towing updatedTowing = towingRepository.save(towing);

        // Status change event - notify webhooks
        if (!oldStatus.equals(updatedTowing.getStatus())) {
            try {
                // If WebhookService is available, trigger webhooks
                if (applicationContext.containsBean("webhookService")) {
                    WebhookService webhookService = applicationContext.getBean(WebhookService.class);

                    Map<String, Object> payload = new HashMap<>();
                    payload.put("towingId", updatedTowing.getId());
                    payload.put("oldStatus", oldStatus);
                    payload.put("newStatus", updatedTowing.getStatus());
                    payload.put("location", updatedTowing.getLocation());
                    payload.put("timestamp", LocalDateTime.now().toString());

                    // Agent info
                    if (updatedTowing.getAgent() != null) {
                        payload.put("agentId", updatedTowing.getAgent().getIdAgent());
                        payload.put("agentName", updatedTowing.getAgent().getName());
                    }

                    // User info
                    if (updatedTowing.getUser() != null) {
                        payload.put("userId", updatedTowing.getUser().getIdUser());
                    }

                    // Async webhook trigger
                    webhookService.triggerWebhooks("towing.status.changed", payload);

                    // Also send to the chat topic for all agents to see
                    messagingTemplate.convertAndSend("/topic/towing", payload);
                }
            } catch (Exception e) {
                logger.error("Error triggering webhooks for status change", e);
            }
        }

        // 🚀 Notify the agent about the status change
        messagingTemplate.convertAndSend("/topic/agent-" + towing.getAgent().getIdAgent(),
                "Towing request at " + towing.getLocation() + " is now " + towing.getStatus());

        return updatedTowing;
    }

    // Overloaded method to update an existing Towing entity directly
    public Towing updateTowing(Towing towing) {
        if (towing.getId() == null) {
            throw new IllegalArgumentException("Towing ID must be provided.");
        }

        // Verify towing exists
        towingRepository.findById(towing.getId())
                .orElseThrow(() -> new IllegalArgumentException("Towing not found with ID: " + towing.getId()));

        // Save the updated entity
        return towingRepository.save(towing);
    }

    public Towing updateTowingRating(Long towingId, Double rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Towing towing = towingRepository.findById(towingId)
                .orElseThrow(() -> new IllegalArgumentException("Towing not found with ID: " + towingId));

        towing.setRating(rating);
        Towing updatedTowing = towingRepository.save(towing);

        // Trigger webhook for rating update
        try {
            if (applicationContext.containsBean("webhookService")) {
                WebhookService webhookService = applicationContext.getBean(WebhookService.class);

                Map<String, Object> payload = new HashMap<>();
                payload.put("towingId", updatedTowing.getId());
                payload.put("rating", rating);
                payload.put("timestamp", LocalDateTime.now().toString());

                // Agent info
                if (updatedTowing.getAgent() != null) {
                    payload.put("agentId", updatedTowing.getAgent().getIdAgent());
                    payload.put("agentName", updatedTowing.getAgent().getName());
                }

                // Async webhook trigger
                webhookService.triggerWebhooks("towing.rating.updated", payload);

                // Also send to the chat topic for all agents to see
                payload.put("action", "rating.updated");
                messagingTemplate.convertAndSend("/topic/towing", payload);
            }
        } catch (Exception e) {
            logger.error("Error triggering webhooks for rating update", e);
        }

        return updatedTowing;
    }
    public Towing save(Towing towing) {
        return towingRepository.save(towing);
    }
    public void deleteTowing(Long id) {
        Towing towing = towingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Towing not found with ID: " + id));
        towingRepository.delete(towing);
    }

}
