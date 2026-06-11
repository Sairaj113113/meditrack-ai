package com.meditrack.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {

    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String accessToken;
    private String refreshToken;
    private Boolean emailVerified;
    private Integer otpExpiresIn;
    private String message;
}