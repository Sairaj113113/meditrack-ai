package com.meditrack.routine;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutineDetailsDTO {

    private String routineId;
    private String routineName;
    private String routineTime;
    private String userDiseaseId;
    private Integer repeatCount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reminderTone;
    private List<RoutineMedicineDTO> medicines;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoutineMedicineDTO {
        private String medicineId;
        private String medicineName;
        private String dosage;
    }
}