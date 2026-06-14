package com.meditrack.report;

import org.springframework.stereotype.Service;

@Service
public class PdfGeneratorService {

    public byte[] generateAdherenceReportPdf(String userId, WeeklyReportDTO report) {
        // TODO: Implement using a PDF library (e.g., iText, OpenPDF)
        // pom.xml dependency needed: com.itextpdf:itext7-core or org.openpdf:openpdf
        return new byte[0];
    }
}