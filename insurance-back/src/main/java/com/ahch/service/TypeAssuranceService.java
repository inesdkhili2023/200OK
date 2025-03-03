package com.ahch.service;

import com.ahch.Repo.TypeAssuranceRepository;
import com.ahch.entity.TypeAssurance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TypeAssuranceService {
    @Autowired
    private TypeAssuranceRepository typeAssuranceRepository;

    public List<TypeAssurance> getAllTypes() {
        return typeAssuranceRepository.findAll();
    }
}
