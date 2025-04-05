package com.phegondev.usersmanagementsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "claim")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long claimId;

    String Description;

    LocalDateTime DateCreation;

    @Enumerated(EnumType.STRING)
    ClaimStatus ClaimStatus = com.phegondev.usersmanagementsystem.entity.ClaimStatus.UNTREATED;

    @Enumerated(EnumType.STRING)
    ClaimType ClaimType;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private OurUsers user;

    // Getters and Setters
    public OurUsers getUser() {
        return user;
    }


    public void setUser(OurUsers user) {
        this.user = user;
    }

    public Long getClaimId() {
        return claimId;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public ClaimStatus getClaimStatus() {
        return ClaimStatus;
    }

    public void setClaimStatus(ClaimStatus claimStatus) {
        ClaimStatus = claimStatus;
    }

    public LocalDateTime getDateCreation() {
        return DateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        DateCreation = dateCreation;
    }

    public ClaimType getClaimType() {
        return ClaimType;
    }

    public void setClaimType(ClaimType claimType) {
        ClaimType = claimType;
    }
}