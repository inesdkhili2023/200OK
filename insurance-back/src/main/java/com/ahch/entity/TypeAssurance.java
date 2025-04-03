package com.ahch.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter




@Entity
public class TypeAssurance {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String nom;
        private String iconUrl;

        @ElementCollection
        @CollectionTable(name = "type_assurance_champs", joinColumns = @JoinColumn(name = "type_assurance_id"))
        @Column(name = "champ")
        private List<String> champsDynamiques;


        public TypeAssurance() {}


        // Getters et Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }

        public String getIconUrl() { return iconUrl; }
        public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }

        public List<String> getChampsDynamiques() { return champsDynamiques; }
        public void setChampsDynamiques(List<String> champsDynamiques) { this.champsDynamiques = champsDynamiques; }
}
