package com.skillsphere.service;

import com.skillsphere.entity.*;
import com.skillsphere.exception.ResourceNotFoundException;
import com.skillsphere.repository.SkillRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SkillRequestService {

    private final SkillRequestRepository skillRequestRepository;
    private final SkillService skillService;
    private final UserService userService;

    /**
     * A learner sends a request to learn a skill.
     * Guard: a user cannot request their own skill.
     */
    public SkillRequest createRequest(Long skillId, Long learnerId, String message) {
        Skill skill = skillService.getSkillById(skillId);
        User learner = userService.getUserById(learnerId);

        // Business rule: you can't request your own skill
        if (skill.getOwner().getId().equals(learnerId)) {
            throw new IllegalStateException("You cannot request to learn your own skill.");
        }

        SkillRequest request = SkillRequest.builder()
            .skill(skill)
            .learner(learner)
            .message(message)
            .status(RequestStatus.PENDING)
            .build();

        return skillRequestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public SkillRequest getRequestById(Long id) {
        return skillRequestRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("SkillRequest not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<SkillRequest> getRequestsByLearner(Long learnerId) {
        userService.getUserById(learnerId);
        return skillRequestRepository.findByLearnerId(learnerId);
    }

    @Transactional(readOnly = true)
    public List<SkillRequest> getRequestsBySkill(Long skillId) {
        skillService.getSkillById(skillId);
        return skillRequestRepository.findBySkillId(skillId);
    }

    @Transactional(readOnly = true)
    public List<SkillRequest> getAllRequests() {
        return skillRequestRepository.findAll();
    }

    /**
     * Skill owner accepts a PENDING request.
     */
    public SkillRequest acceptRequest(Long requestId) {
        SkillRequest request = getRequestById(requestId);
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be accepted. Current status: " + request.getStatus());
        }
        request.setStatus(RequestStatus.ACCEPTED);
        return skillRequestRepository.save(request);
    }

    /**
     * Skill owner rejects a PENDING request.
     */
    public SkillRequest rejectRequest(Long requestId) {
        SkillRequest request = getRequestById(requestId);
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be rejected. Current status: " + request.getStatus());
        }
        request.setStatus(RequestStatus.REJECTED);
        return skillRequestRepository.save(request);
    }

    /**
     * Schedule a session for an ACCEPTED request.
     */
    public SkillRequest scheduleSession(Long requestId, String link, java.time.LocalDateTime time) {
        SkillRequest request = getRequestById(requestId);
        if (request.getStatus() != RequestStatus.ACCEPTED) {
            throw new IllegalStateException("Sessions can only be scheduled for ACCEPTED requests.");
        }
        request.setMeetingLink(link);
        request.setScheduledAt(time);
        return skillRequestRepository.save(request);
    }

    /**
     * Mark a session as COMPLETED so it can be reviewed.
     */
    public SkillRequest markAsCompleted(Long requestId) {
        SkillRequest request = getRequestById(requestId);
        if (request.getStatus() != RequestStatus.ACCEPTED) {
            throw new IllegalStateException("Only ACCEPTED requests with scheduled sessions can be marked as COMPLETED.");
        }
        request.setStatus(RequestStatus.COMPLETED);
        return skillRequestRepository.save(request);
    }

    public void deleteRequest(Long id) {
        SkillRequest request = getRequestById(id);
        skillRequestRepository.delete(request);
    }
}
