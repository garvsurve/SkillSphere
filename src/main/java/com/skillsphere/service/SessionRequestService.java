package com.skillsphere.service;

import com.skillsphere.dto.request.SessionRequestActionRequest;
import com.skillsphere.dto.request.SessionRequestCreateRequest;
import com.skillsphere.dto.response.SessionRequestResponse;
import com.skillsphere.entity.*;
import com.skillsphere.exception.ResourceNotFoundException;
import com.skillsphere.repository.SessionRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionRequestService {

    private final SessionRequestRepository sessionRequestRepository;
    private final PostService postService;
    private final UserService userService;
    private final NotificationService notificationService;

    private static final int MAX_WORDS = 100;

    /**
     * Validate that a string does not exceed 100 words.
     */
    private void validateWordCount(String text, String fieldName) {
        if (text == null || text.isBlank()) return;
        long wordCount = Arrays.stream(text.trim().split("\\s+")).count();
        if (wordCount > MAX_WORDS) {
            throw new IllegalStateException(fieldName + " must not exceed " + MAX_WORDS + " words. Current: " + wordCount + " words.");
        }
    }

    public SessionRequestResponse createRequest(String fromEmail, SessionRequestCreateRequest req) {
        User fromUser = userService.getUserByEmail(fromEmail);
        User toUser;
        Post post = null;

        if (req.getPostId() != null) {
            post = postService.getPostEntityById(req.getPostId());
            toUser = post.getAuthor();
        } else if (req.getToUserId() != null) {
            toUser = userService.getUserById(req.getToUserId());
        } else {
            throw new IllegalStateException("Must provide either postId or toUserId");
        }

        if (fromUser.getId().equals(toUser.getId())) {
            throw new IllegalStateException("You cannot request a session on your own post.");
        }

        validateWordCount(req.getMessage(), "Message");

        SessionRequest request = SessionRequest.builder()
                .fromUser(fromUser)
                .toUser(toUser)
                .post(post)
                .message(req.getMessage())
                .status(SessionRequestStatus.PENDING)
                .build();

        SessionRequest saved = sessionRequestRepository.save(request);
        notificationService.sendNotification(toUser, fromUser.getName() + " sent you a session request!");
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SessionRequestResponse> getSentRequests(String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        return sessionRequestRepository.findByFromUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionRequestResponse> getIncomingRequests(String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        return sessionRequestRepository.findByToUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public SessionRequestResponse acceptRequest(Long requestId, String userEmail, SessionRequestActionRequest action) {
        SessionRequest request = getById(requestId);
        verifyReceiver(request, userEmail);
        if (request.getStatus() != SessionRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be accepted.");
        }
        validateWordCount(action.getResponseNote(), "Response note");
        request.setStatus(SessionRequestStatus.ACCEPTED);
        request.setResponseNote(action.getResponseNote());
        return toResponse(sessionRequestRepository.save(request));
    }

    public SessionRequestResponse rejectRequest(Long requestId, String userEmail, SessionRequestActionRequest action) {
        SessionRequest request = getById(requestId);
        verifyReceiver(request, userEmail);
        if (request.getStatus() != SessionRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be rejected.");
        }
        validateWordCount(action.getResponseNote(), "Response note");
        request.setStatus(SessionRequestStatus.REJECTED);
        request.setResponseNote(action.getResponseNote());
        return toResponse(sessionRequestRepository.save(request));
    }

    private void verifyReceiver(SessionRequest request, String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        if (!request.getToUser().getId().equals(user.getId())) {
            throw new IllegalStateException("You are not authorized to respond to this request.");
        }
    }

    private SessionRequest getById(Long id) {
        return sessionRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session request not found with id: " + id));
    }

    private SessionRequestResponse toResponse(SessionRequest req) {
        String snippet = null;
        if (req.getPost() != null) {
            snippet = req.getPost().getContent();
            if (snippet.length() > 80) snippet = snippet.substring(0, 80) + "...";
        }
        
        return SessionRequestResponse.builder()
                .id(req.getId())
                .fromUserId(req.getFromUser().getId())
                .fromUserName(req.getFromUser().getName())
                .fromUserAvatarId(req.getFromUser().getAvatarId())
                .fromUserTechStack(req.getFromUser().getTechStack())
                .toUserId(req.getToUser().getId())
                .toUserName(req.getToUser().getName())
                .toUserAvatarId(req.getToUser().getAvatarId())
                .postId(req.getPost() != null ? req.getPost().getId() : null)
                .postContentSnippet(snippet)
                .message(req.getMessage())
                .responseNote(req.getResponseNote())
                .status(req.getStatus())
                .createdAt(req.getCreatedAt())
                .build();
    }
}
