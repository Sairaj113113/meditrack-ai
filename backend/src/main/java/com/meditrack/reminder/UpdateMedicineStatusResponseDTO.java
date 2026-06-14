package com.meditrack.reminder;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMedicineStatusResponseDTO {

    private String message;

    private String sessionId;

    private String medicineId;

    private String status;
}