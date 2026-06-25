package com.meditrack.routine;

import com.meditrack.enums.DayOfWeekType;
import com.meditrack.enums.FrequencyType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRoutineDTO {

    private String routineName;

    private String userDiseaseId;

    private LocalTime routineTime;

    private FrequencyType frequencyType;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isReminderEnabled;

    private List<DayOfWeekType> days;
}