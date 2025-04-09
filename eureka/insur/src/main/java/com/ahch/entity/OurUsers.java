package com.ahch.entity;


import com.ahch.entity.Civility;
import jakarta.persistence.*;


import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "ourusers")

public class OurUsers  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String email;
    private String name;
    private String lastname;
    private String password ;
    @Enumerated(EnumType.STRING)
    private Civility civility;
    private Date dnaiss;
    private String cin;

    private String city;
    private String role;

/*
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Claim> claims;

    // Getters and Setters
    public List<Claim> getClaims() {
        return claims;
    }

    public void setClaims(List<Claim> claims) {
        this.claims = claims;
    }
*/
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
