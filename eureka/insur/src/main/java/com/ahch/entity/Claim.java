package com.ahch.entity;

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
    ClaimStatus ClaimStatus= com.ahch.entity.ClaimStatus.UNTREATED;

    @Enumerated(EnumType.STRING)
    ClaimType ClaimType;

   /* @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private OurUsers user;

    // Getters and Setters
    public OurUsers getUser() {
        return user;
    }

    public void setUser(OurUsers user) {
        this.user = user;
    }*/
    public Claim() {

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

    public LocalDateTime getDateCreation() {
        return DateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        DateCreation = dateCreation;
    }

    public com.ahch.entity.ClaimStatus getClaimStatus() {
        return ClaimStatus;
    }

    public void setClaimStatus(com.ahch.entity.ClaimStatus claimStatus) {
        ClaimStatus = claimStatus;
    }

    public com.ahch.entity.ClaimType getClaimType() {
        return ClaimType;
    }

    public void setClaimType(com.ahch.entity.ClaimType claimType) {
        ClaimType = claimType;
    }
}
