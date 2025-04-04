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



            // ✅ Ajout de Ecolia avec les champs sous forme de liste
            TypeAssurance ecolia = new TypeAssurance();
            ecolia.setNom("Ecolia");
            ecolia.setIconUrl("assets/icons/ecolia.png");
            ecolia.setChampsDynamiques(Arrays.asList(
                    "typePieceIdentite",
                    "numeroPieceIdentite",
                    "nomPrenom",
                    "numeroTelephone",
                    "email",
                    "nombreEnfants",
            "dateEffet",
            "acceptConditions"
            ));

            // ✅ Ajout de Voyage avec les champs sous forme de liste
            TypeAssurance voyage = new TypeAssurance();
            ecolia.setNom("Voyage");
            ecolia.setIconUrl("assets/icons/voyage.png");
            ecolia.setChampsDynamiques(Arrays.asList(


                    "typeAssuranceId",

                    "cin",
                    "nom",
                    "prenom",
                    "telephone",
                    "email",
                    "conditions",
                    "duree",
                    "dateDebut",
                    "dateRetour",
                    "coverageOption",
                    "nationality",
                    "ageRange",
                    "totalPremium"
            ));
            // ✅ Ajout de Sante avec les champs sous forme de liste
            TypeAssurance sante = new TypeAssurance();
            ecolia.setNom("Sante");
            ecolia.setIconUrl("assets/icons/sante.png");
            ecolia.setChampsDynamiques(Arrays.asList(


                            "nom",
                    "prenom",
                    "email",
            "confirmationEmail",
            "societe",
            "telephone",
            "fonction",
            "dateNaissance",
            "message",
            "conditions"
            ));

            // ✅ Ajout de Accident avec les champs sous forme de liste
            TypeAssurance accident = new TypeAssurance();
            ecolia.setNom("Accident");
            ecolia.setIconUrl("assets/icons/accident.png");
            ecolia.setChampsDynamiques(Arrays.asList(


                    "typeAssuranceId",

                            "profession",
                    "capitalDeces",
                    "capitalIPP",
            "rente",
            "franchise",
            "fraisTraitement",
            "nomPrenom",
            "numeroTelephone",
            "email",
            "acceptConditions"
            ));

            // ✅ Ajout de Capitalisation avec les champs sous forme de liste
            TypeAssurance capitalisation = new TypeAssurance();
            ecolia.setNom("Capitalisation");
            ecolia.setIconUrl("assets/icons/capitalisation.png");
            ecolia.setChampsDynamiques(Arrays.asList(


                    "typeAssuranceId",

                    "dateEffet",
                    "duree",
                    "capitalInitial",
                    "versementRegulier",
                    "frequenceVersement",
                    "primeVariable",
                    "montantAjout",
                    "commentaire"

            ));


            typeAssuranceRepository.saveAll(Arrays.asList(auto,ecolia,voyage,sante,accident));

            System.out.println("✅ Données initiales insérées avec succès !");
        } else {
            System.out.println("🔄 Les types d'assurance existent déjà en base.");
        }
    }
}
