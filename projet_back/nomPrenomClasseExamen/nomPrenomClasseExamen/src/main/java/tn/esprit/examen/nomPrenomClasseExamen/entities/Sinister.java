package tn.esprit.examen.nomPrenomClasseExamen.entities;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.io.Serializable;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Sinister implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long sinisterId;

    Long idClient;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    LocalDate dateAccident;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    LocalDate dateDeclaration;

    String accidentLocation;

    @Enumerated(EnumType.STRING)
    SinisterType typeSinister;

    String description;

    @Enumerated(EnumType.STRING)
    StatusSinister status;

    String attachmentPath; // Path for the file

    Double estimatedCompensation;

    @ManyToOne
    @JoinColumn(name = "user_id") // Explicit foreign key column name
    private Users user;
}
