package com.ahch.controller;

import com.ahch.entity.AgentTowing;
import com.ahch.entity.Towing;
import com.ahch.service.AgentTowingService;
import com.ahch.service.DashboardService;
import com.ahch.service.TowingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AgentTowingService agentTowingService;
    private final TowingService towingService;

    public DashboardController(DashboardService dashboardService,
                               AgentTowingService agentTowingService,
                               TowingService towingService) {
        this.dashboardService = dashboardService;
        this.agentTowingService = agentTowingService;
        this.towingService = towingService;
    }

    /**
     * Get dashboard statistics for an agent
     */
    @GetMapping("/agent/{agentId}/stats")
    public ResponseEntity<?> getAgentDashboardStats(@PathVariable Integer agentId) {
        try {
            Map<String, Object> stats = dashboardService.getAgentDashboardStats(agentId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching dashboard stats: " + e.getMessage());
        }
    }

    /**
     * Get all recent towing requests for an agent
     */
    @GetMapping("/agent/{agentId}/requests")
    public ResponseEntity<List<Towing>> getAgentTowingRequests(
            @PathVariable Integer agentId,
            @RequestParam(defaultValue = "all") String status) {

        List<Towing> allTowings = towingService.getAllTowings();
        List<Towing> agentTowings = allTowings.stream()
                .filter(t -> t.getAgent() != null && t.getAgent().getId().equals(agentId))
                .collect(Collectors.toList());

        if (!"all".equalsIgnoreCase(status)) {
            agentTowings = agentTowings.stream()
                    .filter(t -> status.equalsIgnoreCase(t.getStatus()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(agentTowings);
    }

    /**
     * Update rating for a towing request
     */
    @PostMapping("/towing/{towingId}/rate")
    public ResponseEntity<?> rateTowingRequest(
            @PathVariable Long towingId,
            @RequestBody Map<String, Double> request) {

        Double rating = request.get("rating");
        if (rating == null || rating < 1 || rating > 5) {
            return ResponseEntity
                    .badRequest()
                    .body("Rating must be between 1 and 5");
        }

        try {
            Towing towing = towingService.getTowingById(towingId);
            towing.setRating(rating);
            towingService.updateTowing(towing);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating rating: " + e.getMessage());
        }
    }
}