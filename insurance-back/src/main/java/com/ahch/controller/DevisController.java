package com.ahch.controller;

import com.ahch.entity.Devis;
import com.ahch.entity.OurUsers;
import com.ahch.service.DevisService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/devis")
@CrossOrigin(origins = "http://localhost:4200")
public class DevisController {
    @Autowired
    private DevisService devisService;
    @GetMapping("/users")
    public List<OurUsers> getUsers(@RequestHeader("Authorization") String token) {
        return devisService.getAllUsers(token);
    }


    @PostMapping("/create")
    public ResponseEntity<?> createDevis(@RequestBody Map<String, Object> payload) {
        try {
            Object typeAssuranceIdObj = payload.get("typeAssuranceId");
            if (typeAssuranceIdObj == null || !(typeAssuranceIdObj instanceof Number)) {
                return ResponseEntity.badRequest().body("Erreur : typeAssuranceId doit être un nombre.");
            }
            System.out.println("✅ Received payload: " + payload);

            // Le typeAssuranceId est intégré directement dans le payload
            payload.put("typeAssuranceId", ((Number) typeAssuranceIdObj).longValue());

            // Appel avec le payload complet
            Devis createdDevis = devisService.createDevis(payload);
            return ResponseEntity.ok(createdDevis);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Erreur lors de la création du devis: " + e.getMessage());
        }
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
    public ResponseEntity<Devis> updateDevis(@PathVariable Long id, @RequestBody Map<String,Object> newDetails) {
        Devis updatedDevis = devisService.updateDevis(id, newDetails);
        return ResponseEntity.ok(updatedDevis);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDevis(@PathVariable Long id) {
        devisService.deleteDevis(id);
        return ResponseEntity.ok("Devis supprimé avec succès");
    }


}

