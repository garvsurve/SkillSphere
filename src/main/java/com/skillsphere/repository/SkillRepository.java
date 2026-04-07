package com.skillsphere.repository;

import com.skillsphere.entity.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    // All skills offered by a specific user
    List<Skill> findByOwnerId(Long ownerId);

    // Search by category
    List<Skill> findByCategory(String category);

    // Case-insensitive title search with Pagination support
    Page<Skill> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    
    // Default paged list
    Page<Skill> findAll(Pageable pageable);
}
