package com.example.demo.controllers;

import com.example.demo.entities.JobApplication;
import com.example.demo.entities.JobApplicationStatus;
import com.example.demo.entities.JobOffer;
import com.example.demo.repositories.JobApplicationRepo;
import com.example.demo.repositories.JobOfferRepo;
import com.example.demo.services.IJobApplicationService;
import com.example.demo.services.JobApplicationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("jobapplications/")
public class JobApplicationController {


    @Autowired
    private JobApplicationRepo jobApplicationRepository;

    @Autowired
    private JobOfferRepo jobOfferRepository;
    @Autowired
    private IJobApplicationService jobApplicationService;
    @Autowired
    private JavaMailSender mailSender;
    @PostMapping("add")
    public ResponseEntity<JobApplication> createJobApplication(@RequestBody JobApplication jobApplication) {

        JobApplication savedJobApplication = jobApplicationService.saveJobApplication(jobApplication);
        System.out.println("Données reçues : " + jobApplication);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("malekfeki18@gmail.com"); // Remplace par ton email
        message.setTo(jobApplication.getEmail());
        message.setSubject("Confirmation de votre candidature " );

        String emailContent = String.format(
                "Cher(e) %s %s,\n\n"
                        + "Nous vous remercions pour votre candidature au poste de référence %s. "
                        + "Nous avons bien reçu votre dossier et notre équipe de recrutement l'examinera avec attention.\n\n"
                        + "Si votre profil correspond à nos attentes, nous vous contacterons prochainement pour la suite du processus.\n\n"
                        + "En attendant, n’hésitez pas à consulter notre site pour découvrir nos dernières actualités.\n\n"
                        + "Bonne chance et à bientôt !\n\n"
                        + "Cordialement,\n"
                        + "L'équipe RH d'assurances Maghrebia",
                jobApplication.getFirstName(),
                jobApplication.getLastName(),
                jobApplication.getJobOffer().getJobOfferId()
        );

        message.setText(emailContent);
        mailSender.send(message);


        return new ResponseEntity<>(savedJobApplication, HttpStatus.CREATED);
    }

//@PostMapping("add")
//public ResponseEntity<?> createJobApplication(
//        @RequestParam("resume") MultipartFile resume,
//        @RequestParam("lettreMotivation") MultipartFile lettreMotivation,
//        @RequestParam("firstName") String firstName,
//        @RequestParam("lastName") String lastName,
//        @RequestParam("email") String email,
//        @RequestParam("phone") String phone,
//        @RequestParam("address") String address,
//        @RequestParam("city") String city,
//        @RequestParam("zipCode") String zipCode,
//        @RequestParam("educationLevel") String educationLevel,
//        @RequestParam("experienceLevel") String experienceLevel,
//        @RequestParam("fieldOfStudy") String fieldOfStudy,
//        @RequestParam("jobType") String jobType,
//        @RequestParam("immediateAvailability") boolean immediateAvailability,
//        @RequestParam("languages") String languages,
//        @RequestParam("commentaire") String commentaire,
//        @RequestParam("jobOfferId") Long jobOfferId
//) {
//    try {
//        // Stocker les fichiers et récupérer leur chemin
//        String resumePath = jobApplicationService.saveFile(resume);
//        String lettreMotivationPath = jobApplicationService.saveFile(lettreMotivation);
//
//        JobApplication jobApplication = new JobApplication();
//        jobApplication.setFirstName(firstName);
//        jobApplication.setLastName(lastName);
//        jobApplication.setEmail(email);
//        jobApplication.setPhone(phone);
//        jobApplication.setAddress(address);
//        jobApplication.setCity(city);
//        jobApplication.setZipCode(zipCode);
//        jobApplication.setEducationLevel(educationLevel);
//        jobApplication.setExperienceLevel(experienceLevel);
//        jobApplication.setFieldOfStudy(fieldOfStudy);
//        jobApplication.setJobType(jobType);
//        jobApplication.setImmediateAvailability(immediateAvailability);
//        jobApplication.setLanguages(languages);
//        jobApplication.setCommentaire(commentaire);
//        jobApplication.setResume(resumePath);
//        jobApplication.setLettreMotivation(lettreMotivationPath);
//
//        JobApplication savedJobApplication = jobApplicationService.saveJobApplication(jobApplication);
//
//        return new ResponseEntity<>(savedJobApplication, HttpStatus.CREATED);
//    } catch (IOException e) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body("Erreur lors de l'enregistrement des fichiers : " + e.getMessage());
//    }
//}

    @PostMapping("/apply")
    public ResponseEntity<?> apply(
            @RequestParam("jobApplication") String jobApplicationJson,
            @RequestParam("resume") MultipartFile resume,
            @RequestParam("lettreMotivation") MultipartFile lettreMotivation) {

        try {
            // Convertir JSON en objet JobApplication
            ObjectMapper objectMapper = new ObjectMapper();
            JobApplication jobApplication = objectMapper.readValue(jobApplicationJson, JobApplication.class);

            // Vérifier que les fichiers ne sont pas vides
            if (resume.isEmpty() || lettreMotivation.isEmpty()) {
                return ResponseEntity.badRequest().body("Les fichiers sont requis !");
            }

            // Sauvegarder les fichiers et obtenir les chemins
            String resumePath = jobApplicationService.saveFile(resume);
            String lettreMotivationPath = jobApplicationService.saveFile(lettreMotivation);

            // Assigner les chemins aux objets
            jobApplication.setResume(resumePath);
            jobApplication.setLettreMotivation(lettreMotivationPath);

            // Sauvegarder l'application en base de données
            jobApplicationRepository.save(jobApplication);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("malekfeki18@gmail.com"); // Remplace par ton email
            message.setTo(jobApplication.getEmail());
            message.setSubject("Confirmation de votre candidature - " );

            String emailContent = String.format(
                    "Cher(e) %s %s,\n\n"
                            + "Nous vous remercions pour votre candidature au poste de référence %s. "
                            + "Nous avons bien reçu votre dossier et notre équipe de recrutement l'examinera avec attention.\n\n"
                            + "Si votre profil correspond à nos attentes, nous vous contacterons prochainement pour la suite du processus.\n\n"
                            + "En attendant, n’hésitez pas à consulter notre site pour découvrir nos dernières actualités.\n\n"
                            + "Bonne chance et à bientôt !\n\n"
                            + "Cordialement,\n"
                            + "L'équipe RH d'assurances Maghrebia",
                    jobApplication.getFirstName(),
                    jobApplication.getLastName(),
                    jobApplication.getJobOffer().getJobOfferId()
            );

            message.setText(emailContent);
            mailSender.send(message);
            return ResponseEntity.ok(Collections.singletonMap("message", "Candidature envoyée avec succès !"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'envoi de la candidature.");
        }
    }



    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping("/files/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            // Path to the file
            File file = new File(uploadDir  + fileName);

            // Check if the file exists
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Create a resource from the file
            Resource resource = new FileSystemResource(file);

            // Detect content type
            String contentType = Files.probeContentType(file.toPath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


//    @PostMapping("apply")
//    public ResponseEntity<JobApplication> applyForJob(
//            @RequestPart("jobApplication") String jobApplicationJson,
//            @RequestPart(value = "resume", required = false) MultipartFile resumeFile,
//            @RequestPart(value = "lettreMotivation", required = false) MultipartFile lettreMotivationFile) {
//
//        try {
//            ObjectMapper objectMapper = new ObjectMapper();
//            JobApplication jobApplication = objectMapper.readValue(jobApplicationJson, JobApplication.class);
//
//            if (jobApplication.getJobOffer() != null && jobApplication.getJobOffer().getJobOfferId() > 0) {
//                JobOffer jobOffer = jobOfferRepository.findById(jobApplication.getJobOffer().getJobOfferId())
//                        .orElseThrow(() -> new RuntimeException("Offre non trouvée : " + jobApplication.getJobOffer().getJobOfferId()));
//                jobApplication.setJobOffer(jobOffer);
//            }
//
//            jobApplication.setAppliedAt(LocalDateTime.now());
//
//            if (resumeFile != null && !resumeFile.isEmpty()) {
//                jobApplication.setResume(jobApplicationService.saveFile(resumeFile));
//            }
//            if (lettreMotivationFile != null && !lettreMotivationFile.isEmpty()) {
//                jobApplication.setLettreMotivation(jobApplicationService.saveFile(lettreMotivationFile));
//            }
//
//            JobApplication savedApplication = jobApplicationRepository.save(jobApplication);
//            return new ResponseEntity<>(savedApplication, HttpStatus.CREATED);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

    @PostMapping("uploadFile")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Fichier vide !");
            }
            String filePath = jobApplicationService.saveFile(file);
            return ResponseEntity.ok("Fichier enregistré : " + filePath);
        } catch (IOException e) { // Catch IOException properly
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur d'enregistrement du fichier : " + e.getMessage());
        }
    }





    @GetMapping("getAll")
    public ResponseEntity<List<JobApplication>> getAllJobApplications() {
        List<JobApplication> jobApplications = jobApplicationService.getAllJobApplications();
        return ResponseEntity.ok(jobApplications);
    }

    @GetMapping("{id}")
    public ResponseEntity<JobApplication> getJobApplicationById(@PathVariable("id") int jobApplicationId) {
        Optional<JobApplication> jobApplication = jobApplicationService.getJobApplicationById(jobApplicationId);
        return jobApplication.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
//    @GetMapping("user/{userId}")
//    public ResponseEntity<List<JobApplication>> getJobApplicationsByUserId(@PathVariable int userId) {
//        List<JobApplication> applications = jobApplicationService.getJobApplicationsByUserId(userId);
//        return ResponseEntity.ok(applications);
//    }


    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteJobApplication(@PathVariable("id") int jobApplicationId) {
        jobApplicationService.deleteJobApplication(jobApplicationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("jobOffer/{jobOfferId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByJobOfferId(@PathVariable int jobOfferId) {
        List<JobApplication> applications = jobApplicationService.getApplicationsByJobOfferId(jobOfferId);
        return ResponseEntity.ok(applications);
    }
    @PutMapping("{id}/status")
    public ResponseEntity<JobApplication> updateApplicationStatus(@PathVariable int id, @RequestParam JobApplicationStatus status) {

        JobApplication updatedApplication = jobApplicationService.updateApplicationStatus(id, status);

        // Envoi de l'email au candidat
        sendStatusUpdateEmail(updatedApplication);

        return ResponseEntity.ok(updatedApplication);

    }
    private void sendStatusUpdateEmail(JobApplication jobApplication) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("malekfeki18@gmail.com");
        message.setTo(jobApplication.getEmail());
        message.setSubject("Mise à jour de votre candidature");

        String emailContent = String.format(
                "Cher(e) %s %s,\n\n" +
                        "Nous vous informons que le statut de votre candidature au poste de référence %s a été mis à jour.\n\n" +
                        "Statut actuel : %s\n\n" +
                        "Si vous avez des questions, n'hésitez pas à nous contacter.\n\n" +
                        "Cordialement,\n" +
                        "L'équipe RH d'assurances Maghrebia",
                jobApplication.getFirstName(),
                jobApplication.getLastName(),
                jobApplication.getJobOffer().getJobOfferId(),
                jobApplication.getApplicationStatus()
        );

        message.setText(emailContent);
        mailSender.send(message);
    }

    @PostMapping(value = "fileUpload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> handleFileUpload(
            @RequestParam("cv") MultipartFile cvFile,
            @RequestParam("lettreMotivation") MultipartFile lettreMotivationFile
    ) {
        if (cvFile.isEmpty() || lettreMotivationFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Les fichiers ne doivent pas être vides");
        }

        return ResponseEntity.ok("Fichiers reçus avec succès");
    }


}
