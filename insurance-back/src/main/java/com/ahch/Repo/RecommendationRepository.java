package com.ahch.Repo;

import com.ahch.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Integer> {
    List<Recommendation> findByUserIdUser(Integer idUser);
}
