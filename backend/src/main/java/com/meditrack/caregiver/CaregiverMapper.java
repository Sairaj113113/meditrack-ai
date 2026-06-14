package com.meditrack.caregiver;

import org.springframework.stereotype.Component;

@Component
public class CaregiverMapper {

    public CaregiverDTO toDTO(Caregiver caregiver) {
        return CaregiverDTO.builder()
                .id(caregiver.getId())
                .caregiverName(caregiver.getCaregiverName())
                .caregiverEmail(caregiver.getCaregiverEmail())
                .caregiverMobile(caregiver.getCaregiverMobile())
                .relationType(caregiver.getRelationType())
                .permission(caregiver.getPermission())
                .status(caregiver.getStatus())
                .isPrimary(caregiver.getIsPrimary())
                .build();
    }
}