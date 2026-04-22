package com.skillsphere.config;

import com.skillsphere.entity.Skill;
import com.skillsphere.entity.User;
import com.skillsphere.repository.SkillRepository;
import com.skillsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("alice@example.com")) {
            User alice = User.builder()
                    .name("Alice Smith")
                    .email("alice@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .bio("I love teaching programming and math.")
                    .build();

            User bob = User.builder()
                    .name("Bob Johnson")
                    .email("bob@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .bio("Passionate musician and artist.")
                    .build();

            User charlie = User.builder()
                    .name("Charlie Davis")
                    .email("charlie@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .bio("Culinary expert and food enthusiast.")
                    .build();

            userRepository.saveAll(List.of(alice, bob, charlie));

            Skill python = Skill.builder()
                    .title("Python Basics")
                    .category("Programming")
                    .description("Learn the fundamentals of Python programming.")
                    .owner(alice)
                    .build();

            Skill guitar = Skill.builder()
                    .title("Guitar for Beginners")
                    .category("Music")
                    .description("Start your musical journey with basic guitar chords.")
                    .owner(bob)
                    .build();

            Skill cooking = Skill.builder()
                    .title("Italian Cooking")
                    .category("Culinary")
                    .description("Master the art of making authentic pasta and pizza.")
                    .owner(charlie)
                    .build();

            skillRepository.saveAll(List.of(python, guitar, cooking));
        }
    }
}
