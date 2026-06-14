package com.meditrack.user;

import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserProfileDTO toProfileDTO(User user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .timezone(user.getTimezone())
                .emailVerified(user.getEmailVerified())
                .accountStatus(user.getAccountStatus().name())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    public MedicalProfileDTO toMedicalProfileDTO(UserMedicalProfile profile) {
        return MedicalProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .bloodGroup(profile.getBloodGroup())
                .heightCm(profile.getHeightCm())
                .weightKg(profile.getWeightKg())
                .allergies(profile.getAllergies())
                .chronicConditions(profile.getChronicConditions())
                .medicalNotes(profile.getMedicalNotes())
                .emergencyContactName(profile.getEmergencyContactName())
                .emergencyContactMobile(profile.getEmergencyContactMobile())
                .build();
    }

    public void updateMedicalProfile(UserMedicalProfile profile, MedicalProfileDTO dto) {
        profile.setDateOfBirth(dto.getDateOfBirth());
        profile.setGender(dto.getGender());
        profile.setBloodGroup(dto.getBloodGroup());
        profile.setHeightCm(dto.getHeightCm());
        profile.setWeightKg(dto.getWeightKg());
        profile.setAllergies(dto.getAllergies());
        profile.setChronicConditions(dto.getChronicConditions());
        profile.setMedicalNotes(dto.getMedicalNotes());
        profile.setEmergencyContactName(dto.getEmergencyContactName());
        profile.setEmergencyContactMobile(dto.getEmergencyContactMobile());
    }
}