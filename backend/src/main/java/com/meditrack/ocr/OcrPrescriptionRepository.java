package com.meditrack.ocr;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OcrPrescriptionRepository extends JpaRepository<OcrPrescription, String> {

    List<OcrPrescription> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(String userId);

    Optional<OcrPrescription> findByIdAndUserIdAndIsDeletedFalse(String id, String userId);
}