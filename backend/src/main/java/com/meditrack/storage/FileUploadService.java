package com.meditrack.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {

    public String uploadFile(MultipartFile file) {
        // TODO V2: Implement Cloudinary upload
        // Returns the uploaded file's URL
        return "TODO: cloudinary upload not implemented";
    }
}