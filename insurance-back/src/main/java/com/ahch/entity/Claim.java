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

    String Status;

    @Enumerated(EnumType.STRING)
    ClaimType ClaimType;

    public Claim() {

    }

    public Long getClaimId() {
        return claimId;
    }

    public void setClaimId  (Long idClaim) {
        claimId = idClaim;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String status) {
        Status = status;
    }

    public LocalDateTime getDateCreation() {
        return DateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        DateCreation = dateCreation;
    }

    public com.ahch.entity.ClaimType getClaimType() {
        return ClaimType;
    }

    public void setClaimType(com.ahch.entity.ClaimType claimType) {
        ClaimType = claimType;
    }
}
