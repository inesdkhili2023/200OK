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
    Long Latitude;
    Long Longitude;
    String AgencyName;
    String Location;
    Integer telephone;

    public Long getIdAgency() {
        return IdAgency;
    }

    public void setIdAgency(Long idAgency) {
        IdAgency = idAgency;
    }

    public Long getLatitude() {
        return Latitude;
    }

    public void setLatitude(Long latitude) {
        Latitude = latitude;
    }

    public Long getLongitude() {
        return Longitude;
    }

    public void setLongitude(Long longitude) {
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
