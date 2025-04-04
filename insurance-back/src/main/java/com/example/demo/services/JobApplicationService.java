package com.example.demo.services;

import com.example.demo.entities.JobApplication;
import com.example.demo.entities.JobApplicationStatus;
import com.example.demo.entities.JobOffer;
import com.example.demo.repositories.JobApplicationRepo;
import com.example.demo.repositories.JobOfferRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service

public class JobApplicationService implements IJobApplicationService {
    private static final String UPLOAD_DIR = "uploads/";


    @Autowired
    private JobApplicationRepo jobApplicationRepo;
    @Autowired
    private JobOfferRepo jobOfferRepo;
    @PersistenceContext
    private EntityManager entityManager;

    @Override
//    public JobApplication saveJobApplication(JobApplication jobApplication) {
//        if (jobApplication.getJobOffer() != null) {
//            jobApplication.setJobOffer(entityManager.merge(jobApplication.getJobOffer()));
//        }
//        return jobApplicationRepo.save(jobApplication);
//    }
    @Transactional  // 🔥 Assure que la transaction est active
    public JobApplication saveJobApplication(JobApplication jobApplication) {
        if (jobApplication.getJobOffer() != null) {
            // Vérifier si l'offre d'emploi existe en base
            JobOffer existingJobOffer = jobOfferRepo.findById(jobApplication.getJobOffer().getJobOfferId()).orElse(null);

            if (existingJobOffer == null) {
                // Si l'offre n'existe pas, on la sauvegarde avant
                jobOfferRepo.save(jobApplication.getJobOffer());
            }
        }

        return jobApplicationRepo.save(jobApplication);
    }

    @Override
    public List<JobApplication> getAllJobApplications() {
        return jobApplicationRepo.findAll();
    }

    @Override
    public Optional<JobApplication> getJobApplicationById(int jobApplicationId) {
        return jobApplicationRepo.findById(jobApplicationId);
    }
//    @Override
//    public List<JobApplication> getJobApplicationsByUserId(int userId) {
//        return jobApplicationRepo.findByUserId(userId);
//    }

    @Override
    public void deleteJobApplication(int jobApplicationId) {
        jobApplicationRepo.deleteById(jobApplicationId);
    }

    @Override
    public List<JobApplication> getApplicationsByJobOfferId(int jobOfferId) {
        return jobApplicationRepo.findByJobOffer_JobOfferId(jobOfferId);
    }

    public JobApplication updateApplicationStatus(int applicationId, JobApplicationStatus status) {
        JobApplication application = jobApplicationRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        application.setApplicationStatus(status);
        return jobApplicationRepo.save(application);
    }

    @Override
    public String storeFile(MultipartFile file) {
        return "";
    }

    @Override
    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide ou nul.");
        }

        // Créer le dossier si inexistant
        File uploadPath = new File(UPLOAD_DIR);
        if (!uploadPath.exists()) {
            uploadPath.mkdirs();
        }

        // Générer un nom unique pour éviter les conflits
        String uniqueFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path destination = Path.of(UPLOAD_DIR + uniqueFileName);

        // Sauvegarde du fichier
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        return destination.toString();  // Retourne le chemin enregistré
    }
}
