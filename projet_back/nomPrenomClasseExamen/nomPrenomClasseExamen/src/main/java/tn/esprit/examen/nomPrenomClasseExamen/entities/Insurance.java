package tn.esprit.examen.nomPrenomClasseExamen.entities;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Set;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
public class Insurance implements Serializable  {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long insuranceId;
    @Enumerated(EnumType.STRING)
    InsuranceType insuranceType;

    LocalDate startDate;
    LocalDate endDate;
    String description;
}