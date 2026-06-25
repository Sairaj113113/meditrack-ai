package com.meditrack.routine;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineByDiseaseDTO {

    private String routineId;

    private String routineName;

    private LocalTime routineTime;

    private Integer medicineCount;
}