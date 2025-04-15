package com.ahch.controller;

import com.ahch.entity.Facture;
import com.ahch.service.FactureService;
import com.ahch.service.QrCodeService;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
@RequestMapping("/factures")
public class FactureController {

    @Autowired
    private FactureService factureService;
    @Autowired
    private QrCodeService qrCodeService;

    //@Value("${app.company.logo.url}")
   // private String companyLogoUrl;

    @Value("${app.company.name}")
    private String companyName;

    @Value("${app.company.address}")
    private String companyAddress;

    @Value("${app.company.phone}")
    private String companyPhone;

    @Value("${app.company.email}")
    private String companyEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @GetMapping
    public List<Facture> getAllFactures() {
        return factureService.getAllFactures();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> getFactureById(@PathVariable("id") Long id) {
        Optional<Facture> facture = factureService.getFactureById(id);
        return facture.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<InputStreamResource> generateFacturePdf(@PathVariable("id") Long id) throws IOException {
        Optional<Facture> factureOpt = factureService.getFactureById(id);
        if (factureOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Facture facture = factureOpt.get();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            document.setMargins(50, 36, 36, 36);

            addCompanyHeader(document);
            addInvoiceTitle(document, facture);
            addQrCodeToContract(document, facture);

            // Footer
            Paragraph footer = new Paragraph("Merci pour votre confiance.")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10)
                    .setFontColor(ColorConstants.WHITE)
                    .setBackgroundColor(ColorConstants.DARK_GRAY)
                    .setPadding(10)
                    .setMarginTop(30);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            throw new IOException("Error generating PDF", e);
        }

        ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=facture-" + facture.getNumFacture() + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }

    private void addCompanyHeader(Document document) throws IOException {
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{30, 70}))
                .setWidth(UnitValue.createPercentValue(100));

        try {
            // Chargement de l'image locale
            String imagePath = "C:\\Users\\NOUSSA\\OneDrive\\Bureau\\pi\\insurance-back\\src\\main\\resources/img.png"; // chemin relatif dans resources
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


    private void addInvoiceTitle(Document document, Facture facture) {
        Paragraph title = new Paragraph("FACTURE")
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setFontSize(22)
                .setFontColor(ColorConstants.BLACK)
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setMarginBottom(30)
                .setPadding(10);
        document.add(title);

        Paragraph invoiceNumber = new Paragraph("N°: " + facture.getNumFacture())
                .setTextAlignment(TextAlignment.RIGHT)
                .setBold()
                .setFontSize(12)
                .setFontColor(ColorConstants.DARK_GRAY)
                .setMarginBottom(15);
        document.add(invoiceNumber);
    }

    private void addQrCodeToContract(Document document, Facture facture) {
        try {
            String contractUrl = baseUrl + "/api/contrats/" + facture.getPaiement().getContrat().getId() + "/pdf";
            BufferedImage qrImage = qrCodeService.generateQRCodeImage(contractUrl, 200, 200);
            ImageData imageData = ImageDataFactory.create(qrImage, null);

            Image qrCode = new Image(imageData)
                    .setWidth(120)
                    .setHeight(120)
                    .setHorizontalAlignment(HorizontalAlignment.CENTER)
                    .setMarginTop(10)
                    .setMarginBottom(10);

            Paragraph qrDescription = new Paragraph()
                    .add(new Text("Scannez pour voir le contrat\n")
                            .setFontSize(11)
                            .setBold())
                    .add(new Text("Contrat N°: " + facture.getPaiement().getContrat().getNumContrat())
                            .setFontSize(10))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(5);

            Div qrDiv = new Div()
                    .add(qrCode)
                    .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 1))
                    .setPadding(10)
                    .setMarginBottom(15)
                    .setTextAlignment(TextAlignment.CENTER);

            document.add(qrDescription);
            document.add(qrDiv);

        } catch (Exception e) {
            Paragraph errorMsg = new Paragraph("Impossible de générer le QR code")
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setFontColor(ColorConstants.RED)
                    .setFontSize(10);
            document.add(errorMsg);

            Paragraph contractLink = new Paragraph()
                    .add("Contrat associé: ")
                    .add(new Text(baseUrl + "/api/contrats/" + facture.getPaiement().getContrat().getId() + "/pdf")
                            .setUnderline())
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setFontSize(10);
            document.add(contractLink);
        }
    }
}
