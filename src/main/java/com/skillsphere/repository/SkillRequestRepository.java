package com.skillsphere.repository;

import com.skillsphere.entity.RequestStatus;
import com.skillsphere.entity.SkillRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRequestRepository extends JpaRepository<SkillRequest, Long> {

    // All requests made BY a specific learner
    List<SkillRequest> findByLearnerId(Long learnerId);

    // All requests FOR a specific skill
    List<SkillRequest> findBySkillId(Long skillId);

    // Filter requests by status (e.g., all PENDING requests for a skill)
    List<SkillRequest> findBySkillIdAndStatus(Long skillId, RequestStatus status);

    // All requests made by learner with a specific status
    List<SkillRequest> findByLearnerIdAndStatus(Long learnerId, RequestStatus status);
}
