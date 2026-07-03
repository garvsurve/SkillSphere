package com.skillsphere.service;

import com.skillsphere.entity.User;
import com.skillsphere.exception.ResourceNotFoundException;
import com.skillsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalStateException("Email already registered: " + user.getEmail());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Enforce UPPERCASE on tech stack
        if (user.getTechStack() != null) {
            user.setTechStack(user.getTechStack().stream()
                    .map(String::toUpperCase)
                    .collect(Collectors.toList()));
        }
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User updateUser(Long id, User updatedData) {
        User existing = getUserById(id);
        existing.setName(updatedData.getName());
        existing.setBio(updatedData.getBio());
        existing.setProfilePicture(updatedData.getProfilePicture());
        existing.setAvatarId(updatedData.getAvatarId());
        existing.setExperience(updatedData.getExperience());
        existing.setCompany(updatedData.getCompany());
        // Enforce UPPERCASE on tech stack
        if (updatedData.getTechStack() != null) {
            existing.setTechStack(updatedData.getTechStack().stream()
                    .map(String::toUpperCase)
                    .collect(Collectors.toList()));
        }
        if (updatedData.getIntents() != null) {
            existing.setIntents(new ArrayList<>(updatedData.getIntents()));
        }
        return userRepository.save(existing);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public void toggleFollow(String currentUserEmail, Long targetUserId) {
        User currentUser = getUserByEmail(currentUserEmail);
        User targetUser = getUserById(targetUserId);

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        boolean isFollowing = currentUser.getFollowing().stream()
                .anyMatch(u -> u.getId().equals(targetUser.getId()));

        if (isFollowing) {
            currentUser.getFollowing().removeIf(u -> u.getId().equals(targetUser.getId()));
            targetUser.getFollowers().removeIf(u -> u.getId().equals(currentUser.getId()));
        } else {
            currentUser.getFollowing().add(targetUser);
            targetUser.getFollowers().add(currentUser);
        }

        userRepository.save(currentUser);
        userRepository.save(targetUser);
    }
}
