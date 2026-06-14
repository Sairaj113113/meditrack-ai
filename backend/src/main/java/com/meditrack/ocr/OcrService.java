package com.meditrack.ocr;

import com.meditrack.enums.OcrStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OcrService {

    private final OcrPrescriptionRepository ocrRepository;
    private final OcrMapper ocrMapper;
    private final FastApiClientService fastApiClientService;

    public OcrResponseDTO uploadPrescription(String userId, MultipartFile file) {
        // TODO V2: Upload file to Cloudinary, get imageUrl
        String imageUrl = "TODO: upload to cloudinary";

        OcrPrescription prescription = OcrPrescription.builder()
                .userId(userId)
                .imageUrl(imageUrl)
                .status(OcrStatus.PENDING)
                .build();

        ocrRepository.save(prescription);

        // TODO V2: trigger async OCR processing
        return ocrMapper.toDTO(prescription);
    }

    public List<OcrResponseDTO> getHistory(String userId) {
        return ocrRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(ocrMapper::toDTO)
                .collect(Collectors.toList());
    }

    public OcrResponseDTO getById(String userId, String id) {
        OcrPrescription prescription = ocrRepository
                .findByIdAndUserIdAndIsDeletedFalse(id, userId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        return ocrMapper.toDTO(prescription);
    }

    public void confirmPrescription(String userId, String id, OcrConfirmDTO dto) {
        OcrPrescription prescription = ocrRepository
                .findByIdAndUserIdAndIsDeletedFalse(id, userId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        prescription.setStatus(OcrStatus.COMPLETED);
        ocrRepository.save(prescription);

        // TODO V2: create Medicine entries from dto.getMedicines()
    }
}