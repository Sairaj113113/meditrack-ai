package com.meditrack.disease;

import com.meditrack.user.User;
import com.meditrack.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiseaseService {

    private final UserDiseaseRepository diseaseRepository;
    private final UserRepository userRepository;
    private final DiseaseMapper diseaseMapper;

    public DiseaseDTO createDisease(String userId, DiseaseDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDisease disease = UserDisease.builder()
                .user(user)
                .diseaseName(dto.getDiseaseName())
                .diagnosisDate(dto.getDiagnosisDate())
                .severity(dto.getSeverity())
                .status(dto.getStatus())
                .notes(dto.getNotes())
                .doctorRecommendations(dto.getDoctorRecommendations())
                .build();

        return diseaseMapper.toDTO(
                diseaseRepository.save(disease)
        );
    }

    public List<DiseaseDTO> getAllDiseases(String userId) {

        return diseaseRepository
                .findByUserIdAndIsDeletedFalse(userId)
                .stream()
                .map(diseaseMapper::toDTO)
                .collect(Collectors.toList());
    }

    public DiseaseDTO getDiseaseById(String diseaseId) {

        UserDisease disease = diseaseRepository.findById(diseaseId)
                .orElseThrow(() -> new RuntimeException("Disease not found"));

        return diseaseMapper.toDTO(disease);
    }

    public void deleteDisease(String diseaseId) {

        UserDisease disease = diseaseRepository.findById(diseaseId)
                .orElseThrow(() -> new RuntimeException("Disease not found"));

        disease.setIsDeleted(true);

        diseaseRepository.save(disease);
    }

    // NEW METHOD FOR QUICK MEDICINE
    public DiseaseDTO createQuickDisease(
            String userId,
            String diseaseName
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDisease disease = UserDisease.builder()
                .user(user)
                .diseaseName(diseaseName)
                .build();

        return diseaseMapper.toDTO(
                diseaseRepository.save(disease)
        );
    }
}