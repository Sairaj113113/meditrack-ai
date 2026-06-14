package com.meditrack.routine;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateRoutineDTO {

    @NotBlank(message = "Routine name is required")
    private String routineName;

    private String userDiseaseId;

    @NotNull(message = "Routine time is required")
    private LocalTime routineTime;

    private Integer repeatCount;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private String reminderTone;
}