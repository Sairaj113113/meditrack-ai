package com.meditrack.ocr;

import org.springframework.stereotype.Service;

@Service
public class FastApiClientService {

    public String extractTextFromImage(String imageUrl) {
        // TODO V2: Call FastAPI microservice with Google Vision API
        // POST to FastAPI endpoint with image URL, returns extracted text
        return "OCR extraction not yet implemented";
    }

    public String getAiSuggestions(String extractedText) {
        // TODO V2: Call Gemini API for medicine suggestions based on extracted text
        return "AI suggestions not yet implemented";
    }
}