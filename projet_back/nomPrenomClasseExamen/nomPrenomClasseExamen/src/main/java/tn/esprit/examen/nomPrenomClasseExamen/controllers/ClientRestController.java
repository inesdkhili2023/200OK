package tn.esprit.examen.nomPrenomClasseExamen.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.examen.nomPrenomClasseExamen.entities.Client;
import tn.esprit.examen.nomPrenomClasseExamen.entities.Insurance;
import tn.esprit.examen.nomPrenomClasseExamen.entities.Sinister;
import tn.esprit.examen.nomPrenomClasseExamen.entities.SinisterType;
import tn.esprit.examen.nomPrenomClasseExamen.services.IServices;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/examen")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientRestController {
    private final IServices services;


    @PostMapping("/clients")
    public ResponseEntity<Client> add(@RequestBody Client client) {
        return ResponseEntity.ok(services.add(client));
    }


    @PostMapping("/insurances")
    public ResponseEntity<Insurance> createInsurance(@RequestBody Insurance insurance) {
        return ResponseEntity.ok(services.createInsurance(insurance));
    }

    @PutMapping("/insurances/{id}")
    public ResponseEntity<Insurance> updateInsurance(@PathVariable Long id, @RequestBody Insurance insurance) {
        return ResponseEntity.ok(services.updateInsurance(id, insurance));
    }

    @DeleteMapping("/insurances/{id}")
    public ResponseEntity<Void> deleteInsurance(@PathVariable Long id) {
        services.deleteInsurance(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/insurances")
    public ResponseEntity<List<Insurance>> getAllInsurances() {
        return ResponseEntity.ok(services.getAllInsurances());
    }

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/addsinister")
    public ResponseEntity<Sinister> addSinister(
            @RequestPart("sinister") String sinisterJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            Sinister sinister = mapper.readValue(sinisterJson, Sinister.class);

            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                sinister.setAttachmentPath(fileName);

                // uploadDir vient du @Value
                File uploadDirectory = new File(uploadDir);
                if (!uploadDirectory.exists()) {
                    uploadDirectory.mkdirs();
                }

                File dest = new File(uploadDirectory, fileName);
                file.transferTo(dest);
            }

            Sinister created = services.addSinister(sinister);
            return ResponseEntity.ok(created);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/files/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            // Chemin complet du fichier à partir du nom du fichier
            File file = new File(uploadDir + "/" + fileName);

            // Vérifie si le fichier existe
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Crée une ressource à partir du fichier
            Resource resource = new FileSystemResource(file);

            // Détecte le type du contenu
            String contentType = "application/octet-stream";
            try {
                contentType = Files.probeContentType(file.toPath());
            } catch (IOException e) {
                e.printStackTrace();
            }

            // Retourne le fichier comme une ressource avec le bon content-type
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PutMapping("/sinisters/{id}")
    public ResponseEntity<Sinister> updateSinister(
            @PathVariable Long id,
            @RequestPart("sinister") String sinisterJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            Sinister updatedSinister = mapper.readValue(sinisterJson, Sinister.class);

            // 🔹 Récupérer l'ancien sinistre depuis la base de données
            Sinister existingSinister = services.updateSinister(id, updatedSinister);
            if (existingSinister == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // 🔹 Mise à jour des champs (sans fichier pour l'instant)
            existingSinister.setDateAccident(updatedSinister.getDateAccident());
            existingSinister.setDateDeclaration(updatedSinister.getDateDeclaration());
            existingSinister.setAccidentLocation(updatedSinister.getAccidentLocation());
            existingSinister.setTypeSinister(updatedSinister.getTypeSinister());
            existingSinister.setDescription(updatedSinister.getDescription());
            existingSinister.setStatus(updatedSinister.getStatus());

            // 🔹 Gestion du fichier (Si un fichier est envoyé, remplace l'ancien)
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                existingSinister.setAttachmentPath(fileName);

                File uploadDirectory = new File(uploadDir);
                if (!uploadDirectory.exists()) {
                    uploadDirectory.mkdirs();
                }

                File dest = new File(uploadDirectory, fileName);
                file.transferTo(dest);
            }

            // 🔹 Sauvegarde et retour du sinistre mis à jour
            Sinister updated = services.updateSinister(id, existingSinister);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/sinisters/{id}")
    public ResponseEntity<Void> deleteSinister(@PathVariable Long id) {
        services.deleteSinister(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/sinisters")
    public ResponseEntity<?> getAllSinisters() {
        try {
            List<Sinister> sinisters = services.getAllSinisters();
            if (sinisters.isEmpty()) {
                return ResponseEntity.noContent().build();  // ✅ Retourne 204 si liste vide
            }
            return ResponseEntity.ok(sinisters);
        } catch (Exception e) {
            e.printStackTrace();  // ✅ Affiche l'erreur complète dans la console
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la récupération des sinistres : " + e.getMessage());
        }
    }
    @PutMapping("/sinisters/simulate/{id}")
    public ResponseEntity<Double> simulateCompensation(
            @PathVariable Long id,
            @RequestParam int severity,
            @RequestParam boolean clientResponsible) {
        Double estimatedAmount = services.simulateCompensation(id, severity, clientResponsible);
        return ResponseEntity.ok(estimatedAmount);
    }
    @PutMapping("/sinisters/location/{id}")
    public ResponseEntity<Sinister> updateSinisterLocation(
            @PathVariable Long id,
            @RequestBody Map<String, String> locationData) {
        Sinister sinister = services.updateSinisterLocation(id, locationData.get("latitude"), locationData.get("longitude"));
        return ResponseEntity.ok(sinister);
    }

    @PostMapping("/add/{userId}")
    public ResponseEntity<Sinister> addSinisterToUser(@RequestBody Sinister sinister, @PathVariable Long userId) {
        Sinister savedSinister = services.addSinisterToUser(sinister, userId);
        return ResponseEntity.ok(savedSinister);
    }
    @PostMapping("/sendEmail")
    public ResponseEntity<String> sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body) {

        try {
            // Appel de la méthode sendEmail du service
            services.sendEmail(to, subject, body);
            return ResponseEntity.ok("Email envoyé avec succès !");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de l'envoi de l'email");
        }
    }

    @GetMapping("/sinisters/statistics/by-type")
    public ResponseEntity<Map<String, Long>> getSinisterStatsByType() {
        Map<SinisterType, Long> data = services.getSinisterCountByType();
        Map<String, Long> stringKeyMap = new HashMap<>();
        data.forEach((key, value) -> stringKeyMap.put(key.toString(), value));
        return ResponseEntity.ok(stringKeyMap);
    }







    /*@PostMapping("/assignsinister/{sinisterId}/client/{clientId}")
    public ResponseEntity<Sinister> addAssignSinisterToClient(@PathVariable Long sinisterId, @PathVariable Long clientId) {
        Sinister assigned = services.addAssignSinisterToClient(sinisterId, clientId);
        return ResponseEntity.ok(assigned);
    }*/
}
