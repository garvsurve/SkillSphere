package com.skillsphere.mapper;

import com.skillsphere.dto.response.SkillRequestResponse;
import com.skillsphere.dto.response.SkillResponse;
import com.skillsphere.dto.response.UserResponse;
import com.skillsphere.entity.Skill;
import com.skillsphere.entity.SkillRequest;
import com.skillsphere.entity.User;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public SkillResponse toSkillResponse(Skill skill) {
        if (skill == null) return null;
        return SkillResponse.builder()
                .id(skill.getId())
                .title(skill.getTitle())
                .description(skill.getDescription())
                .category(skill.getCategory())
                .ownerId(skill.getOwner().getId())
                .ownerName(skill.getOwner().getName())
                .createdAt(skill.getCreatedAt())
                .build();
    }

    public SkillRequestResponse toSkillRequestResponse(SkillRequest request) {
        if (request == null) return null;
        return SkillRequestResponse.builder()
                .id(request.getId())
                .skillId(request.getSkill().getId())
                .skillTitle(request.getSkill().getTitle())
                .learnerId(request.getLearner().getId())
                .learnerName(request.getLearner().getName())
                .status(request.getStatus())
                .message(request.getMessage())
                .meetingLink(request.getMeetingLink())
                .scheduledAt(request.getScheduledAt())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
