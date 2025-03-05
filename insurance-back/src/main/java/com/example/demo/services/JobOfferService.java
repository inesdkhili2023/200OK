package com.example.demo.services;

import com.example.demo.entities.JobOffer;
import com.example.demo.repositories.JobOfferRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobOfferService implements IJobOfferService {
   @Autowired
    JobOfferRepo jobOfferRepo;


    @Override
    public JobOffer saveJobOffer(JobOffer jobOffer) {
        System.out.println("Received JobOffer: " + jobOffer);
        return jobOfferRepo.save(jobOffer);
    }
    @Override
    public List<JobOffer> getAllJobOffers() {
        return jobOfferRepo.findAll();
    }
    @Override
    public Optional<JobOffer> getJobOfferById(int jobOfferId) {
        return jobOfferRepo.findById(jobOfferId);
    }
    @Override
    public void deleteJobOffer(int jobOfferId) {
        jobOfferRepo.deleteById(jobOfferId);
    }

    @Override
    public JobOffer updateJobOffer(JobOffer jobOffer) {

    JobOffer existingJobOffer = jobOfferRepo.findById(jobOffer.getJobOfferId())
            .orElseThrow(() -> new RuntimeException("JobOffer not found with id: " + jobOffer.getJobOfferId()));

    existingJobOffer.setTitle(jobOffer.getTitle());
    existingJobOffer.setDescription(jobOffer.getDescription());
    existingJobOffer.setRequirements(jobOffer.getRequirements());
    existingJobOffer.setLocation(jobOffer.getLocation());
    existingJobOffer.setContractType(jobOffer.getContractType());
    existingJobOffer.setApplicationDeadline(jobOffer.getApplicationDeadline());

    return jobOfferRepo.save(existingJobOffer);
}

}
