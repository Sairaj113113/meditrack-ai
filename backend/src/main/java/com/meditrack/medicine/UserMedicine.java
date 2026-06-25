package com.meditrack.medicine;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMedicine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(length = 36)
    private String userDiseaseId;

    @Column(length = 36)
    private String routineGroupId;

    // Legacy reference
    @Column(length = 36)
    private String medicineId;

    @Column(nullable = false)
    private String medicineName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicineType medicineType;

    private String dosage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicineCategory medicineCategory;

    @Enumerated(EnumType.STRING)
    private IntakeInstruction intakeInstruction;

    @Enumerated(EnumType.STRING)
    private FrequencyType frequencyType;

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(length = 1000)
    private String notes;

    private String prescribedBy;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private MedicineStatus status = MedicineStatus.ACTIVE;

    @Builder.Default
    private Boolean isPaused = false;

    private LocalDate pausedAt;
}