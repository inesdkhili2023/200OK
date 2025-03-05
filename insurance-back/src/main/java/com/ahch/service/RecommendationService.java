package com.ahch.service;

import com.ahch.entity.Recommendation;
import com.ahch.Repo.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecommendationService {
    @Autowired
    private RecommendationRepository recommendationRepository;

    public List<Recommendation> getAllRecommendations() {
        return recommendationRepository.findAll();
    }

    public Optional<Recommendation> getRecommendationById(Integer id) {
        return recommendationRepository.findById(id);
    }

    public Recommendation createRecommendation(Recommendation recommendation) {
        return recommendationRepository.save(recommendation);
    }

    public Recommendation updateRecommendation(Integer id, Recommendation recommendationDetails) {
        return recommendationRepository.findById(id)
                .map(rec -> {
                    rec.setDescription(recommendationDetails.getDescription());
                    rec.setUserPreferences(recommendationDetails.getUserPreferences());
                    rec.setDateCreation(recommendationDetails.getDateCreation());
                    rec.setStatus(recommendationDetails.getStatus());
                    return recommendationRepository.save(rec);
                })
                .orElseThrow(() -> new RuntimeException("Recommendation not found"));
    }

    public void deleteRecommendation(Integer id) {
        recommendationRepository.deleteById(id);
    }
}
