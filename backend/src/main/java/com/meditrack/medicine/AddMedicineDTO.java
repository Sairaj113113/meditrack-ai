package com.meditrack.medicine;

import com.meditrack.enums.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class AddMedicineDTO {

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    // NEW - Optional disease name entered by user
    private String diseaseName;

    // Will be set automatically by backend
    private String userDiseaseId;

    @NotNull(message = "Category is required")
    private MedicineCategory medicineCategory;

    @NotNull(message = "Medicine type is required")
    private MedicineType medicineType;

    @NotNull(message = "Frequency type is required")
    private FrequencyType frequencyType;

    private IntakeInstruction intakeInstruction;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private String notes;

    @NotEmpty(message = "At least one schedule is required")
    private List<ScheduleDTO> schedules;

    @Data
    public static class ScheduleDTO {

        @NotNull
        private LocalTime scheduleTime;

        @NotNull
        private ScheduleType scheduleType;

        private DayOfWeekType dayOfWeek;

        private Integer intervalHours;
    }
}