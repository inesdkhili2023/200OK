package com.phegondev.usersmanagementsystem.service;

import com.phegondev.usersmanagementsystem.repository.ClaimRepo;
import com.phegondev.usersmanagementsystem.repository.UsersRepo;
import com.phegondev.usersmanagementsystem.entity.Claim;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepo ClaimDao;
    @Autowired
    private UsersRepo UserRepo;
    public Claim saveClaim(Long iduser,Claim claim) {
        OurUsers user = UserRepo.findById(iduser).orElseThrow(() -> new RuntimeException("User not found"));
        claim.setUser(user);
        return ClaimDao.save(claim);
    }

    public List<Claim> getClaims() {
        List<Claim> claims = new ArrayList<>();
        ClaimDao.findAll().forEach(claims::add);
        return claims;
    }

    public Claim getClaims(Long ClaimId) {
        return ClaimDao.findById(ClaimId).orElseThrow();
    }

    public void deleteClaim(Long ClaimId) {
        ClaimDao.deleteById(ClaimId);
    }

   public Claim updateClaim(Claim claim) {
        ClaimDao.findById(claim.getClaimId());
        return ClaimDao.save(claim);
    }
}
