package com.ahch.controller;

import com.ahch.entity.Contrat;
import com.ahch.entity.OurUsers;
import com.ahch.service.ContratService;
import com.ahch.service.QrCodeService;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.borders.SolidBorder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contrats")
public class ContratController {

    @Autowired
    private ContratService contratService;
    @Autowired
    private QrCodeService qrCodeService;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.company.name}")
    private String companyName;

    @Value("${app.company.address}")
    private String companyAddress;

    @Value("${app.company.phone}")
    private String companyPhone;

    @Value("${app.company.email}")
    private String companyEmail;
    @GetMapping("/users")
    public List<OurUsers> getUsers(@RequestHeader("Authorization") String token) {
        return contratService.getAllUsers(token);
    }

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
        Document document = new Document(pdfDoc);

        document.setMargins(50, 36, 36, 36);

        // Ajout du header de l'entreprise
        addCompanyHeader(document);

        // Ajouter les informations du contrat
        document.add(new Paragraph("Contrat N°: " + contrat.getNumContrat())
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(18)
                .setFontColor(ColorConstants.BLACK));
        document.add(new Paragraph("Date de création: " + contrat.getDateCreation())
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(12)
                .setFontColor(ColorConstants.GRAY));

        // Si le contrat a un devis, ajouter cette info
        if (contrat.getDevis() != null) {
            document.add(new Paragraph("Devis ID: " + contrat.getDevis().getId())
                    .setTextAlignment(TextAlignment.LEFT)
                    .setFontSize(12)
                    .setFontColor(ColorConstants.BLACK));
        }



        // Ajouter footer
        Paragraph footer = new Paragraph("Merci de votre confiance.")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10)
                .setFontColor(ColorConstants.WHITE)
                .setBackgroundColor(ColorConstants.DARK_GRAY)
                .setPadding(10)
                .setMarginTop(30);
        document.add(footer);

        document.close();

        ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=contrat-" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }

    private void addCompanyHeader(Document document) throws IOException {
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{30, 70}))
                .setWidth(UnitValue.createPercentValue(100));

        // Ajouter le logo de l'entreprise
        try {
            String imagePath = "C:\\path\\to\\your\\logo.png"; // Chemin vers le logo
            URL imageUrl = getClass().getClassLoader().getResource(imagePath);
            if (imageUrl != null) {
                ImageData imageData = ImageDataFactory.create(imageUrl);
                Image logo = new Image(imageData).setWidth(100).setAutoScale(true);
                headerTable.addCell(new Cell().add(logo).setBorder(null));
            } else {
                headerTable.addCell(new Cell().add(new Paragraph("")).setBorder(null));
            }
        } catch (Exception e) {
            headerTable.addCell(new Cell().add(new Paragraph("")).setBorder(null));
        }

        // Ajouter les informations de l'entreprise
        Cell companyInfoCell = new Cell()
                .setBorder(null)
                .setTextAlignment(TextAlignment.RIGHT)
                .add(new Paragraph(companyName).setBold().setFontSize(16).setFontColor(ColorConstants.DARK_GRAY))
                .add(new Paragraph(companyAddress).setFontSize(10).setFontColor(ColorConstants.GRAY))
                .add(new Paragraph("Tél: " + companyPhone).setFontSize(10).setFontColor(ColorConstants.GRAY))
                .add(new Paragraph("Email: " + companyEmail).setFontSize(10).setFontColor(ColorConstants.BLUE));

        headerTable.addCell(companyInfoCell);
        document.add(headerTable);
        document.add(new LineSeparator(new SolidLine()).setMarginTop(10).setMarginBottom(20));
    }


    }

