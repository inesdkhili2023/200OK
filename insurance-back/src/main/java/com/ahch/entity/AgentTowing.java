package com.ahch.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgentTowing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAgent;
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    private String name;
    @NotBlank(message = "Contact info is required")
    @Pattern(regexp = "^[0-9+()-]{8,15}$", message = "Invalid phone number format")
    private String contactInfo;
    @NotNull(message = "Availability is required")
    private Boolean availability;
    @NotBlank(message = "Vehicle Type is required")
    private String vehicleType;
    // NEW: current location coordinates
    private double latitude;
    private double longitude;
    public Integer getId() {
        return idAgent;
    }
    // Getters and Setters
    public double getLatitude() {
        return latitude;
    }
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }
    public double getLongitude() {
        return longitude;
    }
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
