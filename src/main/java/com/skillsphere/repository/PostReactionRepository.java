package com.skillsphere.repository;

import com.skillsphere.entity.PostReaction;
import com.skillsphere.entity.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {

    Optional<PostReaction> findByPostIdAndUserId(Long postId, Long userId);

    long countByPostIdAndType(Long postId, ReactionType type);

    boolean existsByPostIdAndUserId(Long postId, Long userId);
}
