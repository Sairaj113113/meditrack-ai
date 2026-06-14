package com.meditrack.security;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpThrottleService {

    private static final int MAX_OTP_REQUESTS = 3;

    private final Map<String, Integer> otpCounts =
            new ConcurrentHashMap<>();

    private final Map<String, LocalDateTime> otpWindow =
            new ConcurrentHashMap<>();

    public boolean canSendOtp(String email) {

        LocalDateTime startTime =
                otpWindow.get(email);

        if (startTime == null ||
                startTime.plusMinutes(15)
                        .isBefore(LocalDateTime.now())) {

            otpWindow.put(email, LocalDateTime.now());
            otpCounts.put(email, 0);
        }

        int count =
                otpCounts.getOrDefault(email, 0);

        return count < MAX_OTP_REQUESTS;
    }

    public void recordOtpRequest(String email) {

        otpCounts.put(
                email,
                otpCounts.getOrDefault(email, 0) + 1
        );
    }
}