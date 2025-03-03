package com.phegondev.usersmanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ConfirmationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private LocalDateTime confirmedAt;

    @ManyToOne
    @JoinColumn(nullable = false, name = "user_id")
    private OurUsers ourUser;

    public ConfirmationToken(String token, LocalDateTime createdAt, LocalDateTime expiresAt, OurUsers ourUsersResult) {
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.ourUser = ourUsersResult;
    }

    public ConfirmationToken() {

    }
}
