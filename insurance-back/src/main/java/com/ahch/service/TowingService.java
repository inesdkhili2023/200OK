package com.ahch.service;

import com.ahch.Repo.AgentTowingRepository;
import com.ahch.Repo.TowingRepository;
import com.ahch.Repo.UserRepository;
import com.ahch.entity.Towing;
import com.ahch.entity.AgentTowing;
import com.ahch.entity.User;
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

        return savedTowing;
    }

    public Towing updateTowing(Long id, Towing towingDetails) {
        Towing towing = towingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Towing not found with ID: " + id));

        towing.setStatus(towingDetails.getStatus());
        towing.setLocation(towingDetails.getLocation());
        towing.setRequestDate(towingDetails.getRequestDate());

        // ✅ Save updated towing request
        Towing updatedTowing = towingRepository.save(towing);

        // 🚀 Notify the agent about the status change
        messagingTemplate.convertAndSend("/topic/agent-" + towing.getAgent().getIdAgent(),
                "Towing request at " + towing.getLocation() + " is now " + towing.getStatus());

        return updatedTowing;
    }


    public void deleteTowing(Long id) {
        Towing towing = towingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Towing not found with ID: " + id));
        towingRepository.delete(towing);
    }

}
