package com.meditrack.auth;

import com.meditrack.enums.AccountStatus;
import com.meditrack.enums.OtpType;
import com.meditrack.security.JwtService;
import com.meditrack.user.User;
import com.meditrack.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OtpRequestRepository otpRequestRepository;
    private final OtpService otpService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthMapper authMapper;

    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (dto.getMobile() != null && userRepository.existsByMobile(dto.getMobile())) {
            throw new RuntimeException("Mobile already registered");
        }

        User user = User.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .mobile(dto.getMobile())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .build();

        userRepository.save(user);
        otpService.generateAndSendOtp(user.getId(), user.getEmail(), OtpType.EMAIL_VERIFY);

        return authMapper.toRegisterResponse(user);
    }

    public AuthResponseDTO verifyOtp(VerifyOtpDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        otpService.verifyOtp(user.getId(), dto.getOtp(), OtpType.EMAIL_VERIFY);

        user.setEmailVerified(true);
        user.setAccountStatus(AccountStatus.ACTIVE);
        userRepository.save(user);

        return authMapper.toVerifyResponse(user);
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository
                .findByEmailOrMobile(dto.getUsername(), dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getEmailVerified()) {
            throw new RuntimeException("Email not verified");
        }

        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is " + user.getAccountStatus());
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return authMapper.toAuthResponse(
                user,
                jwtService.generateAccessToken(user.getId()),
                jwtService.generateRefreshToken(user.getId())
        );
    }

    public AuthResponseDTO forgotPassword(ForgotPasswordDTO dto) {
        User user = userRepository
                .findByEmailOrMobile(dto.getUsername(), dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        otpService.generateAndSendOtp(user.getId(), user.getEmail(), OtpType.PASSWORD_RESET);

        return AuthResponseDTO.builder()
                .message("OTP sent successfully")
                .otpExpiresIn(300)
                .build();
    }

    public AuthResponseDTO resetPassword(ResetPasswordDTO dto) {
        User user = userRepository
                .findByEmailOrMobile(dto.getUsername(), dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        otpService.verifyOtp(user.getId(), dto.getOtp(), OtpType.PASSWORD_RESET);

        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        return AuthResponseDTO.builder()
                .message("Password reset successfully")
                .build();
    }

    public AuthResponseDTO refreshToken(RefreshTokenDTO dto) {
        if (!jwtService.isTokenValid(dto.getRefreshToken())) {
            throw new RuntimeException("Invalid refresh token");
        }

        String userId = jwtService.extractUserId(dto.getRefreshToken());
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponseDTO.builder()
                .accessToken(jwtService.generateAccessToken(userId))
                .refreshToken(jwtService.generateRefreshToken(userId))
                .message("Token refreshed successfully")
                .build();
    }
}