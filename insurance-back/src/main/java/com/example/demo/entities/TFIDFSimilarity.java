package com.example.demo.entities;
import org.apache.lucene.analysis.en.EnglishAnalyzer;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.apache.lucene.index.*;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.document.*;
import org.apache.lucene.util.BytesRef;
import org.apache.lucene.analysis.TokenStream;
import java.io.IOException;
import java.io.StringReader;
import java.util.*;
public class TFIDFSimilarity {
    private final RAMDirectory index;
    private final EnglishAnalyzer analyzer;

    public TFIDFSimilarity() throws IOException {
        this.index = new RAMDirectory();
        this.analyzer = new EnglishAnalyzer();
    }

    // ✅ Indexe les documents pour le calcul du TF-IDF
    public void indexDocuments(List<String> documents) throws IOException {
        IndexWriterConfig config = new IndexWriterConfig(analyzer);
        IndexWriter writer = new IndexWriter(index, config);

        for (String doc : documents) {
            Document luceneDoc = new Document();
            luceneDoc.add(new TextField("content", doc, Field.Store.YES));
            writer.addDocument(luceneDoc);
        }
        writer.close();
    }

    // ✅ Calcule le score TF-IDF d'un mot dans un document
    public Map<String, Float> computeTFIDF(int docId) throws IOException {
        IndexReader reader = DirectoryReader.open(index);
        Map<String, Float> tfidfMap = new HashMap<>();
        Terms terms = reader.getTermVector(docId, "content");

        if (terms != null) {
            TermsEnum termsEnum = terms.iterator();
            BytesRef term;
            while ((term = termsEnum.next()) != null) {
                String termText = term.utf8ToString();
                float tf = termsEnum.totalTermFreq();
                float idf = (float) Math.log((reader.numDocs() + 1) / (reader.docFreq(new Term("content", termText)) + 1));
                tfidfMap.put(termText, tf * idf);
            }
        }
        reader.close();
        return tfidfMap;
    }

    public static void main(String[] args) throws IOException {
        TFIDFSimilarity tfidfSimilarity = new TFIDFSimilarity();

        // 📄 Ajoute des documents
        List<String> documents = List.of(
                "Le machine learning est utilisé en assurance",
                "L'assurance utilise l'intelligence artificielle",
                "Les modèles de deep learning sont puissants"
        );

        // 🔍 Indexation des documents
        tfidfSimilarity.indexDocuments(documents);

        // 🎯 Calcul du TF-IDF pour le premier document
        Map<String, Float> tfidf = tfidfSimilarity.computeTFIDF(0);
        System.out.println("TF-IDF du premier document: " + tfidf);
    }

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
