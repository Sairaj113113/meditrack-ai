package com.meditrack.ocr;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.OcrStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ocr_prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OcrPrescription extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(nullable = false)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String extractedText;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OcrStatus status = OcrStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String aiSuggestions;
}