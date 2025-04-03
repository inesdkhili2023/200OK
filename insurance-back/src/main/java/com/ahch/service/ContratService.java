package com.ahch.service;

import com.ahch.Repo.ContratRepository;
import com.ahch.entity.Contrat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ContratService {

    @Autowired
    private ContratRepository contratRepository;


    public List<Contrat> getAllContrats() {
        return contratRepository.findAll();
    }


    public Optional<Contrat> getContratById(Long id) {
        return contratRepository.findById(id);
    }
}
