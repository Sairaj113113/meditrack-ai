package com.meditrack.routine;

import com.meditrack.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "medicine_routines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineRoutine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(length = 36)
    private String userDiseaseId;

    @Column(nullable = false)
    private String routineName;

    @Column(nullable = false)
    private LocalTime routineTime;

    @Builder.Default
    @Column(nullable = false)
    private Integer repeatCount = 1;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    private String reminderTone;
}