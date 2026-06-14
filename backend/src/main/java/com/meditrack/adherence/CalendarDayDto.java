package com.meditrack.adherence;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarDayDto {

    private LocalDate date;
    private String status; // ALL_TAKEN, PARTIAL, MISSED, NO_DATA
    private Double adherencePercentage;
}