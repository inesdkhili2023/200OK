package com.phegondev.usersmanagementsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Entity
@Table(name = "Agency")
public class Agency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("idAgency")
    Long IdAgency;

    @JsonProperty("latitude")
    Double Latitude;

    @JsonProperty("longitude")
    Double Longitude;

    @JsonProperty("agencyName")
    String AgencyName;

    @JsonProperty("location")
    String Location;

    @JsonProperty("telephone")
    Integer telephone;

    @JsonProperty("email")
    String Email;

    @JsonProperty("openingHour")
    String openingHour;  // Example: "08:00"

    @JsonProperty("closingHour")
    String closingHour;

    @OneToMany(mappedBy = "agency", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OurUsers> users;

    public List<OurUsers> getUsers() {
        return users;
    }

    public void setUsers(List<OurUsers> users) {
        this.users = users;
    }

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