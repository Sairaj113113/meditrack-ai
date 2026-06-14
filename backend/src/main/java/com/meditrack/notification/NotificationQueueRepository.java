package com.meditrack.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotificationQueueRepository extends JpaRepository<NotificationQueue, String> {

    List<NotificationQueue> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(String userId);

    Optional<NotificationQueue> findByIdAndUserIdAndIsDeletedFalse(String id, String userId);

    @Modifying
    @Query("UPDATE NotificationQueue n SET n.isRead = true WHERE n.userId = :userId")
    void markAllAsRead(@Param("userId") String userId);

    long countByUserIdAndIsReadFalseAndIsDeletedFalse(String userId);
}