package com.skillsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * A skill that a User can TEACH (offer to others).
 * One Skill → Many SkillRequests (other users can request to learn this skill)
 */
@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;          // e.g., "Python Basics", "Guitar for Beginners"

    private String description;    // optional longer description

    private String category;       // e.g., "Programming", "Music", "Art"

    /**
     * The User who OWNS (teaches) this skill.
     * FetchType.LAZY: owner is not loaded unless explicitly accessed — prevents N+1 queries.
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    /**
     * All requests from learners wanting to learn this skill.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SkillRequest> requests = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
