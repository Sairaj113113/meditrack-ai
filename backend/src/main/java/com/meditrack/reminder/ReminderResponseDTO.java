package com.meditrack.reminder;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderResponseDTO {
    private String sessionId;
    private String sessionTime;
    private String status;
    private int medicineCount;
    private List<MedicineItem> medicines;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicineItem {
        private String userMedicineId;
        private String medicineName;
        private String status;
    }
}