package com.phegondev.usersmanagementsystem.service;

import com.phegondev.usersmanagementsystem.entity.Claim;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import com.phegondev.usersmanagementsystem.repository.ClaimRepo;
import com.phegondev.usersmanagementsystem.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepo claimRepo;
    
    @Autowired
    private UsersRepo usersRepo;
    
    public Claim saveClaim(Long userId, Claim claim) {
        OurUsers user = usersRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        claim.setUser(user);
        return claimRepo.save(claim);
    }

    public List<Claim> getClaims() {
        List<Claim> claims = new ArrayList<>();
        claimRepo.findAll().forEach(claims::add);
        return claims;
    }

    public Claim getClaims(Long claimId) {
        return claimRepo.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claimId));
    }

    public void deleteClaim(Long claimId) {
        claimRepo.deleteById(claimId);
    }

    public Claim updateClaim(Claim claim) {
        // Verify claim exists
        claimRepo.findById(claim.getClaimId())
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claim.getClaimId()));
        return claimRepo.save(claim);
    }
} 