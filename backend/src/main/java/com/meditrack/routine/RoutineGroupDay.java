package com.meditrack.routine;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.DayOfWeekType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "routine_group_days")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineGroupDay extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(name = "routine_group_id", nullable = false, length = 36)
    private String routineGroupId;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeekType dayOfWeek;
}