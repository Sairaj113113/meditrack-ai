package com.meditrack.medicine;

import com.meditrack.enums.DayOfWeekType;
import com.meditrack.enums.ScheduleType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class UpdateScheduleDTO {

    @NotNull(message = "Schedule time is required")
    private LocalTime scheduleTime;

    @NotNull(message = "Schedule type is required")
    private ScheduleType scheduleType;

    private DayOfWeekType dayOfWeek;

    private Integer intervalHours;
}
