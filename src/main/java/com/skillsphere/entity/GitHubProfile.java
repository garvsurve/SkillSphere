package com.skillsphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "github_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitHubProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String githubUsername;
    
    @Column(length = 500)
    private String accessToken; 
    
    private LocalDateTime lastSyncedAt;
}
