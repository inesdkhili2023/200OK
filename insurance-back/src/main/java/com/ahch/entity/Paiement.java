package com.ahch.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long numContrat;
    private Double montant;
    private String numtel; // ✅ Changement de int à String
    private String mail;
    private String confirmationMail;
    private LocalDate datePaiement;
    private String stripePaymentId;

    @ManyToOne
    @JoinColumn(name = "contrat_id", nullable = false)
    private Contrat contrat;

    public Paiement() {
        this.datePaiement = LocalDate.now(); // Date automatique
    }


    public Paiement(Double montant, Contrat contrat) { // Changé double à Double
        this.montant = montant;
        this.contrat = contrat;
        this.datePaiement = LocalDate.now();
    }
    public String getStripePaymentId() {
        return stripePaymentId;
    }

    public void setStripePaymentId(String stripePaymentId) {
        this.stripePaymentId = stripePaymentId;
    }

    public Long getId() { return id; }

    public String getMail() { return mail; }
    public void setMail(String mail) { this.mail = mail; }

    public String getConfirmationMail() { return confirmationMail; }
    public void setConfirmationMail(String confirmationMail) { this.confirmationMail = confirmationMail; }

    public String getNumtel() { return numtel; } // ✅ Corrigé
    public void setNumtel(String numtel) { this.numtel = numtel; } // ✅ Corrigé

    public Double getMontant() { return montant; } // Changé double à Double
    public void setMontant(Double montant) { this.montant = montant; } // Changé double à Double

    public LocalDate getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDate datePaiement) { this.datePaiement = datePaiement; }

    public Contrat getContrat() { return contrat; }
    public void setContrat(Contrat contrat) { this.contrat = contrat; }
}