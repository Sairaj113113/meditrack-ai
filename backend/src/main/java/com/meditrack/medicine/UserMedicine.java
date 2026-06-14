// placeholder 
package com.meditrack.medicine;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.FrequencyType;
import com.meditrack.enums.IntakeInstruction;
import com.meditrack.enums.MedicineCategory;
import com.meditrack.enums.MedicineStatus;
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

    @Column(nullable = false, length = 36)
    private String medicineId;

    @Column(nullable = false)
    private String dosage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicineCategory medicineCategory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IntakeInstruction intakeInstruction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FrequencyType frequencyType;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @Column(length = 1000)
    private String notes;

    private String prescribedBy;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicineStatus status = MedicineStatus.ACTIVE;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isPaused = false;

    private LocalDate pausedAt;
}