package com.meditrack.medicine;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(length = 36)
    private String userDiseaseId;

    @Column(nullable = false)
    private String medicineName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicineCategory medicineCategory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicineType medicineType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FrequencyType frequencyType;

    @Enumerated(EnumType.STRING)
    private IntakeInstruction intakeInstruction;

    @Column(nullable = false)
    private java.time.LocalDate startDate;

    private java.time.LocalDate endDate;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicineStatus status = MedicineStatus.ACTIVE;

    private String notes;
}