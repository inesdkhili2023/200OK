package com.ahch.controller;

import com.ahch.Repo.AgentTowingRepository;
import com.ahch.entity.AgentTowing;
import com.ahch.service.AgentTowingPDFExporterService;
import com.ahch.service.AgentTowingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/agents") // Corrected base API path
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular app
public class AgentTowingController {

    private final AgentTowingService agentTowingService;
    private final AgentTowingRepository agentTowingRepository;
    private final AgentTowingPDFExporterService pdfExporterService;
    public AgentTowingController(AgentTowingService agentTowingService, AgentTowingRepository agentTowingRepository, AgentTowingPDFExporterService pdfExporterService) {
        this.agentTowingService = agentTowingService;
        this.agentTowingRepository = agentTowingRepository;
        this.pdfExporterService = pdfExporterService;
    }

    // ✅ Fetch all agents
    @GetMapping
    public List<AgentTowing> getAllAgents() {
        return agentTowingService.getAllAgents();
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginAgent(@RequestBody AgentTowing loginDetails) {
        AgentTowing agent = agentTowingRepository.findByNameAndVehicleType(
                loginDetails.getName(),
                loginDetails.getVehicleType()
        );
        if (agent != null) {
            return ResponseEntity.ok(agent);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportAgentTowingsToPDF() {
        try {
            List<AgentTowing> agents = agentTowingRepository.findAll();
            byte[] pdfBytes = pdfExporterService.exportAgentTowingsToPDF(agents);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "agent_towings.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
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

    // In AgentTowingController.java, add this endpoint:
    @PutMapping("/updateLocation/{id}")
    public ResponseEntity<?> updateAgentLocation(@PathVariable Integer id, @RequestBody Map<String, Double> location) {
        Optional<AgentTowing> agentOpt = agentTowingRepository.findById(id);
        if (!agentOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Agent not found");
        }
        AgentTowing agent = agentOpt.get();
        agent.setLatitude(location.get("latitude"));
        agent.setLongitude(location.get("longitude"));
        agentTowingRepository.save(agent);
        return ResponseEntity.ok(agent);
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
