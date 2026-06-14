package com.meditrack.adherence;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicationCalendarResponseDto {

    private Integer year;
    private Integer month;
    private List<CalendarDayDto> days;
}