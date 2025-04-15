package com.ahch.service;

import com.ahch.Repo.ContratRepository;
import com.ahch.entity.Contrat;
import com.ahch.entity.OurUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ContratService {

    @Autowired
    private ContratRepository contratRepository;
    @Autowired
    private UserServiceClient userServiceClient;

    public List<OurUsers> getAllUsers(String jwtToken) {
        String finalToken = jwtToken.startsWith("Bearer ") ? jwtToken : "Bearer " + jwtToken;
        ReqRes response = userServiceClient.getAllUsers(finalToken).getBody();
        System.out.println("Sending token: [" + finalToken + "]");
        return response != null ? response.getOurUsersList() : List.of();
    }


    public List<Contrat> getAllContrats() {
        return contratRepository.findAll();
    }


    public Optional<Contrat> getContratById(Long id) {
        return contratRepository.findById(id);
    }
}