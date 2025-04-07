package com.phegondev.usersmanagementsystem.controller;

import com.phegondev.usersmanagementsystem.entity.Agency;
import com.phegondev.usersmanagementsystem.service.AgencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:4200")
public class AgencyController {
    @Autowired
    private AgencyService agencyService;

    @PostMapping("/admin/save/Agency")
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
    public ResponseEntity<?> updateagency(@RequestBody Map<String, Object> agencyData) {
        try {
            // Extract values from request
            Long idAgency = Long.valueOf(agencyData.get("idAgency").toString());

            // Get existing agency
            Agency existingAgency = agencyService.getAgencys(idAgency);
            if (existingAgency == null) {
                return ResponseEntity.badRequest().body("Agency not found");
            }

            // Update agency fields
            if (agencyData.containsKey("latitude")) {
                Double latitude = Double.valueOf(agencyData.get("latitude").toString());
                existingAgency.setLatitude(latitude);
            }

            if (agencyData.containsKey("longitude")) {
                Double longitude = Double.valueOf(agencyData.get("longitude").toString());
                existingAgency.setLongitude(longitude);
            }

            if (agencyData.containsKey("agencyName")) {
                existingAgency.setAgencyName((String) agencyData.get("agencyName"));
            }

            if (agencyData.containsKey("location")) {
                existingAgency.setLocation((String) agencyData.get("location"));
            }

            if (agencyData.containsKey("telephone")) {
                Integer telephone = Integer.valueOf(agencyData.get("telephone").toString());
                existingAgency.setTelephone(telephone);
            }

            if (agencyData.containsKey("email")) {
                existingAgency.setEmail((String) agencyData.get("email"));
            }

            if (agencyData.containsKey("openingHour")) {
                existingAgency.setOpeningHour((String) agencyData.get("openingHour"));
            }

            if (agencyData.containsKey("closingHour")) {
                existingAgency.setClosingHour((String) agencyData.get("closingHour"));
            }

            // Save updated agency
            Agency updatedAgency = agencyService.updateAgency(existingAgency);
            return ResponseEntity.ok(updatedAgency);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating agency: " + e.getMessage());
        }
    }
}