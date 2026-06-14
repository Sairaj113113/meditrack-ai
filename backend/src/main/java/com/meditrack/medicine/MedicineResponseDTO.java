package com.meditrack.medicine;

import com.meditrack.enums.*;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class MedicineResponseDTO {

    private String id;
    private String userId;
    private String userDiseaseId;
    private String medicineName;
    private MedicineCategory medicineCategory;
    private MedicineType medicineType;
    private FrequencyType frequencyType;
    private IntakeInstruction intakeInstruction;
    private LocalDate startDate;
    private LocalDate endDate;
    private MedicineStatus status;
    private String notes;
    private List<ScheduleResponseDTO> schedules;

    @Data
    @Builder
    public static class ScheduleResponseDTO {
        private String id;
        private String scheduleTime;
        private ScheduleType scheduleType;
        private DayOfWeekType dayOfWeek;
        private Integer intervalHours;
        private Boolean isActive;
    }
}