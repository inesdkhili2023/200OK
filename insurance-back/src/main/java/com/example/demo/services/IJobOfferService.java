package com.example.demo.services;

import com.example.demo.entities.JobOffer;

import java.util.List;
import java.util.Optional;

public interface IJobOfferService {
    JobOffer saveJobOffer(JobOffer jobOffer);
    List<JobOffer> getAllJobOffers();
    Optional<JobOffer> getJobOfferById(int jobOfferId);
    void deleteJobOffer(int jobOfferId);
   JobOffer updateJobOffer(JobOffer updatedJobOffer);
}

