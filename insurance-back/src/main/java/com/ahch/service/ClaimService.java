package com.ahch.service;

import com.ahch.Repo.ClaimRepo;
import com.ahch.entity.Claim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepo ClaimDao;

    public Claim saveClaim(Claim claim) {
        return ClaimDao.save(claim);
    }

    public List<Claim> getClaims() {
        List<Claim> claims = new ArrayList<>();
        ClaimDao.findAll().forEach(claims::add);
        return claims;
    }

    public Claim getClaims(Integer ClaimId) {
        return ClaimDao.findById(ClaimId).orElseThrow();
    }

    public void deleteClaim(Integer ClaimId) {
        ClaimDao.deleteById(ClaimId);
    }

  /*  public Claim updateClaim(Claim claim) {
        ClaimDao.findById(claim.getIdClaim());
        return ClaimDao.save(claim);
    }*/
}
