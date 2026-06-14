package com.meditrack.ocr;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class OcrConfirmDTO {

    @NotEmpty(message = "At least one medicine is required")
    private List<ConfirmedMedicine> medicines;

    @Data
    public static class ConfirmedMedicine {
        private String medicineName;
        private String dosage;
        private String frequency;
        private String instructions;
    }
}