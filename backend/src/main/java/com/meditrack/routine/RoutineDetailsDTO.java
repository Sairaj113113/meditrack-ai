package com.meditrack.routine;

import com.meditrack.enums.DayOfWeekType;
import com.meditrack.enums.FrequencyType;
import com.meditrack.enums.RoutineStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineDetailsDTO {

    private String id;

    private String routineName;

    private String userDiseaseId;

    private LocalTime routineTime;

    private FrequencyType frequencyType;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isReminderEnabled;

    private RoutineStatus status;

    private List<DayOfWeekType> days;
}