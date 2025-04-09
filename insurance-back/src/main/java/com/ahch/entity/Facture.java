package com.ahch.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numFacture;
    private double montant;
    private LocalDate dateEmission;

    @OneToOne
    @JoinColumn(name = "paiement_id", nullable = false)
    private Paiement paiement;

    public Facture() {
        this.dateEmission = LocalDate.now(); // Date automatique
    }

    public Facture(String numFacture, Paiement paiement, double montant) {
        this.numFacture = numFacture;
        this.paiement = paiement;
        this.montant = montant;
        this.dateEmission = LocalDate.now();
    }

    // Getters et Setters
    public Long getId() { return id; }
    public String getNumFacture() { return numFacture; }
    public void setNumFacture(String numFacture) { this.numFacture = numFacture; }

    public double getMontant() { return montant; }
    public void setMontant(double montant) { this.montant = montant; }

    public LocalDate getDateEmission() { return dateEmission; }
    public void setDateEmission(LocalDate dateEmission) { this.dateEmission = dateEmission; }

    public Paiement getPaiement() { return paiement; }
    public void setPaiement(Paiement paiement) { this.paiement = paiement; }

}