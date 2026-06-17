package com.meditrack.caregiver;

import com.meditrack.enums.CaregiverStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaregiverService {

    private final CaregiverRepository caregiverRepository;
    private final CaregiverMapper caregiverMapper;

    public List<CaregiverDTO> getCaregivers(String userId) {
        return caregiverRepository.findByUserIdAndIsDeletedFalse(userId)
                .stream()
                .map(caregiverMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CaregiverDTO addCaregiver(String userId, CaregiverDTO dto) {
        Caregiver caregiver = Caregiver.builder()
                .userId(userId)
                .caregiverName(dto.getCaregiverName())
                .caregiverEmail(dto.getCaregiverEmail())
                .caregiverMobile(dto.getCaregiverMobile())
                .relationType(dto.getRelationType())
                .permission(dto.getPermission() != null ? dto.getPermission() : null)
                .isPrimary(dto.getIsPrimary() != null ? dto.getIsPrimary() : false)
                .build();

        caregiverRepository.save(caregiver);
        return caregiverMapper.toDTO(caregiver);
    }

    public void removeCaregiver(String userId, String caregiverId) {
        Caregiver caregiver = caregiverRepository
                .findByIdAndUserIdAndIsDeletedFalse(caregiverId, userId)
                .orElseThrow(() -> new RuntimeException("Caregiver not found"));
        caregiver.setIsDeleted(true);
        caregiverRepository.save(caregiver);
    }

    public CaregiverDTO inviteCaregiver(String userId, CaregiverDTO dto) {
        Caregiver caregiver = Caregiver.builder()
                .userId(userId)
                .caregiverName(dto.getCaregiverName())
                .caregiverEmail(dto.getCaregiverEmail())
                .caregiverMobile(dto.getCaregiverMobile())
                .relationType(dto.getRelationType())
                .status(CaregiverStatus.PENDING)
                .build();

        caregiverRepository.save(caregiver);
        // TODO: send invite email/notification
        return caregiverMapper.toDTO(caregiver);
    }

    public void acceptInvite(String caregiverId) {
        Caregiver caregiver = caregiverRepository.findById(caregiverId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));
        caregiver.setStatus(CaregiverStatus.ACCEPTED);
        caregiverRepository.save(caregiver);
    }

    public void rejectInvite(String caregiverId) {
        Caregiver caregiver = caregiverRepository.findById(caregiverId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));
        caregiver.setStatus(CaregiverStatus.REJECTED);
        caregiverRepository.save(caregiver);
    }
}