package com.ahch.Repo;

import com.ahch.entity.AgentTowing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentTowingRepository extends JpaRepository<AgentTowing, Integer> {
    AgentTowing findByNameAndVehicleType(String name, String vehicleType);
}
