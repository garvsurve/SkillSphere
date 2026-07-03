package com.skillsphere.mapper;

import com.skillsphere.dto.response.*;
import com.skillsphere.entity.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null)
            return null;
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .avatarId(user.getAvatarId())
                .experience(user.getExperience())
                .company(user.getCompany())
                .techStack(user.getTechStack() != null ? user.getTechStack() : new ArrayList<>())
                .intents(user.getIntents() != null ? user.getIntents() : new ArrayList<>())
                .createdAt(user.getCreatedAt())
                .followerCount(user.getFollowers() != null ? user.getFollowers().size() : 0)
                .followingIds(user.getFollowing() != null
                        ? user.getFollowing().stream().map(User::getId).collect(Collectors.toList())
                        : new ArrayList<>())
                .build();
    }

    public MessageResponse toMessageResponse(Message message) {
        if (message == null)
            return null;
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getName())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }
}
