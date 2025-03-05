package com.example.demo.controllers;

import com.example.demo.entities.JobOffer;
import com.example.demo.services.IJobOfferService;
import com.example.demo.services.JobOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("joboffers/")
public class JobOfferController {
    @Autowired
    IJobOfferService iJobOfferService;


    @PostMapping("add")
    public JobOffer  createJobOffer(@RequestBody JobOffer jobOffer) {
        jobOffer.setApplicationDeadline(jobOffer.getApplicationDeadline()); // If needed

        return iJobOfferService.saveJobOffer(jobOffer);
    }

    @GetMapping("getAll")
    public List<JobOffer>getAllJobOffers() {
        return iJobOfferService.getAllJobOffers();

    }

    @GetMapping("{id}")
    public ResponseEntity<JobOffer> getJobOfferById(@PathVariable("id") int jobOfferId) {
        Optional<JobOffer> jobOffer = iJobOfferService.getJobOfferById(jobOfferId);
        return jobOffer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteJobOffer(@PathVariable("id") int jobOfferId) {
        iJobOfferService.deleteJobOffer(jobOfferId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("{id}")
    public ResponseEntity<JobOffer> updateJobOffer(@PathVariable("id") int jobOfferId, @RequestBody JobOffer updatedJobOffer) {
        try {
            JobOffer jobOffer = iJobOfferService.updateJobOffer( updatedJobOffer);
            return ResponseEntity.ok(jobOffer);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
