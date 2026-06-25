package com.meditrack.routine;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiseaseRoutineDTO {

    private String diseaseId;

    private String diseaseName;

    private Integer routineCount;
}