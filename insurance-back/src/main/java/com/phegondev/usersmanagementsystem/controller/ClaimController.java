package com.phegondev.usersmanagementsystem.controller;

import com.phegondev.usersmanagementsystem.entity.Claim;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import com.phegondev.usersmanagementsystem.service.ClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

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

            Claim savedClaim = claimService.saveClaim(userId, claim);
            return ResponseEntity.ok(savedClaim);
        } catch (Exception e) {
            System.err.println("Error saving claim:");
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error saving claim: " + e.getMessage());
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
    public Claim updateClaim(@RequestBody Claim claim) {
        return claimService.updateClaim(claim);
    }
} 