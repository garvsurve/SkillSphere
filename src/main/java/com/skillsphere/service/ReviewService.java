package com.skillsphere.service;

import com.skillsphere.entity.RequestStatus;
import com.skillsphere.entity.Review;
import com.skillsphere.entity.SkillRequest;
import com.skillsphere.entity.User;
import com.skillsphere.exception.ResourceNotFoundException;
import com.skillsphere.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final SkillRequestService skillRequestService;
    private final UserService userService;

    /**
     * Submit a review.
     * Rules:
     *  1. The associated SkillRequest must be COMPLETED
     *  2. Only one review per request (unique constraint in DB + app-level check)
     */
    public Review createReview(Long requestId, Long reviewerId, Integer rating, String comment) {
        SkillRequest request = skillRequestService.getRequestById(requestId);
        User reviewer = userService.getUserById(reviewerId);

        // Rule 1: session must be completed before review
        if (request.getStatus() != RequestStatus.COMPLETED) {
            throw new IllegalStateException("Reviews can only be submitted for COMPLETED sessions. Current status: " + request.getStatus());
        }

        // Rule 2: prevent duplicate review
        if (reviewRepository.existsBySkillRequestId(requestId)) {
            throw new IllegalStateException("A review already exists for this session.");
        }

        Review review = Review.builder()
            .skillRequest(request)
            .reviewer(reviewer)
            .rating(rating)
            .comment(comment)
            .build();

        return reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewsByReviewer(Long reviewerId) {
        userService.getUserById(reviewerId);
        return reviewRepository.findByReviewerId(reviewerId);
    }

    @Transactional(readOnly = true)
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public void deleteReview(Long id) {
        Review review = getReviewById(id);
        reviewRepository.delete(review);
    }
}
