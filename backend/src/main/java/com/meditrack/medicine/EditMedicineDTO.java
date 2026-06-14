package com.meditrack.medicine;

import com.meditrack.enums.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class EditMedicineDTO {

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    @NotNull(message = "Medicine type is required")
    private MedicineType medicineType;

    @NotNull(message = "Frequency type is required")
    private FrequencyType frequencyType;

    private IntakeInstruction intakeInstruction;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private String notes;
}