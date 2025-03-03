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

    //  Création d'un devis
    public Devis createDevis(Long typeAssuranceId, Map<String, String> details) {
        System.out.println("Type Assurance ID reçu : " + typeAssuranceId);

        TypeAssurance type = typeAssuranceRepository.findById(typeAssuranceId)
                .orElseThrow(() -> new RuntimeException("Type d'assurance non trouvé"));

        System.out.println("Type Assurance trouvé : " + type.getNom());

        Devis devis = new Devis();
        devis.setTypeAssurance(type);
        devis.setDetails(details);
        devis.setValide(false);

        Devis savedDevis = devisRepository.save(devis);
        System.out.println("Devis enregistré avec ID : " + savedDevis.getId());

        return savedDevis;
    }

    // 🔹 Récupération d'un devis par ID
    public Devis getDevisById(Long id) {
        return devisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devis non trouvé"));
    }

    // 🔹 Mise à jour d'un devis
    public Devis updateDevis(Long id, Map<String, String> newDetails) {
        Devis devis = devisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devis non trouvé"));

        devis.setDetails(newDetails);
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
