package com.skillsphere.entity;

/**
 * Lifecycle states for a SessionRequest (post-based mentorship request).
 * PENDING   → sent, waiting for owner to respond
 * ACCEPTED  → owner accepted
 * REJECTED  → owner declined
 */
public enum SessionRequestStatus {
    PENDING,
    ACCEPTED,
    REJECTED
}
