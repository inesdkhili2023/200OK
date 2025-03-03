package com.ahch.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double numContrat;
    private double montant;
    private  int numtel;
    private  String Mail;
    private String ConfirmationMail;
    private LocalDate datePaiement;

    @ManyToOne
    @JoinColumn(name = "contrat_id", nullable = false)
    private Contrat contrat;

    public Paiement() {
        this.datePaiement = LocalDate.now(); // Date automatique
    }

    public Paiement(double montant, Contrat contrat) {
        this.montant = montant;
        this.contrat = contrat;
        this.datePaiement = LocalDate.now();
    }

    public Long getId() { return id; }

    public double getMontant() { return montant; }
    public void setMontant(double montant) { this.montant = montant; }

    public LocalDate getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDate datePaiement) { this.datePaiement = datePaiement; }

    public Contrat getContrat() { return contrat; }
    public void setContrat(Contrat contrat) { this.contrat = contrat; }
}
