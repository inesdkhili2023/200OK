package com.ahch.controller;

import com.ahch.Repo.AgentTowingRepository;
import com.ahch.entity.AgentTowing;
import com.ahch.service.AgentTowingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/agents") // Corrected base API path
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular app
public class AgentTowingController {

    private final AgentTowingService agentTowingService;
    private final AgentTowingRepository agentTowingRepository;

    public AgentTowingController(AgentTowingService agentTowingService, AgentTowingRepository agentTowingRepository) {
        this.agentTowingService = agentTowingService;
        this.agentTowingRepository = agentTowingRepository;
    }

    // ✅ Fetch all agents
    @GetMapping
    public List<AgentTowing> getAllAgents() {
        return agentTowingService.getAllAgents();
    }

    // ✅ Create a new agent (Fixed path)
    @PostMapping("/add")
    public ResponseEntity<AgentTowing> createAgent(@Valid @RequestBody AgentTowing agentTowing) {
        try {
            AgentTowing createdAgent = agentTowingService.createAgentTowing(agentTowing);
            return ResponseEntity.ok(createdAgent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // ✅ Update an agent with all attributes
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAgentTowing(@PathVariable Integer id, @RequestBody AgentTowing agentDetails) {
        try {
            Optional<AgentTowing> optionalAgent = agentTowingRepository.findById(id);
            if (!optionalAgent.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Agent not found with ID: " + id);
            }

            AgentTowing existingAgent = optionalAgent.get();

            // ✅ Update all attributes
            existingAgent.setName(agentDetails.getName());
            existingAgent.setAvailability(agentDetails.getAvailability());
            existingAgent.setContactInfo(agentDetails.getContactInfo());
            existingAgent.setVehicleType(agentDetails.getVehicleType());

            // ✅ Save updated agent
            AgentTowing updatedAgent = agentTowingRepository.save(existingAgent);
            return ResponseEntity.ok(updatedAgent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred.");
        }
    }

    // ✅ Delete an agent
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAgent(@PathVariable Integer id) {
        try {
            if (!agentTowingRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Agent not found with ID: " + id);
            }

            agentTowingService.deleteAgentTowing(id);
            return ResponseEntity.ok("✅ Agent deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred.");
        }
    }
}
