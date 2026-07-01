package com.skillsphere.repository;

import com.skillsphere.entity.SessionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRequestRepository extends JpaRepository<SessionRequest, Long> {

    /** All requests sent BY a user */
    List<SessionRequest> findByFromUserIdOrderByCreatedAtDesc(Long fromUserId);

    /** All requests received BY a user (as post author) */
    List<SessionRequest> findByToUserIdOrderByCreatedAtDesc(Long toUserId);
}
