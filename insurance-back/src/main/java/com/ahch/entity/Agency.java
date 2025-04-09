package com.ahch.entity;

import jakarta.persistence.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;



@Entity
@Table(name = "Agency")

public class Agency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long IdAgency;
    Double  Latitude;
    Double  Longitude;
    String AgencyName;
    String Location;
    Integer telephone;
    String Email;
    String openingHour;  // Example: "08:00"
    String closingHour;

    public String getOpeningHour() {
        return openingHour;
    }

    public void setOpeningHour(String openingHour) {
        this.openingHour = openingHour;
    }

    public String getClosingHour() {
        return closingHour;
    }

    public void setClosingHour(String closingHour) {
        this.closingHour = closingHour;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public Long getIdAgency() {
        return IdAgency;
    }

    public void setIdAgency(Long idAgency) {
        IdAgency = idAgency;
    }

    public Double  getLatitude() {
        return Latitude;
    }

    public void setLatitude(Double  latitude) {
        Latitude = latitude;
    }

    public Double  getLongitude() {
        return Longitude;
    }

    public void setLongitude(Double  longitude) {
        Longitude = longitude;
    }

    public String getAgencyName() {
        return AgencyName;
    }

    public void setAgencyName(String agencyName) {
        AgencyName = agencyName;
    }

    public String getLocation() {
        return Location;
    }

    public void setLocation(String location) {
        Location = location;
    }

    public Integer getTelephone() {
        return telephone;
    }

    public void setTelephone(Integer telephone) {
        this.telephone = telephone;
    }


}
