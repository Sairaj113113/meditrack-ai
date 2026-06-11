package com.meditrack.disease;

import org.springframework.stereotype.Component;

@Component
public class DiseaseMapper {

    public DiseaseDTO toDTO(UserDisease disease) {

        return DiseaseDTO.builder()
                .id(disease.getId())
                .diseaseName(disease.getDiseaseName())
                .diagnosisDate(disease.getDiagnosisDate())
                .severity(disease.getSeverity())
                .status(disease.getStatus())
                .notes(disease.getNotes())
                .doctorRecommendations(disease.getDoctorRecommendations())
                .build();
    }
}