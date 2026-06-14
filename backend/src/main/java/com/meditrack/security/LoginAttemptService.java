package com.meditrack.security;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;

    private final Map<String, Integer> attempts = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> blockedUsers = new ConcurrentHashMap<>();

    public void loginSucceeded(String username) {
        attempts.remove(username);
        blockedUsers.remove(username);
    }

    public void loginFailed(String username) {

        int count = attempts.getOrDefault(username, 0) + 1;

        attempts.put(username, count);

        if (count >= MAX_ATTEMPTS) {
            blockedUsers.put(username,
                    LocalDateTime.now().plusMinutes(15));
        }
    }

    public boolean isBlocked(String username) {

        LocalDateTime blockedUntil =
                blockedUsers.get(username);

        if (blockedUntil == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(blockedUntil)) {
            blockedUsers.remove(username);
            attempts.remove(username);
            return false;
        }

        return true;
    }
}