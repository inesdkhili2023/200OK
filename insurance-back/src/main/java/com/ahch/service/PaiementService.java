package com.ahch.service;

import com.ahch.Repo.ContratRepository;
import com.ahch.Repo.FactureRepository;
import com.ahch.Repo.PaiementRepository;
import com.ahch.entity.Contrat;
import com.ahch.entity.Facture;
import com.ahch.entity.Paiement;
import org.springframework.beans.factory.annotation.Autowired;
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


    public Paiement createPaiement(Paiement paiement) {
        if (paiement.getContrat() == null || paiement.getContrat().getNumContrat() == null) {
            throw new IllegalArgumentException("Le paiement doit être lié à un contrat valide.");
        }

        Optional<Contrat> optionalContrat = contratRepository.findByNumContrat(paiement.getContrat().getNumContrat());
        if (optionalContrat.isEmpty()) {
            throw new RuntimeException("Numéro de contrat invalide.");
        }
        Contrat contrat = optionalContrat.get();
        paiement.setContrat(contrat);

        Paiement savedPaiement = paiementRepository.save(paiement);

        // Générer une facture
        String numFacture = "FAC-" + UUID.randomUUID().toString().substring(0, 8);
        Facture facture = new Facture(numFacture, savedPaiement, savedPaiement.getMontant());
        factureRepository.save(facture);

        return savedPaiement;
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