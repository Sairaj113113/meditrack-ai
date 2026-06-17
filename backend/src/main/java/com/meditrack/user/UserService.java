package com.meditrack.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMedicalProfileRepository medicalProfileRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserProfileDTO getProfile(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return userMapper.toProfileDTO(user);
    }

    public UserProfileDTO updateProfile(
            String userId,
            UserProfileDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setMobile(dto.getMobile());
        user.setTimezone(dto.getTimezone());

        userRepository.save(user);

        return userMapper.toProfileDTO(user);
    }

    public MedicalProfileDTO getMedicalProfile(
            String userId) {

        UserMedicalProfile profile =
                medicalProfileRepository
                        .findByUserId(userId)
                        .orElseGet(() -> {

                            UserMedicalProfile newProfile =
                                    UserMedicalProfile.builder()
                                            .userId(userId)
                                            .build();

                            return medicalProfileRepository
                                    .save(newProfile);
                        });

        return userMapper.toMedicalProfileDTO(profile);
    }

    public MedicalProfileDTO updateMedicalProfile(
            String userId,
            MedicalProfileDTO dto) {

        UserMedicalProfile profile =
                medicalProfileRepository
                        .findByUserId(userId)
                        .orElseGet(() ->
                                UserMedicalProfile.builder()
                                        .userId(userId)
                                        .build());

        userMapper.updateMedicalProfile(
                profile,
                dto
        );

        medicalProfileRepository.save(profile);

        return userMapper.toMedicalProfileDTO(profile);
    }

    public void changePassword(
            String userId,
            String currentPassword,
            String newPassword) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                currentPassword,
                user.getPasswordHash())) {

            throw new RuntimeException(
                    "Current password is incorrect");
        }

        user.setPasswordHash(
                passwordEncoder.encode(
                        newPassword
                )
        );

        userRepository.save(user);
    }
}