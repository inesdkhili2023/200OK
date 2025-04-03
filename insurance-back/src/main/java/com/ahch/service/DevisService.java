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


    public Devis createDevis(Map<String, Object> payload) {
        Devis devis = new Devis();

        // Associer le type d'assurance
        Long typeAssuranceId = Long.valueOf(payload.get("typeAssuranceId").toString());
        TypeAssurance typeAssurance = typeAssuranceRepository.findById(typeAssuranceId)
                .orElseThrow(() -> new RuntimeException("TypeAssurance introuvable"));
        devis.setTypeAssurance(typeAssurance);

        // Extraire les champs dynamiques (sauf typeAssuranceId)
        Map<String, String> details = new HashMap<>();
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            if (!entry.getKey().equals("typeAssuranceId")) {
                details.put(entry.getKey(), entry.getValue().toString());
            }
        }
        devis.setDetails(details);

        return devisRepository.save(devis);
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
        Facture facture = new Facture(numFacture, paiement, montant);
        factureRepository.save(facture);
    }
}
