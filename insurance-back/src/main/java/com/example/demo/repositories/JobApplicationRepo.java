package com.example.demo.repositories;

import com.example.demo.entities.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface JobApplicationRepo extends JpaRepository<JobApplication, Integer> {
    List<JobApplication> findByJobOffer_JobOfferId(int jobOfferId);
    //List<JobApplication> findByUserId(int userId);

}
