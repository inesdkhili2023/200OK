package com.ahch.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/qr")
public class QRCodeController {

    @GetMapping("/generate")
    public ResponseEntity<byte[]> generateQRCode(@RequestParam(required = false) String policy) throws WriterException, IOException {
        // Build the URL to your towing request page. You can pass additional parameters (e.g., policy number).
        String url = "http://yourdomain.com/towing-request"; // Change to your deployed URL or localhost for testing.
        if (policy != null && !policy.isEmpty()) {
            url += "?policy=" + policy;
        }

        int width = 250;
        int height = 250;
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(pngData, headers, HttpStatus.OK);
    }
}
