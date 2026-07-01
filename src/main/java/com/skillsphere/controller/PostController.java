package com.skillsphere.controller;

import com.skillsphere.dto.request.PostCommentRequest;
import com.skillsphere.dto.request.PostCreateRequest;
import com.skillsphere.dto.response.PostCommentResponse;
import com.skillsphere.dto.response.PostResponse;
import com.skillsphere.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for the community feed.
 * Base URL: /api/posts
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /** GET /api/posts/feed — paginated community feed */
    @GetMapping("/feed")
    public ResponseEntity<List<PostResponse>> getFeed(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(postService.getFeed(email));
    }

    /** POST /api/posts — create a new post */
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody PostCreateRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.createPost(userDetails.getUsername(), req));
    }

    /** POST /api/posts/{id}/react?type=LIKE|DISLIKE — toggle reaction */
    @PostMapping("/{id}/react")
    public ResponseEntity<PostResponse> react(
            @PathVariable Long id,
            @RequestParam String type,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.reactToPost(id, userDetails.getUsername(), type));
    }

    /** POST /api/posts/{id}/comments — add a comment */
    @PostMapping("/{id}/comments")
    public ResponseEntity<PostCommentResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody PostCommentRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.addComment(id, userDetails.getUsername(), req));
    }

    /** GET /api/posts/{id}/comments — fetch all comments on a post */
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<PostCommentResponse>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getComments(id));
    }

    /** DELETE /api/posts/{id} — delete own post */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        postService.deletePost(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
