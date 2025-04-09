package com.ahch.controller;

import com.ahch.entity.Claim;
import com.ahch.entity.OurUsers;
import com.ahch.service.ClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
public class ClaimController {

    @Autowired
    private ClaimService ClaimService;

    @PostMapping("/save/Claim/{userId}")
    public Claim saveClaim(@PathVariable Long userId, @RequestBody Claim claim) {
        return ClaimService.saveClaim(userId, claim);
    }

    @GetMapping("/get/Claim")
    public List<Claim> getClaims() {
        return ClaimService.getClaims();
    }

    @GetMapping("/get/Claim/{ClaimId}")
    public Claim getClaim(@PathVariable Long ClaimId) {
        return ClaimService.getClaims(ClaimId);
    }

    @DeleteMapping("/delete/Claim/{ClaimId}")
    public void deleteClaim(@PathVariable Long ClaimId) {
        ClaimService.deleteClaim(ClaimId);
    }

    @PutMapping("/update/Claim")
    public Claim updateClaim(@RequestBody Claim claim) {
        return ClaimService.updateClaim(claim);
    }

}
