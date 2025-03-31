package com.ahch.service;

import com.ahch.entity.AgentTowing;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class AgentTowingPDFExporterService {

    public byte[] exportAgentTowingsToPDF(List<AgentTowing> agents) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        // Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("List of Agent Towings", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        // Create a table with 5 columns: ID, Name, Contact Info, Availability, Vehicle Type
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{1, 3, 3, 2, 2});

        Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

        PdfPCell cell;
        cell = new PdfPCell(new Phrase("ID", headFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase("Name", headFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase("Contact Info", headFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase("Availability", headFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase("Vehicle Type", headFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);

        // Table rows
        for (AgentTowing agent : agents) {
            // ID
            cell = new PdfPCell(new Phrase(String.valueOf(agent.getIdAgent())));
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);

            // Name
            cell = new PdfPCell(new Phrase(agent.getName()));
            cell.setPaddingLeft(5);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            table.addCell(cell);

            // Contact Info
            cell = new PdfPCell(new Phrase(agent.getContactInfo()));
            cell.setPaddingLeft(5);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            table.addCell(cell);

            // Availability
            String availability = agent.getAvailability() ? "Available" : "Busy";
            cell = new PdfPCell(new Phrase(availability));
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);

            // Vehicle Type
            cell = new PdfPCell(new Phrase(agent.getVehicleType()));
            cell.setPaddingLeft(5);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            table.addCell(cell);
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }
}
