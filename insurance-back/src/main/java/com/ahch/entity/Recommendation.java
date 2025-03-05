package com.ahch.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRec;
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;
    @NotBlank(message = "User Preferences are required")
    private String userPreferences;
    @NotNull(message = "Date Creation is required")
    private Date dateCreation;
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(Pending|Approved|Rejected)$", message = "Invalid status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "idUser")
    private User user;

    public void envoyerRec() {
        this.status = "Sent";
    }
}
