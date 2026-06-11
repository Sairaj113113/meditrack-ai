package com.meditrack.auth;

import com.meditrack.user.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public AuthResponseDTO toAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponseDTO.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .emailVerified(user.getEmailVerified())
                .build();
    }

    public AuthResponseDTO toRegisterResponse(User user) {
        return AuthResponseDTO.builder()
                .userId(user.getId())
                .message("OTP sent successfully")
                .otpExpiresIn(300)
                .build();
    }

    public AuthResponseDTO toVerifyResponse(User user) {
        return AuthResponseDTO.builder()
                .userId(user.getId())
                .emailVerified(user.getEmailVerified())
                .message("Account verified successfully")
                .build();
    }
}