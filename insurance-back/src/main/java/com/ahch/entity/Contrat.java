package com.ahch.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Contrat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numContrat;

    @OneToOne
    @JoinColumn(name = "devis_id", unique = true)
    private Devis devis;

    private LocalDate dateCreation;

    public Contrat() {}

    public Contrat(String numContrat, Devis devis) {
        this.numContrat = numContrat;
        this.devis = devis;
        this.dateCreation = LocalDate.now();
    }

    public String getNumContrat() { return numContrat; }
    public Devis getDevis() { return devis; }
}
