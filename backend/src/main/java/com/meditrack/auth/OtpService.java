package com.meditrack.auth;

import com.meditrack.enums.OtpType;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRequestRepository otpRequestRepository;
    private final JavaMailSender mailSender;

    public String generateAndSendOtp(String userId, String email, OtpType otpType) {
        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpRequest otpRequest = OtpRequest.builder()
                .userId(userId)
                .otpCode(otp)
                .otpType(otpType)
                .expiresAt(LocalDateTime.now(java.time.ZoneOffset.UTC).plusMinutes(5))
                .isUsed(false)
                .build();

        otpRequestRepository.save(otpRequest);
        sendEmail(email, otp, otpType);
        return otp;
    }

    public boolean verifyOtp(String userId, String otp, OtpType otpType) {
        OtpRequest otpRequest = otpRequestRepository
                .findTopByUserIdAndOtpTypeAndIsUsedFalseOrderByCreatedAtDesc(userId, otpType)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (otpRequest.getExpiresAt().isBefore(LocalDateTime.now(java.time.ZoneOffset.UTC))){
            throw new RuntimeException("OTP expired");
        }

        if (!otpRequest.getOtpCode().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        otpRequest.setIsUsed(true);
        otpRequestRepository.save(otpRequest);
        return true;
    }

    private void sendEmail(String email, String otp, OtpType otpType) {
        String subject = otpType == OtpType.EMAIL_VERIFY
                ? "MediTrack - Verify Your Email"
                : "MediTrack - Password Reset OTP";

        String body = "Your OTP is: " + otp + "\nValid for 5 minutes.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}