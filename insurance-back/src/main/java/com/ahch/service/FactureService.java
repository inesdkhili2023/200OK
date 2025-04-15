package com.ahch.service;

import com.ahch.entity.Facture;
import com.ahch.Repo.FactureRepository;
import com.ahch.entity.OurUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FactureService {

    @Autowired
    private FactureRepository factureRepository;
    @Autowired
    private UserServiceClient userServiceClient;

    public List<OurUsers> getAllUsers(String jwtToken) {
        String finalToken = jwtToken.startsWith("Bearer ") ? jwtToken : "Bearer " + jwtToken;
        ReqRes response = userServiceClient.getAllUsers(finalToken).getBody();
        System.out.println("Sending token: [" + finalToken + "]");
        return response != null ? response.getOurUsersList() : List.of();
    }


    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }


    public Optional<Facture> getFactureById(Long id) {
        return factureRepository.findById(id);
    }
}