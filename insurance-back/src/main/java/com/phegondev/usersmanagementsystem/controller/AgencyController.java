package com.phegondev.usersmanagementsystem.controller;

import com.phegondev.usersmanagementsystem.entity.Agency;
import com.phegondev.usersmanagementsystem.service.AgencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
public class AgencyController {
    @Autowired
    private AgencyService agencyService;

    @PostMapping("/allRole/save/Agency")
    public Agency saveagency(@RequestBody Agency agency) {
        return agencyService.saveAgency(agency);
    }

    @GetMapping("/allRole/get/Agency")
    public List<Agency> getagencys() {
        return agencyService.getAgencys();
    }

    @GetMapping("/allRole/get/Agency/{IdAgency}")
    public Agency getagency(@PathVariable Long IdAgency) {
        return agencyService.getAgencys(IdAgency);
    }

    @DeleteMapping("/allRole/delete/Agency/{IdAgency}")
    public void deleteagency(@PathVariable Long IdAgency) {
        agencyService.deleteAgency(IdAgency);
    }

    @PutMapping("/allRole/update/Agency")
    public Agency updateagency(@RequestBody Agency agency) {
        return agencyService.updateAgency(agency);
    }
}
