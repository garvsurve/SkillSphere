package com.skillsphere.service;

import com.skillsphere.dto.request.MessageSendRequest;
import com.skillsphere.dto.response.MessageResponse;
import com.skillsphere.dto.response.UserResponse;
import com.skillsphere.entity.Message;
import com.skillsphere.entity.User;
import com.skillsphere.mapper.EntityMapper;
import com.skillsphere.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;
    private final EntityMapper mapper;

    public MessageResponse sendMessage(String senderEmail, MessageSendRequest req) {
        User sender = userService.getUserByEmail(senderEmail);
        User receiver = userService.getUserById(req.getReceiverId());

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalStateException("You cannot message yourself.");
        }

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(req.getContent())
                .build();

        return mapper.toMessageResponse(messageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getChatHistory(String userEmail, Long otherUserId) {
        User user1 = userService.getUserByEmail(userEmail);
        User user2 = userService.getUserById(otherUserId);

        return messageRepository.findChatHistory(user1, user2)
                .stream()
                .map(mapper::toMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getConversations(String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        return messageRepository.findChattedUsers(user)
                .stream()
                .map(mapper::toUserResponse)
                .collect(Collectors.toList());
    }
}
