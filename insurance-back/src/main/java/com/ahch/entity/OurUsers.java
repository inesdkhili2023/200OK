package com.ahch.entity;


import com.ahch.entity.Civility;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;


import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "ourusers")

public class OurUsers  {

    public long getIduser() {
        return iduser;
    }

    public void setIduser(long iduser) {
        this.iduser = iduser;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long iduser;
    private String email;
    private String name;
    private String lastname;
    private String password ;
    @Enumerated(EnumType.STRING)
    private Civility civility;
    private Date dnaiss;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    private String cin;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Civility getCivility() {
        return civility;
    }

    public void setCivility(Civility civility) {
        this.civility = civility;
    }

    public Date getDnaiss() {
        return dnaiss;
    }

    public void setDnaiss(Date dnaiss) {
        this.dnaiss = dnaiss;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Agency getAgency() {
        return agency;
    }

    public void setAgency(Agency agency) {
        this.agency = agency;
    }

    private String city;
    private String role;

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore

    private List<Claim> claims;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agency_id")
    private Agency agency;
    // Getters and Setters
    public List<Claim> getClaims() {
        return claims;
    }

    public void setClaims(List<Claim> claims) {
        this.claims = claims;
    }


}
