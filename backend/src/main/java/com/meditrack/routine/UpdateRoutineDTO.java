package com.meditrack.routine;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class UpdateRoutineDTO {

    private String routineName;
    private LocalTime routineTime;
    private Integer repeatCount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reminderTone;
}