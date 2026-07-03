package com.skillsphere.repository;

import com.skillsphere.entity.VerifiedSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerifiedSkillRepository extends JpaRepository<VerifiedSkill, Long> {
    List<VerifiedSkill> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
