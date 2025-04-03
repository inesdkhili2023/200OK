package com.ahch.controller;

import com.ahch.entity.Paiement;
import com.ahch.service.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/paiements")
@CrossOrigin(origins = "http://localhost:4200")
public class PaiementController {

    @Autowired
    private PaiementService paiementService;


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
}
