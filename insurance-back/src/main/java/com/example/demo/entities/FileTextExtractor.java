package com.example.demo.entities;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.xml.sax.SAXException;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

public class FileTextExtractor {
    private static final Tika tika = new Tika();

    public static String extractText(String filePath) throws IOException, TikaException, SAXException {
        File file = new File(filePath);

        if (!file.exists() || !file.canRead()) {
            throw new IOException("Le fichier est introuvable ou illisible : " + filePath);
        }

        try (InputStream stream = new FileInputStream(file)) {
            return tika.parseToString(stream);
        }
    }

}

