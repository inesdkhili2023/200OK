package com.phegondev.usersmanagementsystem.service;

import com.google.gson.Gson;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import com.phegondev.usersmanagementsystem.repository.UsersRepo;
import org.bytedeco.javacpp.indexer.FloatIndexer;
import org.bytedeco.opencv.global.opencv_core;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.global.opencv_objdetect;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.net.URL;
import java.util.Base64;
import java.util.List;

@Service
public class FaceRecognitionService {


    // Path to Haar Cascade XML file (place the file at src/main/resources/data/)
    private static final String HAAR_CASCADE_FILE = "src/main/resources/haarcascade_frontalface_alt.xml";
    // Fixed size for face images (must be same during registration and login)
    private static final Size FACE_SIZE = new Size(50, 50);
    // Distance threshold for a match (tune this value based on your data)
    private static final double THRESHOLD = 2000.0;

    @Autowired
    private UsersRepo userRepository;

    private Gson gson = new Gson();

    /**
     * Compute a simple face embedding from a Base64 image.
     * The process: decode, detect the face, convert to grayscale, resize, flatten.
     */
    public float[] computeEmbedding(String imagePath) throws Exception {
        // 1. Charger Haarcascade depuis les ressources
        URL cascadeUrl = getClass().getClassLoader().getResource("haarcascade_frontalface_alt.xml");
        if (cascadeUrl == null) {
            throw new RuntimeException("Fichier Haarcascade introuvable dans resources");
        }

        String cascadePath = new File(cascadeUrl.toURI()).getAbsolutePath();
        CascadeClassifier faceDetector = new CascadeClassifier(cascadePath);
        if (faceDetector.empty()) {
            throw new Exception("Échec du chargement du fichier Haarcascade");
        }

        // 2. Lire l’image uploadée
        Mat image = opencv_imgcodecs.imread(imagePath);
        if (image.empty()) {
            throw new Exception("Impossible de lire l'image: " + imagePath);
        }

        // 3. Détection visage
        Mat gray = new Mat();
        opencv_imgproc.cvtColor(image, gray, opencv_imgproc.COLOR_BGR2GRAY);

        RectVector faces = new RectVector();
        faceDetector.detectMultiScale(gray, faces);

        if (faces.size() == 0) {
            throw new Exception("Aucun visage détecté");
        }

        // 4. Extraction et traitement du visage
        Rect faceRect = faces.get(0);
        Mat faceROI = new Mat(gray, faceRect);
        Mat resizedFace = new Mat();
        opencv_imgproc.resize(faceROI, resizedFace, FACE_SIZE);
        resizedFace.convertTo(resizedFace, opencv_core.CV_32F);

        // 5. Conversion en embedding
        int rows = resizedFace.rows(), cols = resizedFace.cols();
        float[] embedding = new float[rows * cols];
        FloatIndexer indexer = resizedFace.createIndexer();
        for (int y = 0; y < rows; y++) {
            for (int x = 0; x < cols; x++) {
                embedding[y * cols + x] = indexer.get(y, x);
            }
        }
        indexer.release();
        return embedding;
    }

    public float[] computeEmbeddingFromBase64(String base64ImageData) throws Exception {
        if (base64ImageData == null || !base64ImageData.contains("base64,")) {
            throw new IllegalArgumentException("Image base64 invalide");
        }

        // 1. Decode base64 image
        String base64Image = base64ImageData.split(",")[1];
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
        BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(imageBytes));
        Mat matImage = bufferedImageToMat(bufferedImage);

        // 2. Convert to grayscale
        Mat gray = new Mat();
        opencv_imgproc.cvtColor(matImage, gray, opencv_imgproc.COLOR_BGR2GRAY);

        // 3. Load Haarcascade and detect face
        CascadeClassifier faceDetector = new CascadeClassifier(HAAR_CASCADE_FILE);
        if (faceDetector.empty()) {
            throw new Exception("Erreur de chargement HaarCascade");
        }

        RectVector faces = new RectVector();
        faceDetector.detectMultiScale(gray, faces);
        if (faces.size() == 0) {
            throw new Exception("Aucun visage détecté");
        }

        Rect faceRect = faces.get(0);
        Mat faceROI = new Mat(gray, faceRect);
        Mat resizedFace = new Mat();
        opencv_imgproc.resize(faceROI, resizedFace, FACE_SIZE);
        resizedFace.convertTo(resizedFace, opencv_core.CV_32F);

        int rows = resizedFace.rows(), cols = resizedFace.cols();
        float[] embedding = new float[rows * cols];
        FloatIndexer indexer = resizedFace.createIndexer();
        for (int y = 0; y < rows; y++) {
            for (int x = 0; x < cols; x++) {
                embedding[y * cols + x] = indexer.get(y, x);
            }
        }
        indexer.release();
        return embedding;
    }
    /**
     * Compute Euclidean distance between two embeddings.
     */
    public double euclideanDistance(float[] emb1, float[] emb2) {
        if (emb1.length != emb2.length) {
            throw new IllegalArgumentException("Embedding vectors must be of the same length");
        }
        double sum = 0;
        for (int i = 0; i < emb1.length; i++) {
            double diff = emb1[i] - emb2[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }

    /**
     * Recognize a user by comparing the computed embedding from the live image with stored embeddings.
     * Returns the matched OurUser if the distance is below THRESHOLD; otherwise, returns null.
     */
    public OurUsers recognizeUser(String base64ImageData) throws Exception {
        float[] capturedEmbedding = computeEmbeddingFromBase64(base64ImageData);
        List<OurUsers> users = userRepository.findAll();
        OurUsers bestMatch = null;
        double bestDistance = Double.MAX_VALUE;

        for (OurUsers user : users) {
            String storedEmbeddingJson = user.getFaceEmbedding();
            if (storedEmbeddingJson == null) continue;
            float[] storedEmbedding = gson.fromJson(storedEmbeddingJson, float[].class);
            double distance = euclideanDistance(capturedEmbedding, storedEmbedding);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = user;
            }
        }

        if (bestMatch != null && bestDistance < THRESHOLD) {
            return bestMatch;
        } else {
            return null;
        }
    }

    /**
     * Utility method: convert BufferedImage to Mat.
     */
    private Mat bufferedImageToMat(BufferedImage bi) {
        if (bi.getType() != BufferedImage.TYPE_3BYTE_BGR) {
            BufferedImage convertedImg = new BufferedImage(bi.getWidth(), bi.getHeight(), BufferedImage.TYPE_3BYTE_BGR);
            convertedImg.getGraphics().drawImage(bi, 0, 0, null);
            bi = convertedImg;
        }
        byte[] data = ((java.awt.image.DataBufferByte) bi.getRaster().getDataBuffer()).getData();
        Mat mat = new Mat(bi.getHeight(), bi.getWidth(), opencv_core.CV_8UC3);
        mat.data().put(data);
        return mat;
    }
}
