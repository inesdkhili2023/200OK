package com.ahch.controller;

import com.ahch.entity.Contrat;
import com.ahch.service.ContratService;
import com.ahch.service.QrCodeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.InputStreamResource;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;



import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;



@RestController
@RequestMapping("/api/contrats")
public class ContratController {

    @Autowired
    private ContratService contratService;
    @Autowired
    private QrCodeService qrCodeService;

    @Value("${app.base-url}")
    private String baseUrl;

    @GetMapping
    public ResponseEntity<List<Contrat>> getAllContrats() {
        List<Contrat> contrats = contratService.getAllContrats();
        return ResponseEntity.ok(contrats);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Contrat> getContratById(@PathVariable("id") Long id) {
        Optional<Contrat> contratOpt = contratService.getContratById(id);

        if (contratOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(contratOpt.get());
    }

    // Générer le PDF du contrat
    @GetMapping("/{id}/pdf")
    public ResponseEntity<InputStreamResource> generateContratPdf(@PathVariable("id") Long id) throws IOException {
        Optional<Contrat> contratOpt = contratService.getContratById(id);

        if (contratOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Contrat contrat = contratOpt.get();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc); // iText 7 uses layout.Document

        document.add(new Paragraph("Contrat N°: " + contrat.getNumContrat()));
        document.add(new Paragraph("Date de création: " + contrat.getDateCreation()));

        if (contrat.getDevis() != null) {
            document.add(new Paragraph("Devis ID: " + contrat.getDevis().getId()));
           // document.add(new Paragraph("Devis Details: " + contrat.getDevis().getDetails())); // Assuming Devis has a getDetails() method
        }

        document.close();

        ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=contrat-" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }



}
