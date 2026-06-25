package com.meditrack.routine;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.FrequencyType;
import com.meditrack.enums.RoutineStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "routine_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineGroup extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "user_disease_id", length = 36)
    private String userDiseaseId;

    @Column(name = "routine_name", nullable = false)
    private String routineName;

    @Column(name = "routine_time", nullable = false)
    private LocalTime routineTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "frequency_type", nullable = false)
    private FrequencyType frequencyType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_reminder_enabled", nullable = false)
    private Boolean isReminderEnabled = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoutineStatus status = RoutineStatus.ACTIVE;
}