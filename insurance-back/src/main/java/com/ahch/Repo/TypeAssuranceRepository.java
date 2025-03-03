package com.ahch.Repo;

import com.ahch.entity.TypeAssurance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeAssuranceRepository extends JpaRepository<TypeAssurance, Long> {
}

