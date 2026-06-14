package com.meditrack.tracking;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.IntakeAction;
import com.meditrack.enums.MarkedBy;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "medicine_intake_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineIntakeLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(nullable = false, length = 36)
    private String userMedicineId;

    @Column(nullable = false)
    private LocalDate intakeDate;

    private LocalTime scheduledTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IntakeAction action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MarkedBy markedBy;

    private LocalDateTime actionTime;
}