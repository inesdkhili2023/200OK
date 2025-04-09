package com.ahch.service;

import com.ahch.Repo.ContratRepository;
import com.ahch.Repo.DevisRepository;
import com.ahch.Repo.FactureRepository;
import com.ahch.Repo.PaiementRepository;
import com.ahch.Repo.TypeAssuranceRepository;
import com.ahch.entity.Contrat;
import com.ahch.entity.Devis;
import com.ahch.entity.Facture;
import com.ahch.entity.Paiement;
import com.ahch.entity.TypeAssurance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

@Service
public class DevisService {
    @Autowired
    private DevisRepository devisRepository;
    @Autowired
    private TypeAssuranceRepository typeAssuranceRepository;
    @Autowired
    private ContratRepository contratRepository;
    @Autowired
    private PaiementRepository paiementRepository;
    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private EmailService emailService;


    public Devis createDevis(Map<String, Object> payload) {
        Devis devis = new Devis();

        // 1. Extract type assurance
        Long typeAssuranceId = Long.valueOf(payload.get("typeAssuranceId").toString());
        TypeAssurance typeAssurance = typeAssuranceRepository.findById(typeAssuranceId)
                .orElseThrow(() -> new RuntimeException("TypeAssurance introuvable"));
        devis.setTypeAssurance(typeAssurance);

        // 2. Extract details from nested map
        Map<String, Object> detailsMap = (Map<String, Object>) payload.get("details");
        Map<String, String> details = new HashMap<>();

        for (Map.Entry<String, Object> entry : detailsMap.entrySet()) {
            details.put(entry.getKey(), entry.getValue() != null ? entry.getValue().toString() : null);
        }
        devis.setDetails(details);

        // 3. Save the devis
        System.out.println("🟢 Starting to save devis...");
        Devis savedDevis = devisRepository.save(devis);
        System.out.println("🟢 Devis saved with ID: " + savedDevis.getId());

        // 4. Send email (using values from detailsMap directly)
        String email = (String) detailsMap.get("email");
        String nom = (String) detailsMap.get("nom");
        String prenom = (String) detailsMap.get("prenom");

        System.out.println("📧 Email sending parameters:");
        System.out.println("  - Email: " + email);
        System.out.println("  - Nom: " + nom);
        System.out.println("  - Prenom: " + prenom);

        if (email != null && nom != null && prenom != null) {
            try {
                System.out.println("🔄 Attempting to send email...");
                emailService.envoyerMailConfirmation(email, nom, prenom);
                System.out.println("✅ Email sent successfully!");
            } catch (Exception e) {
                System.err.println("❌ Email sending failed!");
                System.err.println("Error message: " + e.getMessage());
                e.printStackTrace();

                if (e instanceof MailAuthenticationException) {
                    System.err.println("🔐 Authentication failed - check credentials");
                } else if (e instanceof MailSendException) {
                    System.err.println("📤 SMTP transmission failed");
                }
            }
        } else {
            System.err.println("⚠️ Missing required email parameters!");
            if (email == null) System.err.println("  - Email is null");
            if (nom == null) System.err.println("  - Nom is null");
            if (prenom == null) System.err.println("  - Prenom is null");
        }

        return savedDevis;
    }

    // 🔹 Récupération d'un devis par ID
    public Devis getDevisById(Long id) {
        return devisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devis non trouvé"));
    }

    // 🔹 Mise à jour d'un devis
    public Devis updateDevis(Long id, Map<String,Object> newDetails) {
        Devis devis = devisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devis non trouvé"));


        return devisRepository.save(devis);
    }

    // 🔹 Suppression d'un devis
    public void deleteDevis(Long id) {
        Devis devis = devisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devis non trouvé"));

        devisRepository.delete(devis);
    }

    // 🔥 **Validation et paiement d'un devis → Génération automatique du contrat et de la facture**
    public void validerEtPayerDevis(Long devisId, double montant) {
        Devis devis = devisRepository.findById(devisId)
                .orElseThrow(() -> new RuntimeException("Devis non trouvé"));

        if (devis.isValide()) {
            throw new RuntimeException("Le devis est déjà validé.");
        }

        // ✅ 1. Validation du devis
        devis.setValide(true);
        devisRepository.save(devis);

        // ✅ 2. Génération automatique d'un contrat
        String numContrat = "CT-" + UUID.randomUUID().toString().substring(0, 8);
        Contrat contrat = new Contrat(numContrat, devis);
        contratRepository.save(contrat);

        // ✅ 3. Création du paiement lié au contrat
        Paiement paiement = new Paiement();
        paiement.setMontant(montant);
        paiement.setContrat(contrat);
        paiementRepository.save(paiement);

        // ✅ 4. Génération automatique d'une facture
        String numFacture = "FAC-" + UUID.randomUUID().toString().substring(0, 8);
        Facture facture = new Facture(numFacture, paiement, montant); // Ajoutez le contrat comme 4ème paramètre
        factureRepository.save(facture);
    }
}
