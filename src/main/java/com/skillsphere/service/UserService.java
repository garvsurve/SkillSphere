package com.skillsphere.service;

import com.skillsphere.entity.User;
import com.skillsphere.exception.ResourceNotFoundException;
import com.skillsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor  // Lombok: generates constructor for all final fields → constructor injection
@Transactional            // All methods wrapped in a transaction by default
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalStateException("Email already registered: " + user.getEmail());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)  // Hint to Hibernate: no dirty checking, faster reads
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User updateUser(Long id, User updatedData) {
        User existing = getUserById(id);
        existing.setName(updatedData.getName());
        existing.setBio(updatedData.getBio());
        existing.setProfilePicture(updatedData.getProfilePicture());
        // Note: email and password updates intentionally separate (Phase 3)
        return userRepository.save(existing);
    }

    public void deleteUser(Long id) {
        // Verify exists before deleting — gives 404 instead of silent no-op
        User user = getUserById(id);
        userRepository.delete(user);
    }
}
