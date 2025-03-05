package com.example.demo.repositories;

import com.example.demo.entities.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobOfferRepo extends JpaRepository <JobOffer, Integer> {
}
