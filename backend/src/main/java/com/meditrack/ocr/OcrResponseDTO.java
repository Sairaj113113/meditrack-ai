package com.meditrack.ocr;

import com.meditrack.enums.OcrStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OcrResponseDTO {

    private String id;
    private String imageUrl;
    private String extractedText;
    private OcrStatus status;
    private String aiSuggestions;
    private LocalDateTime createdAt;
}