package com.ahch.controller;

import com.ahch.entity.Recommendation;
import com.ahch.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/recommendations")  // ✅ This must match your Angular API call
@CrossOrigin(origins = "http://localhost:4200")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/all")
    public List<Recommendation> getAllRecommendations() {
        return recommendationService.getAllRecommendations();
    }

    @PostMapping("/add")
    public ResponseEntity<Recommendation> createRecommendation(@RequestBody Recommendation recommendation) {
        Recommendation newRecommendation = recommendationService.createRecommendation(recommendation);
        return ResponseEntity.ok(newRecommendation);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Recommendation> updateRecommendation(@PathVariable Integer id, @RequestBody Recommendation recommendation) {
        Recommendation updatedRecommendation = recommendationService.updateRecommendation(id, recommendation);
        return updatedRecommendation != null ? ResponseEntity.ok(updatedRecommendation) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRecommendation(@PathVariable Integer id) {
        recommendationService.deleteRecommendation(id);
        return ResponseEntity.ok().build();
    }
}
