package com.skillsphere.repository;

import com.skillsphere.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // All reviews written BY a user
    List<Review> findByReviewerId(Long reviewerId);

    // Prevent duplicate review: one review per completed request
    boolean existsBySkillRequestId(Long skillRequestId);

    // Fetch the review for a given request
    Optional<Review> findBySkillRequestId(Long skillRequestId);
}
