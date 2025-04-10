package com.ahch.controller;

import com.ahch.entity.Paiement;
import com.ahch.service.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/paiements")
@CrossOrigin(origins = "http://localhost:4200")
public class PaiementController {

    @Autowired
    private PaiementService paiementService;
    @Value("${stripe.api.key}")
    private String stripeApiKey;


    @PostMapping("/create")
    public ResponseEntity<?> createPaiement(@RequestBody Paiement paiement) {
        System.out.println("📝 Données reçues dans le backend : " + paiement);
        System.out.println("📩 Email : " + paiement.getMail());
        System.out.println("📩 Confirmation Email : " + paiement.getConfirmationMail());
        System.out.println("📞 Numéro de téléphone : " + paiement.getNumtel());

        try {
            Paiement savedPaiement = paiementService.createPaiement(paiement);
            return ResponseEntity.ok(savedPaiement);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @GetMapping("/all")
    public ResponseEntity<List<Paiement>> getAllPaiements() {
        return ResponseEntity.ok(paiementService.getAllPaiements());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Paiement> getPaiementById(@PathVariable Long id) {
        return ResponseEntity.ok(paiementService.getPaiementById(id));
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePaiement(@PathVariable Long id, @RequestBody Paiement paiement) {
        try {
            Paiement updatedPaiement = paiementService.updatePaiement(id, paiement);
            return ResponseEntity.ok(updatedPaiement);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePaiement(@PathVariable Long id) {
        paiementService.deletePaiement(id);
        return ResponseEntity.ok("Paiement supprimé avec succès !");
    }
    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Paiement paiementRequest) {
        try {
            // Initialisation Stripe
            Stripe.apiKey = stripeApiKey;

            // Validation
            if (paiementRequest.getMontant() == null || paiementRequest.getMontant() <= 0) {
                return ResponseEntity.badRequest().body("Montant invalide");
            }

            // Création du PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long)(paiementRequest.getMontant() * 100)) // en centimes
                    .setCurrency("eur")
                    .addPaymentMethodType("card") // Méthode de paiement explicite
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            return ResponseEntity.ok(Map.of(
                    "clientSecret", intent.getClientSecret()
            ));

        } catch (StripeException e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur Stripe: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur interne: " + e.getMessage());
        }
    }

    @PostMapping("/confirm-and-save")
    public ResponseEntity<?> confirmAndSavePayment(
            @RequestParam String paymentIntentId,
            @RequestBody Paiement paiement) {
        try {
            Paiement savedPaiement = paiementService.createPaiementWithStripe(paiement, paymentIntentId);
            return ResponseEntity.ok(savedPaiement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

}