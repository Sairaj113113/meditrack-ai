package com.meditrack.user;

import com.meditrack.enums.Gender;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalProfileDTO {

    private String id;
    private String userId;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String bloodGroup;
    private Double heightCm;
    private Double weightKg;
    private String allergies;
    private String chronicConditions;
    private String medicalNotes;
    private String emergencyContactName;
    private String emergencyContactMobile;
}