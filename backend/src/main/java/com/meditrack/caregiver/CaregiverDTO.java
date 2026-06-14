package com.meditrack.caregiver;

import com.meditrack.enums.CaregiverPermission;
import com.meditrack.enums.CaregiverRelationType;
import com.meditrack.enums.CaregiverStatus;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaregiverDTO {

    private String id;
    private String caregiverName;
    private String caregiverEmail;
    private String caregiverMobile;
    private CaregiverRelationType relationType;
    private CaregiverPermission permission;
    private CaregiverStatus status;
    private Boolean isPrimary;
}