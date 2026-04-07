package com.skillsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * A learner's request to learn a specific skill from a mentor (skill owner).
 *
 * Relationships:
 *  - ManyToOne Skill  → which skill is being requested
 *  - ManyToOne User (learner) → who is making the request
 *  - OneToOne  Review → review written after session completes
 */
@Entity
@Table(name = "skill_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The skill this request is for.
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    /**
     * The user who WANTS to learn (the learner side).
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id", nullable = false)
    private User learner;

    /**
     * Current lifecycle state.
     * Stored as a STRING in DB (not integer ordinal) — safer for schema evolution.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    private String message;        // Optional note from the learner when requesting

    // ── Session fields (populated when ACCEPTED) ──────────────
    private String meetingLink;    // Zoom / Google Meet link
    private LocalDateTime scheduledAt;   // When the session is planned

    /**
     * One-to-One: a review can be written once the session COMPLETES.
     * mappedBy = "skillRequest" means Review owns the FK column.
     */
    @JsonIgnore
    @OneToOne(mappedBy = "skillRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private Review review;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
