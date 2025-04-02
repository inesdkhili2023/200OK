package com.ahch.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "webhooks")
public class Webhook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "URL is required")
    @Pattern(regexp = "^https?://.*", message = "URL must start with http:// or https://")
    private String url;

    @NotBlank(message = "Event type is required")
    private String eventType;

    private boolean active;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastTriggeredAt;

    private String secretKey;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Webhook{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", url='" + url + '\'' +
                ", eventType='" + eventType + '\'' +
                ", active=" + active +
                ", createdAt=" + createdAt +
                ", lastTriggeredAt=" + lastTriggeredAt +
                '}';
    }
}