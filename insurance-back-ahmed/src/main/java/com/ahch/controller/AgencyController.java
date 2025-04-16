package com.ahch.controller;

import com.ahch.entity.Agency;
import com.ahch.entity.OurUsers;
import com.ahch.service.AgencyService;
import com.ahch.service.OtherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ahch")

public class AgencyController {
    @Autowired
    private AgencyService agencyService;
    @Autowired
    private OtherService otherService;

    @GetMapping("/users")
    public List<OurUsers> getUsers(@RequestHeader("Authorization") String token) {
        return otherService.getAllUsers(token);
    }

   /* @PostMapping("/save/Agency")
    public String saveagency() {
        return println("hello world");
    }*/
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
