package com.skillsphere.controller;

import com.skillsphere.entity.Review;
import com.skillsphere.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST endpoints for Review management.
 *
 * Base URL: /api/reviews
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * POST /api/reviews
     * Body: { "requestId": 1, "reviewerId": 2, "rating": 5, "comment": "Great teacher!" }
     */
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Map<String, Object> body) {
        Long requestId = Long.valueOf(body.get("requestId").toString());
        Long reviewerId = Long.valueOf(body.get("reviewerId").toString());
        Integer rating = Integer.valueOf(body.get("rating").toString());
        String comment = body.containsKey("comment") ? body.get("comment").toString() : null;

        Review review = reviewService.createReview(requestId, reviewerId, rating, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    // GET /api/reviews
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // GET /api/reviews/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    // GET /api/reviews/reviewer/{reviewerId}
    @GetMapping("/reviewer/{reviewerId}")
    public ResponseEntity<List<Review>> getByReviewer(@PathVariable Long reviewerId) {
        return ResponseEntity.ok(reviewService.getReviewsByReviewer(reviewerId));
    }

    // DELETE /api/reviews/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
