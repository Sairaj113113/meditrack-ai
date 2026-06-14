package com.meditrack.notification;

import com.meditrack.enums.NotificationStatus;
import com.meditrack.enums.NotificationType;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private String id;
    private String referenceId;
    private NotificationType notificationType;
    private String title;
    private String message;
    private NotificationStatus status;
    private Boolean isRead;
    private LocalDateTime createdAt;
}