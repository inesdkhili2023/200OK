package com.ahch.config;

import com.ahch.Repo.TypeAssuranceRepository;
import com.ahch.entity.TypeAssurance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component

    public class DataLoader implements CommandLineRunner {

        @Autowired
        private TypeAssuranceRepository typeAssuranceRepository;

        @Override
        public void run(String... args) throws Exception {
            if (typeAssuranceRepository.count() == 0) { // Vérifie si la table est vide
                TypeAssurance auto = new TypeAssurance();
                auto.setNom("Auto");
                auto.setIconUrl("assets/icons/auto.png");
                auto.setChampsDynamiques(Arrays.asList("Marque", "Modèle", "Année"));

                TypeAssurance sante = new TypeAssurance();
                sante.setNom("Santé");
                sante.setIconUrl("assets/icons/sante.png");
                sante.setChampsDynamiques(Arrays.asList("Numéro Sécurité Sociale", "Antécédents Médicaux"));

                typeAssuranceRepository.saveAll(Arrays.asList(auto, sante));

                System.out.println("✅ Données initiales insérées avec succès !");
            } else {
                System.out.println("🔄 Les types d'assurance existent déjà en base.");
            }
        }
    }


