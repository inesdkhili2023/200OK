package com.ahch.Repo;

import com.ahch.entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    // Ajoute ici des requêtes spécifiques si nécessaire
}
