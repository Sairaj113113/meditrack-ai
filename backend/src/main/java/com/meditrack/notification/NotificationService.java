package com.meditrack.notification;

import com.meditrack.enums.NotificationStatus;
import com.meditrack.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationQueueRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    public List<NotificationDTO> getNotifications(String userId) {
        return notificationRepository
                .findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    public NotificationDTO getNotificationById(String userId, String id) {
        NotificationQueue notification = notificationRepository
                .findByIdAndUserIdAndIsDeletedFalse(id, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        return notificationMapper.toDTO(notification);
    }

    public void markAsRead(String userId, String id) {
        NotificationQueue notification = notificationRepository
                .findByIdAndUserIdAndIsDeletedFalse(id, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(String userId) {
        notificationRepository.markAllAsRead(userId);
    }

    public NotificationQueue createNotification(String userId, String referenceId,
                                                  NotificationType type,
                                                  String title, String message) {
        NotificationQueue notification = NotificationQueue.builder()
                .userId(userId)
                .referenceId(referenceId)
                .notificationType(type)
                .title(title)
                .message(message)
                .status(NotificationStatus.SENT)
                .build();
        return notificationRepository.save(notification);
    }
}