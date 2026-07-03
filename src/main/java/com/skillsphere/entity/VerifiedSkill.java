package com.skillsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "verified_skills")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifiedSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String language; 

    @Column(nullable = false)
    private Integer score; // 0-100

    private Long linesOfCode;
    
    private Integer repoCount;
    
    private LocalDateTime lastCommitDate;
    
    private LocalDateTime lastSyncedAt;
}
