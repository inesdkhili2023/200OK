package com.example.demo.services;

import com.example.demo.entities.JobApplication;
import com.example.demo.entities.JobApplicationStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IJobApplicationService {
    JobApplication saveJobApplication(JobApplication jobApplication);
    List<JobApplication> getAllJobApplications();
    Optional<JobApplication> getJobApplicationById(int jobApplicationId);
    void deleteJobApplication(int jobApplicationId);
    List<JobApplication> getApplicationsByJobOfferId(int jobOfferId);
    JobApplication updateApplicationStatus(int id, JobApplicationStatus status);
    String storeFile(MultipartFile file); // Ajout de la méthode pour stocker les fichiers

    String saveFile(MultipartFile file) throws IOException;
}
