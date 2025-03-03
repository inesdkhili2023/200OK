package com.ahch.controller;

import com.ahch.entity.Devis;
import com.ahch.service.DevisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/devis")
@CrossOrigin(origins = "http://localhost:4200")
public class DevisController {
    @Autowired
    private DevisService devisService;

    @PostMapping("/create")
    public ResponseEntity<Devis> createDevis(@RequestBody Map<String, Object> payload) {
        Long typeAssuranceId = Long.parseLong(payload.get("typeAssuranceId").toString());
        Map<String, String> details = (Map<String, String>) payload.get("details");

        Devis createdDevis = devisService.createDevis(typeAssuranceId, details);
        return ResponseEntity.ok(createdDevis);
    }
    @PostMapping("/valider-et-payer")
    public ResponseEntity<String> validerEtPayerDevis(@RequestBody Map<String, Object> payload) {
        Long devisId = Long.parseLong(payload.get("devisId").toString());
        double montant = Double.parseDouble(payload.get("montant").toString());

        try {
            devisService.validerEtPayerDevis(devisId, montant);
            return ResponseEntity.ok("Le devis a été validé et payé avec succès, le contrat et la facture ont été générés.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Erreur: " + e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Devis> getDevisById(@PathVariable Long id) {
        Devis devis = devisService.getDevisById(id);
        return ResponseEntity.ok(devis);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Devis> updateDevis(@PathVariable Long id, @RequestBody Map<String, String> newDetails) {
        Devis updatedDevis = devisService.updateDevis(id, newDetails);
        return ResponseEntity.ok(updatedDevis);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDevis(@PathVariable Long id) {
        devisService.deleteDevis(id);
        return ResponseEntity.ok("Devis supprimé avec succès");
    }


}

