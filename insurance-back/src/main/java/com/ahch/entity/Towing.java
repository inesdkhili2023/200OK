package com.ahch.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import jakarta.validation.constraints.*;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Towing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Status is required")
    @Column(name = "status")
    private String status;
    @NotBlank(message = "Location is required")
    @Column(name = "location")
    private String location;
    @NotNull(message = "Request date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "request_date")
    private LocalDateTime requestDate;
    private double latitude;
    private double longitude;

    // Rating given by user after service completion (1-5 stars)
    private Double rating;

    // Description or notes about the towing request
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_agent", referencedColumnName = "idAgent", insertable = true, updatable = true)
    private AgentTowing agent;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_user", referencedColumnName = "idUser", insertable = true, updatable = true)
    private User user;

    // Getters and setters
    public AgentTowing getAgent() { return agent; }
    public User getUser() { return user; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }


}
