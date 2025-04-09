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

    @GetMapping("/get/Agency")
    public List<Agency> getagencys() {
        return agencyService.getAgencys();
    }

    @GetMapping("/get/Agency/{IdAgency}")
    public Agency getagency(@PathVariable Long IdAgency) {
        return agencyService.getAgencys(IdAgency);
    }

    @DeleteMapping("/delete/Agency/{IdAgency}")
    public void deleteagency(@PathVariable Long IdAgency) {
        agencyService.deleteAgency(IdAgency);
    }

    @PutMapping("/update/Agency")
    public Agency updateagency(@RequestBody Agency agency) {
        return agencyService.updateAgency(agency);
    }


}
