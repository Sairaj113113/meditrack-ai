package com.meditrack.disease;

import com.meditrack.enums.DiseaseSeverity;
import com.meditrack.enums.DiseaseStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiseaseDTO {

    private String id;

    private String diseaseName;

    private LocalDate diagnosisDate;

    private DiseaseSeverity severity;

    private DiseaseStatus status;

    private String notes;

    private String doctorRecommendations;
}