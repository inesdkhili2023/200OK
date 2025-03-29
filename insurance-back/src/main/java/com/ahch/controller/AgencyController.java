package com.ahch.controller;

import com.ahch.entity.Agency;
import com.ahch.service.AgencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
public class AgencyController {
    @Autowired
    private AgencyService agencyService;


    @PostMapping("/save/Agency")
    public Agency saveagency(@RequestBody Agency agency) {
        return agencyService.saveAgency(agency);
    }

    @GetMapping("/get/agency")
    public List<Agency> getagencys() {
        return agencyService.getAgencys();
    }

    @GetMapping("/get/agency/{agencyId}")
    public Agency getagency(@PathVariable Long agencyId) {
        return agencyService.getAgencys(agencyId);
    }

    @DeleteMapping("/delete/agency/{agencyId}")
    public void deleteagency(@PathVariable Long agencyId) {
        agencyService.deleteAgency(agencyId);
    }

    @PutMapping("/update/agency")
    public Agency updateagency(@RequestBody Agency agency) {
        return agencyService.updateAgency(agency);
    }


}
