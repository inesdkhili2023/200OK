package com.ahch.service;

import com.ahch.Repo.ContratRepository;
import com.ahch.Repo.FactureRepository;
import com.ahch.Repo.PaiementRepository;
import com.ahch.entity.Contrat;
import com.ahch.entity.Facture;
import com.ahch.entity.OurUsers;
import com.ahch.entity.Paiement;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaiementService {
    @Autowired
    private PaiementRepository paiementRepository;
    @Autowired
    private ContratRepository contratRepository;
    @Autowired
    private FactureRepository factureRepository;
    @Value("${stripe.api.key}")
    private String stripeApiKey;
    @Autowired
    private UserServiceClient userServiceClient;

    public List<OurUsers> getAllUsers(String jwtToken) {
        String finalToken = jwtToken.startsWith("Bearer ") ? jwtToken : "Bearer " + jwtToken;
        ReqRes response = userServiceClient.getAllUsers(finalToken).getBody();
        System.out.println("Sending token: [" + finalToken + "]");
        return response != null ? response.getOurUsersList() : List.of();
    }


    public Paiement createPaiement(Paiement paiement) {
        if (paiement.getContrat() == null || paiement.getContrat().getNumContrat() == null) {
            throw new IllegalArgumentException("Le paiement doit être lié à un contrat valide.");
        }

        Contrat contrat = contratRepository.findByNumContrat(paiement.getContrat().getNumContrat())
                .orElseThrow(() -> new RuntimeException("Numéro de contrat invalide."));

        paiement.setContrat(contrat);
        Paiement savedPaiement = paiementRepository.save(paiement);

        // Générer une facture
        String numFacture = "FAC-" + UUID.randomUUID().toString().substring(0, 8);
        Facture facture = new Facture(numFacture, savedPaiement, savedPaiement.getMontant());
        factureRepository.save(facture);

        return savedPaiement;
    }

    public Paiement createPaiementWithStripe(Paiement paiement, String paymentIntentId) {
        try {
            Stripe.apiKey = stripeApiKey;
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);

            if ("succeeded".equals(intent.getStatus())) {
                paiement.setStripePaymentId(paymentIntentId);
                return this.createPaiement(paiement);
            }
            throw new RuntimeException("Paiement non confirmé avec Stripe");
        } catch (StripeException e) {
            throw new RuntimeException("Erreur Stripe: " + e.getMessage());
        }
    }


    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }


    public Paiement getPaiementById(Long id) {
        return paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé."));
    }


    public Paiement updatePaiement(Long id, Paiement newPaiement) {
        Paiement existingPaiement = paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé."));

        existingPaiement.setMontant(newPaiement.getMontant());
        return paiementRepository.save(existingPaiement);
    }


    public void deletePaiement(Long id) {
        Paiement paiement = paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé."));
        paiementRepository.delete(paiement);
    }
}