package com.meditrack.routine;

import com.meditrack.enums.MedicineType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRoutineMedicineDTO {

    private String medicineName;

    private MedicineType medicineType;

    private String dosage;

    private String notes;
}