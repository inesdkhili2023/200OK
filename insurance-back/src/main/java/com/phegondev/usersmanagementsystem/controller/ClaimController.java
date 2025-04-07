package com.phegondev.usersmanagementsystem.controller;
import com.phegondev.usersmanagementsystem.entity.ClaimStatus;
import com.phegondev.usersmanagementsystem.entity.ClaimType;
import com.phegondev.usersmanagementsystem.entity.Claim;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import com.phegondev.usersmanagementsystem.service.ClaimService;
import com.phegondev.usersmanagementsystem.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:4200")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private UsersRepo usersRepo;

    @PostMapping("/allRole/save/Claim/{userId}")
    public ResponseEntity<?> saveClaim(@PathVariable Long userId, @RequestBody Claim claim) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("User " + auth.getName() + " with authorities " + auth.getAuthorities());
            System.out.println("Received claim: " + claim.toString());
            System.out.println("For user ID: " + userId);

            // Add validation
            if (claim.getDescription() == null || claim.getDescription().isEmpty()) {
                return ResponseEntity.badRequest().body("Description is required");
            }

            // Validate claim type
            if (claim.getClaimType() == null) {
                return ResponseEntity.badRequest().body("Claim type is required");
            }

            Claim savedClaim = claimService.saveClaim(userId, claim);
            return ResponseEntity.ok(savedClaim);
        } catch (Exception e) {
            System.err.println("Error saving claim:");
            e.printStackTrace();

            // More detailed error message
            String errorMessage = "Error saving claim: ";
            if (e.getCause() != null && e.getCause().getMessage() != null) {
                errorMessage += e.getCause().getMessage();
            } else {
                errorMessage += e.getMessage();
            }

            return ResponseEntity.internalServerError().body(errorMessage);
        }
    }

    @GetMapping("/allRole/get/Claim")
    public List<Claim> getClaims() {
        return claimService.getClaims();
    }

    @GetMapping("/allRole/get/Claim/{claimId}")
    public Claim getClaim(@PathVariable Long claimId) {
        return claimService.getClaims(claimId);
    }

    @DeleteMapping("/allRole/delete/Claim/{claimId}")
    public void deleteClaim(@PathVariable Long claimId) {
        claimService.deleteClaim(claimId);
    }

    @PutMapping("/allRole/update/Claim")
    public ResponseEntity<?> updateClaim(@RequestBody Map<String, Object> claimData) {
        try {
            // Extract values from the request
            Long claimId = Long.valueOf(claimData.get("claimId").toString());
            String description = (String) claimData.get("description");
            String claimStatus = (String) claimData.get("claimStatus");
            String claimType = (String) claimData.get("claimType");
            Object userId = claimData.get("userId");

            // Fetch the original claim
            Claim existingClaim = claimService.getClaims(claimId);
            if (existingClaim == null) {
                return ResponseEntity.badRequest().body("Claim not found");
            }

            // Update claim fields
            existingClaim.setDescription(description);

            try {
                existingClaim.setClaimStatus(ClaimStatus.valueOf(claimStatus));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid claim status");
            }

            try {
                existingClaim.setClaimType(ClaimType.valueOf(claimType));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid claim type");
            }

            // Only update user if userId is provided and different
            if (userId != null) {
                Long userIdLong = Long.valueOf(userId.toString());
                if (!userIdLong.equals(existingClaim.getUser().getIduser())) {
                    OurUsers user = usersRepo.findById(userIdLong)
                            .orElseThrow(() -> new RuntimeException("User not found with id: " + userIdLong));
                    existingClaim.setUser(user);
                }
            }

            // Save the updated claim
            Claim updatedClaim = claimService.updateClaim(existingClaim);
            return ResponseEntity.ok(updatedClaim);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating claim: " + e.getMessage());
        }
    }
}