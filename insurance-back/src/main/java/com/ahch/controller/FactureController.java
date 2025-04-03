package com.ahch.controller;

import com.ahch.entity.Facture;
import com.ahch.service.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Optional;

import java.util.List;


@RestController
@RequestMapping("/factures")
public class FactureController {

    @Autowired
    private FactureService factureService;


    @GetMapping
    public List<Facture> getAllFactures() {
        return factureService.getAllFactures();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Facture> getFactureById(@PathVariable("id") Long id) {
        Optional<Facture> facture = factureService.getFactureById(id);

        if (facture.isPresent()) {
            return new ResponseEntity<>(facture.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<InputStreamResource> generateFacturePdf(@PathVariable("id") Long id) throws IOException {
        Optional<Facture> factureOpt = factureService.getFactureById(id);

        if (factureOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Facture facture = factureOpt.get();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        document.add(new Paragraph("Facture N°: " + facture.getNumFacture()));
        document.add(new Paragraph("Montant: " + facture.getMontant() + " €"));
        document.add(new Paragraph("Date d'émission: " + facture.getDateEmission()));


        document.close();

        ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=facture-" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
}
