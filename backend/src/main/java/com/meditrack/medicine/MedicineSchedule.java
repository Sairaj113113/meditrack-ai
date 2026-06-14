package com.meditrack.medicine;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "medicine_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineSchedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userMedicineId;

    @Column(nullable = false)
    private LocalTime scheduleTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleType scheduleType;

    @Enumerated(EnumType.STRING)
    private DayOfWeekType dayOfWeek;

    private Integer intervalHours;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;
}