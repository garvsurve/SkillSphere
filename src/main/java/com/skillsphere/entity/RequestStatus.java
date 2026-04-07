package com.skillsphere.entity;

/**
 * Lifecycle states of a SkillRequest.
 *
 * PENDING   → learner submitted, waiting for skill owner to respond
 * ACCEPTED  → owner accepted; a session can now be scheduled
 * REJECTED  → owner declined the request
 * COMPLETED → session happened; review can now be submitted
 */
public enum RequestStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    COMPLETED
}
