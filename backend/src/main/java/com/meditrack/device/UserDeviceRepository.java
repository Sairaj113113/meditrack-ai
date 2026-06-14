package com.meditrack.device;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserDeviceRepository extends JpaRepository<UserDevice, String> {

    List<UserDevice> findByUserIdAndIsDeletedFalse(String userId);

    Optional<UserDevice> findByIdAndUserIdAndIsDeletedFalse(String id, String userId);

    Optional<UserDevice> findByFcmToken(String fcmToken);
}