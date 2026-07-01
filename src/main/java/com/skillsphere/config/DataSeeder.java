package com.skillsphere.config;

import com.skillsphere.entity.Post;
import com.skillsphere.entity.User;
import com.skillsphere.repository.PostRepository;
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
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🌱 SEEDING DATABASE WITH NEW DATA...");

        User u1 = User.builder()
                .name("Alice Johnson")
                .email("alice@test.com")
                .password(passwordEncoder.encode("password"))
                .bio("Software Engineer who loves building cool stuff.")
                .experience("3+ years")
                .company("TechCorp")
                .avatarId("avatar2")
                .techStack(List.of("REACT", "JAVA", "SPRING BOOT"))
                .intents(List.of("Open to Collaborate", "Learning"))
                .build();

        User u2 = User.builder()
                .name("Bob Smith")
                .email("bob@test.com")
                .password(passwordEncoder.encode("password"))
                .bio("Frontend dev exploring full stack.")
                .experience("1 year")
                .company("StartupX")
                .avatarId("avatar3")
                .techStack(List.of("JAVASCRIPT", "HTML", "CSS", "NODEJS"))
                .intents(List.of("Open to Work", "Need Help"))
                .build();

        User u3 = User.builder()
                .name("Charlie Davis")
                .email("charlie@test.com")
                .password(passwordEncoder.encode("password"))
                .bio("Indie hacker building side projects in public.")
                .experience("5+ years")
                .company("Self-Employed")
                .avatarId("avatar4")
                .techStack(List.of("PYTHON", "DJANGO", "NEXT.JS"))
                .intents(List.of("Building Startup", "Side Projects"))
                .build();

        User u4 = User.builder()
                .name("Diana Prince")
                .email("diana@test.com")
                .password(passwordEncoder.encode("password"))
                .bio("Design systems and UI engineering are my passion.")
                .experience("2 years")
                .company("DesignStudio")
                .avatarId("avatar5")
                .techStack(List.of("FIGMA", "REACT", "TAILWIND"))
                .intents(List.of("Learning", "Open to Collaborate"))
                .build();

        userRepository.saveAll(List.of(u1, u2, u3, u4));

        Post p1 = Post.builder()
                .author(u1)
                .content("Just started learning Go! Any recommendations for good resources? ❓ #AskForHelp")
                .build();

        Post p2 = Post.builder()
                .author(u2)
                .content("I just deployed my first full-stack app using React and Node.js! It feels so good to finally see it live! 🚀 #ShareProject")
                .build();

        Post p3 = Post.builder()
                .author(u3)
                .content("Looking for a frontend dev to collaborate on an open source developer tool I'm building! DM me if interested! 🎯 #Collaborators")
                .build();
                
        Post p4 = Post.builder()
                .author(u4)
                .content("CSS Grid is honestly a superpower. Just refactored a massive layout and it's so much cleaner now. 💡 #ShareKnowledge")
                .build();

        postRepository.saveAll(List.of(p1, p2, p3, p4));
        
        System.out.println("✅ DATABASE SEEDED SUCCESSFULLY!");
    }
}
