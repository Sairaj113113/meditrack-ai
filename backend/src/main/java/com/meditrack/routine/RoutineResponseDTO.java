package com.meditrack.routine;

import com.meditrack.enums.FrequencyType;
import com.meditrack.enums.RoutineStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineResponseDTO {

    private String id;

    private String routineName;

    private String userDiseaseId;

    private LocalTime routineTime;

    private FrequencyType frequencyType;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isReminderEnabled;

    private RoutineStatus status;

    private Integer medicineCount;

    private String diseaseName;
}