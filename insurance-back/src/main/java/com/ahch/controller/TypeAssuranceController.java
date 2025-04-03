package com.ahch.controller;

import com.ahch.entity.TypeAssurance;
import com.ahch.service.TypeAssuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/types-assurance")
@CrossOrigin("*")
public class TypeAssuranceController {
    @Autowired
    private TypeAssuranceService typeAssuranceService;

    @GetMapping
    public List<TypeAssurance> getAllTypes() {
        return typeAssuranceService.getAllTypes();
    }
}

