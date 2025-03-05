package com.ahch.Repo;

import com.ahch.entity.Towing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TowingRepository extends JpaRepository<Towing, Long> {
}