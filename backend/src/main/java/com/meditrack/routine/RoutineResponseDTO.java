package com.meditrack.routine;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutineResponseDTO {

    private String routineId;
    private String routineName;
    private String routineTime;
    private String message;
}