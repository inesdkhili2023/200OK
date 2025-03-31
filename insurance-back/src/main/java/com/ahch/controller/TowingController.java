package com.ahch.controller;

import com.ahch.Repo.AgentTowingRepository;
import com.ahch.Repo.TowingRepository;
import com.ahch.Repo.UserRepository;
import com.ahch.entity.Towing;
import com.ahch.entity.AgentTowing;
import com.ahch.entity.User;
import com.ahch.service.TowingService;
import com.itextpdf.text.DocumentException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ahch.service.PDFExporterService;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/towings")
@CrossOrigin(origins = "http://localhost:4200")
public class TowingController {
private final TowingRepository towingRepository;
    private final TowingService towingService;
    private final AgentTowingRepository agentRepository;
    private final UserRepository userRepository;
    private final PDFExporterService pdfExporterService;

    public TowingController( PDFExporterService pdfExporterService,
                             TowingService towingService,
                             AgentTowingRepository agentRepository,
                             UserRepository userRepository,
                             TowingRepository towingRepository) {
        this.towingService = towingService;
        this.pdfExporterService = pdfExporterService;
        this.agentRepository = agentRepository;
        this.userRepository = userRepository;
        this.towingRepository = towingRepository;
    }

    @GetMapping("/all")
    public List<Towing> getAllTowings() {
        return towingRepository.findAll();
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportTowingsToPDF() {
        try {
            List<Towing> towings = towingRepository.findAll();
            byte[] pdfBytes = pdfExporterService.exportTowingsToPDF(towings);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "towings.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/add/{id_agent}/{id_user}")
    public ResponseEntity<?> addTowing(@PathVariable Integer id_agent, @PathVariable Integer id_user, @RequestBody Towing towing) {
        try {
            // Log incoming request
            System.out.println("🚀 Received request to add towing: " + towing);
            System.out.println("🔎 Searching for Agent ID: " + id_agent);
            System.out.println("🔎 Searching for User ID: " + id_user);

            // Fetch Agent and User from the database
            AgentTowing agent = agentRepository.findById(id_agent)
                    .orElseThrow(() -> new IllegalArgumentException("❌ Agent not found with ID: " + id_agent));
            User user = userRepository.findById(id_user)
                    .orElseThrow(() -> new IllegalArgumentException("❌ User not found with ID: " + id_user));

            // Assign agent and user to the towing request
            towing.setAgent(agent);
            towing.setUser(user);

            // Ensure request date is set correctly
            if (towing.getRequestDate() == null) {
                towing.setRequestDate(LocalDateTime.now()); // Default to now if missing
            }

            // Save towing request
            Towing newTowing = towingService.addTowing(towing);
            System.out.println("✅ Towing successfully created: " + newTowing);

            return ResponseEntity.ok(newTowing);
        } catch (IllegalArgumentException e) {
            System.err.println("🚨 Validation Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Unexpected Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred.");
        }
    }




    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTowing(@PathVariable Long id, @RequestBody Towing towingDetails) {
        try {
            // Find existing towing request
            Towing existingTowing = towingRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Towing not found with ID: " + id));

            // Fetch the agent and user from the database
            AgentTowing agent = agentRepository.findById(towingDetails.getAgent().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Agent not found with ID: " + towingDetails.getAgent().getId()));

            User user = userRepository.findById(towingDetails.getUser().getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + towingDetails.getUser().getId()));

            // Update fields
            existingTowing.setStatus(towingDetails.getStatus());
            existingTowing.setLocation(towingDetails.getLocation());
            existingTowing.setRequestDate(towingDetails.getRequestDate());
            existingTowing.setAgent(agent); // Update agent
            existingTowing.setUser(user); // Update user

            // Save updated towing request
            Towing updatedTowing = towingRepository.save(existingTowing);

            return ResponseEntity.ok(updatedTowing);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating towing request: " + e.getMessage());
        }
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteTowing(@PathVariable Long id) {
        try {
            towingService.deleteTowing(id);
            // Return a JSON response instead of plain text
            Map<String, String> response = new HashMap<>();
            response.put("message", "Towing deleted successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error deleting towing."));
        }
    }



    @GetMapping("/agents")
    public List<AgentTowing> getAllAgents() {
        return towingService.getAllAgents();
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return towingService.getAllUsers();
    }
}
