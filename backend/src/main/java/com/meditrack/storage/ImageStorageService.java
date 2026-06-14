package com.meditrack.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageStorageService {

    public String storeProfileImage(MultipartFile file, String userId) {
        // TODO V2: Upload to Cloudinary under user-specific folder
        return "TODO: profile image upload not implemented";
    }

    public String storePrescriptionImage(MultipartFile file, String userId) {
        // TODO V2: Upload prescription image to Cloudinary for OCR processing
        return "TODO: prescription image upload not implemented";
    }
}