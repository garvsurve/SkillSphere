package com.skillsphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * A session request sent from one user to another, triggered from a Post.
 * This is distinct from SkillRequest (which is skill-based).
 *
 * Flow: fromUser clicks "Request Session" on a post → toUser (author) gets it.
 * Status: PENDING → ACCEPTED or REJECTED
 */
@Entity
@Table(name = "session_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The user who sent the session request */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;

    /** The post author who receives the session request */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;

    /** The post that prompted this request */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = true)
    private Post post;

    /** Message from sender (max 100 words enforced in service) */
    @Column(length = 1000)
    private String message;

    /** Optional response note from receiver (max 100 words) */
    @Column(length = 1000)
    private String responseNote;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SessionRequestStatus status = SessionRequestStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
