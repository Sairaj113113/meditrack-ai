package com.meditrack.ocr;

import org.springframework.stereotype.Component;

@Component
public class OcrMapper {

    public OcrResponseDTO toDTO(OcrPrescription prescription) {
        return OcrResponseDTO.builder()
                .id(prescription.getId())
                .imageUrl(prescription.getImageUrl())
                .extractedText(prescription.getExtractedText())
                .status(prescription.getStatus())
                .aiSuggestions(prescription.getAiSuggestions())
                .createdAt(prescription.getCreatedAt())
                .build();
    }
}