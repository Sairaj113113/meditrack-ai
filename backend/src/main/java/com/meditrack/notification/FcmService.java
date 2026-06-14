package com.meditrack.notification;

import org.springframework.stereotype.Service;

@Service
public class FcmService {

    public void sendPushNotification(String fcmToken, String title, String body) {
        // TODO: Implement Firebase Cloud Messaging
        // Requires Firebase Admin SDK setup with service account JSON
        System.out.println("Push notification (TODO): " + title + " - " + body);
    }
}