package com.example.demo;


import com.example.demo.entities.TFIDFSimilarity;
import com.example.demo.entities.TextUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.IOException;
import java.util.Map;
@SpringBootApplication
@EnableDiscoveryClient
@Configuration
@EnableScheduling
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
//		computeAndPrintSimilarity();
	}
	private static void computeAndPrintSimilarity() {
		try {
			// Instanciation correcte
			TFIDFSimilarity tfidfSimilarity = new TFIDFSimilarity();

			// Calculer les vecteurs TF-IDF
			Map<String, Float> tfidfDoc1 = tfidfSimilarity.computeTFIDF(0);
			Map<String, Float> tfidfDoc2 = tfidfSimilarity.computeTFIDF(1);

			// Vérifier que les documents ne sont pas vides
			if (tfidfDoc1 == null || tfidfDoc2 == null || tfidfDoc1.isEmpty() || tfidfDoc2.isEmpty()) {
				System.out.println("Erreur : Impossible de calculer la similarité, un des documents est vide.");
			} else {
				// Calculer et afficher la similarité cosinus
				double similarity = TextUtils.cosineSimilarity(tfidfDoc1, tfidfDoc2);
				System.out.println("Similarité cosinus entre le doc 1 et le doc 2 : " + similarity);
			}
		} catch (IOException e) {
			System.err.println("Erreur lors du calcul de TF-IDF : " + e.getMessage());
		}


	}

}
