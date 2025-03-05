package com.ahch.service;

import com.ahch.entity.AgentTowing;
import com.ahch.Repo.AgentTowingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgentTowingService {

    private final AgentTowingRepository agentTowingRepository;

    public AgentTowingService(AgentTowingRepository agentTowingRepository) {
        this.agentTowingRepository = agentTowingRepository;
    }

    // ✅ Fix: Add this method
    public List<AgentTowing> getAllAgents() {
        return agentTowingRepository.findAll();
    }

    public AgentTowing createAgentTowing(AgentTowing agentTowing) {
        return agentTowingRepository.save(agentTowing);
    }
    // ✅ Update an agent
    public AgentTowing updateAgentTowing(Integer id, AgentTowing updatedAgentTowing) {
        Optional<AgentTowing> existingAgentTowing = agentTowingRepository.findById(id);
        if (existingAgentTowing.isPresent()) {
            AgentTowing agentTowing = existingAgentTowing.get();

            // ✅ Ensure all attributes are updated
            agentTowing.setName(updatedAgentTowing.getName());
            agentTowing.setAvailability(updatedAgentTowing.getAvailability());
            agentTowing.setContactInfo(updatedAgentTowing.getContactInfo());
            agentTowing.setVehicleType(updatedAgentTowing.getVehicleType());

            return agentTowingRepository.save(agentTowing);
        }
        return null;
    }

    public void deleteAgentTowing(Integer id) {
        agentTowingRepository.deleteById(id);
    }
}
