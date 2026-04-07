package com.skillsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a platform user who can act as both mentor and learner.
 * One User → Many Skills (skills they can teach)
 * One User → Many SkillRequests (requests they made as a learner)
 */
@Entity
@Table(name = "users")  // 'user' is a reserved word in PostgreSQL — always use 'users'
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password; // Plain text for Phase 1 — hashed with BCrypt in Phase 3

    private String bio;

    private String profilePicture;

    /**
     * Skills this user can TEACH (they own these skills).
     * CascadeType.ALL: if user is deleted, their skills are also deleted.
     * orphanRemoval: if a skill is removed from this list, it's deleted from DB.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Skill> skillsOffered = new ArrayList<>();

    /**
     * Requests this user made as a LEARNER (not as a mentor).
     */
    @JsonIgnore
    @OneToMany(mappedBy = "learner", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SkillRequest> requestsMade = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
