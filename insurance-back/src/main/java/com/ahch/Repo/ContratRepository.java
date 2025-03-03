package com.ahch.Repo;

import com.ahch.entity.Contrat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ContratRepository extends JpaRepository<Contrat, Long> {
    Optional<Contrat> findByNumContrat(String numContrat);
}
