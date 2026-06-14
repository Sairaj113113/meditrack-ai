package com.meditrack.notification;

import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDTO toDTO(NotificationQueue notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .referenceId(notification.getReferenceId())
                .notificationType(notification.getNotificationType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .status(notification.getStatus())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}