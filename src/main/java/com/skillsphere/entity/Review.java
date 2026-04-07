package com.skillsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.LocalDateTime;

/**
 * A review written by a learner (or mentor) after a COMPLETED skill session.
 *
 * Relationships:
 *  - OneToOne SkillRequest → ties the review to the specific session
 *  - ManyToOne User (reviewer) → who wrote this review
 */
@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The completed request that this review belongs to.
     * Review owns the FK column here (it's the "owning side" of the OneToOne).
     */
    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_request_id", nullable = false, unique = true)
    private SkillRequest skillRequest;

    /**
     * Who wrote this review (usually the learner, but design allows mentor to review too).
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer rating;        // 1–5 star rating

    private String comment;        // Optional written feedback

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
