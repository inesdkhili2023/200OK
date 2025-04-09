package com.ahch.service;

import com.ahch.entity.Facture;
import com.ahch.Repo.FactureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FactureService {

    @Autowired
    private FactureRepository factureRepository;


    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }


    public Optional<Facture> getFactureById(Long id) {
        return factureRepository.findById(id);
    }
}