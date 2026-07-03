package com.skillsphere.service;

import com.skillsphere.dto.request.PostCommentRequest;
import com.skillsphere.dto.request.PostCreateRequest;
import com.skillsphere.dto.response.PostCommentResponse;
import com.skillsphere.dto.response.PostResponse;
import com.skillsphere.entity.*;
import com.skillsphere.exception.ResourceNotFoundException;
import com.skillsphere.repository.PostCommentRepository;
import com.skillsphere.repository.PostReactionRepository;
import com.skillsphere.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final PostCommentRepository commentRepository;
    private final PostReactionRepository reactionRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public PostResponse createPost(String authorEmail, PostCreateRequest req) {
        User author = userService.getUserByEmail(authorEmail);
        Post post = Post.builder()
                .content(req.getContent())
                .author(author)
                .build();
        Post saved = postRepository.save(post);
        return toPostResponse(saved, authorEmail);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getFeed(String currentUserEmail) {
        List<Post> posts = postRepository.findAllWithAuthorOrderByCreatedAtDesc();
        return posts.stream()
                .map(p -> toPostResponse(p, currentUserEmail))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByUser(Long userId, String currentUserEmail) {
        List<Post> posts = postRepository.findByAuthorIdOrderByCreatedAtDesc(userId);
        return posts.stream()
                .map(p -> toPostResponse(p, currentUserEmail))
                .collect(Collectors.toList());
    }

    /**
     * Toggle reaction: if user already has same reaction → remove it (un-react).
     * If user has different reaction → switch it.
     * If no reaction → add it.
     */
    public PostResponse reactToPost(Long postId, String userEmail, String reactionTypeStr) {
        Post post = getPostEntityById(postId);
        User user = userService.getUserByEmail(userEmail);
        ReactionType type = ReactionType.valueOf(reactionTypeStr.toUpperCase());

        Optional<PostReaction> existing = reactionRepository.findByPostIdAndUserId(postId, user.getId());
        if (existing.isPresent()) {
            PostReaction reaction = existing.get();
            if (reaction.getType() == type) {
                // Same reaction — toggle off (remove)
                reactionRepository.delete(reaction);
            } else {
                // Different reaction — switch
                reaction.setType(type);
                reactionRepository.save(reaction);
            }
        } else {
            // New reaction
            PostReaction reaction = PostReaction.builder()
                    .post(post)
                    .user(user)
                    .type(type)
                    .build();
            reactionRepository.save(reaction);
            
            if (type == ReactionType.LIKE && !post.getAuthor().getId().equals(user.getId())) {
                notificationService.sendNotification(post.getAuthor(), user.getName() + " appreciated your post!");
            }
        }
        return toPostResponse(post, userEmail);
    }

    public PostCommentResponse addComment(Long postId, String authorEmail, PostCommentRequest req) {
        Post post = getPostEntityById(postId);
        User author = userService.getUserByEmail(authorEmail);

        PostComment parent = null;
        if (req.getParentCommentId() != null) {
            parent = commentRepository.findById(req.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            if (!parent.getPost().getId().equals(postId)) {
                throw new IllegalArgumentException("Parent comment belongs to a different post");
            }
        }

        PostComment comment = PostComment.builder()
                .content(req.getContent())
                .author(author)
                .post(post)
                .parentComment(parent)
                .build();
        PostComment saved = commentRepository.save(comment);

        if (!post.getAuthor().getId().equals(author.getId())) {
            notificationService.sendNotification(post.getAuthor(), author.getName() + " commented on your post.");
        }

        return toCommentResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<PostCommentResponse> getComments(Long postId) {
        return commentRepository.findByPostIdAndParentCommentIsNullOrderByCreatedAtAsc(postId)
                .stream().map(this::toCommentResponse).collect(Collectors.toList());
    }

    public void deletePost(Long postId, String userEmail) {
        Post post = getPostEntityById(postId);
        User user = userService.getUserByEmail(userEmail);
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new IllegalStateException("You can only delete your own posts.");
        }
        postRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public Post getPostEntityById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
    }

    // ── Mapping helpers ────────────────────────────────────────────────────────

    public PostResponse toPostResponse(Post post, String currentUserEmail) {
        long likes = reactionRepository.countByPostIdAndType(post.getId(), ReactionType.LIKE);
        long dislikes = reactionRepository.countByPostIdAndType(post.getId(), ReactionType.DISLIKE);
        long comments = commentRepository.countByPostId(post.getId());

        String myReaction = null;
        if (currentUserEmail != null) {
            try {
                User currentUser = userService.getUserByEmail(currentUserEmail);
                Optional<PostReaction> myR = reactionRepository.findByPostIdAndUserId(post.getId(),
                        currentUser.getId());
                myReaction = myR.map(r -> r.getType().name()).orElse(null);
            } catch (Exception ignored) {
            }
        }

        User author = post.getAuthor();
        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .authorId(author.getId())
                .authorName(author.getName())
                .authorAvatarId(author.getAvatarId())
                .authorTechStack(author.getTechStack())
                .likeCount(likes)
                .dislikeCount(dislikes)
                .myReaction(myReaction)
                .commentCount(comments)
                .createdAt(post.getCreatedAt())
                .build();
    }

    private PostCommentResponse toCommentResponse(PostComment comment) {
        List<PostCommentResponse> replies = null;
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            replies = comment.getReplies().stream()
                    .map(this::toCommentResponse)
                    .collect(Collectors.toList());
        }

        return PostCommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getName())
                .authorAvatarId(comment.getAuthor().getAvatarId())
                .createdAt(comment.getCreatedAt())
                .replies(replies)
                .build();
    }
}
