package com.example.demo.entities;


import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class TextUtils {

    public static double cosineSimilarity(Map<String, Float> vector1, Map<String, Float> vector2) {
        Set<String> terms = new HashSet<>(vector1.keySet());
        terms.addAll(vector2.keySet());

        double dotProduct = 0.0, normA = 0.0, normB = 0.0;

        for (String term : terms) {
            double tfidf1 = vector1.getOrDefault(term, 0.0f);
            double tfidf2 = vector2.getOrDefault(term, 0.0f);

            dotProduct += tfidf1 * tfidf2;
            normA += Math.pow(tfidf1, 2);
            normB += Math.pow(tfidf2, 2);
        }

        return normA == 0 || normB == 0 ? 0 : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
