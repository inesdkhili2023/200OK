package com.ahch.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;

import com.ahch.entity.Towing;
import com.ahch.service.TowingService;
import org.springframework.beans.factory.annotation.Autowired;
import com.ahch.entity.AgentTowing;
import com.ahch.entity.User;

@RestController
@RequestMapping("/qr")
@CrossOrigin(origins = "*")
public class QRCodeController {

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Autowired
    private TowingService towingService;

    @GetMapping("/generate")
    public ResponseEntity<byte[]> generateQRCode(@RequestParam(required = false) String policy) throws WriterException, IOException {
        System.out.println("QR Code generation request received with policy: " + policy);

        try {
            // Build the URL to your Angular application's emergency-towing route
            String url = frontendUrl + "/emergency-towing";
            System.out.println("Generating QR code for URL: " + url);

            int width = 250;
            int height = 250;
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();
            System.out.println("QR code generated successfully, size: " + pngData.length + " bytes");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(pngData, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            // Log the error
            System.err.println("Error generating QR code: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/emergency-towing")
    public ResponseEntity<?> createEmergencyTowing(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude) {

        try {
            Towing towing = new Towing();
            towing.setStatus("Pending");  // Match existing status values from the table
            towing.setLocation(location != null ? location : "Location pending");

            // Use current timestamp for the request date
            LocalDateTime now = LocalDateTime.now();
            towing.setRequestDate(now);

            // Set latitude/longitude if available
            towing.setLatitude(latitude != null ? latitude : 0.0);
            towing.setLongitude(longitude != null ? longitude : 0.0);

            // Set default agent and user IDs based on your database structure
            // These should match existing IDs in your database
            AgentTowing agent = new AgentTowing();
            agent.setIdAgent(1);
            towing.setAgent(agent);

            User user = new User();
            user.setIdUser(1);
            towing.setUser(user);

            Towing savedTowing = towingService.save(towing);

            return ResponseEntity.ok(savedTowing);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Failed to create emergency towing request: " + e.getMessage());
        }
    }
}
