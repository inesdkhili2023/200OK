package com.phegondev.usersmanagementsystem.controller;

import com.phegondev.usersmanagementsystem.entity.Claim;
import com.phegondev.usersmanagementsystem.service.ClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
public class ClaimController {

    @Autowired
    private ClaimService ClaimService;

    @PostMapping("/allRole/save/Claim/{userId}")
    public Claim saveClaim(@PathVariable Long userId, @RequestBody Claim claim) {
        return ClaimService.saveClaim(userId, claim);
    }

    @GetMapping("/allRole/get/Claim")
    public List<Claim> getClaims() {
        return ClaimService.getClaims();
    }

    @GetMapping("/allRole/get/Claim/{ClaimId}")
    public Claim getClaim(@PathVariable Long ClaimId) {
        return ClaimService.getClaims(ClaimId);
    }

    @DeleteMapping("/allRole/delete/Claim/{ClaimId}")
    public void deleteClaim(@PathVariable Long ClaimId) {
        ClaimService.deleteClaim(ClaimId);
    }

    @PutMapping("/allRole/update/Claim")
    public Claim updateClaim(@RequestBody Claim claim) {
        return ClaimService.updateClaim(claim);
    }

}
