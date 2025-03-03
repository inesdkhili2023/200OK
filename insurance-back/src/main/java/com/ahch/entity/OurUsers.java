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

    // Getters and Setters
    public List<Claim> getClaims() {
        return claims;
    }

    public void setClaims(List<Claim> claims) {
        this.claims = claims;
    }


}
