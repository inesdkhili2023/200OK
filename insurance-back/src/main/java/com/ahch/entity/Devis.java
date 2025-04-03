package com.ahch.entity;

import com.ahch.JsonConverter;
import jakarta.persistence.*;

import java.util.HashMap;
import java.util.Map;

@Entity
public class Devis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "type_assurance_id", nullable = false)
    private TypeAssurance typeAssurance;

    @ElementCollection
    @CollectionTable(name = "devis_details", joinColumns = @JoinColumn(name = "devis_id"))
    @MapKeyColumn(name = "champ")
    @Column(name = "valeur")
    private Map<String, String> details = new HashMap<>();
    private boolean valide;

    public Devis() {}

    public void setTypeAssurance(TypeAssurance type) {
        this.typeAssurance = type;
    }



    public void setValide(boolean valide) {
        this.valide = valide;
    }

    public Long getId() {
        return id;
    }

    public TypeAssurance getTypeAssurance() {
        return typeAssurance;
    }



    public boolean isValide() {
        return valide;
    }

    public Map<String, String> getDetails() {
        return details;
    }

    public void setDetails(Map<String, String> details) {
        this.details = details;

    }}
