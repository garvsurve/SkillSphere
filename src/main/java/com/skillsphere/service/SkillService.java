package com.skillsphere.service;

import com.skillsphere.entity.Skill;
import com.skillsphere.entity.User;
import com.skillsphere.exception.ResourceNotFoundException;
import com.skillsphere.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserService userService; // Reuse user lookup — avoid duplication

    public Skill createSkill(Long ownerId, Skill skill) {
        User owner = userService.getUserById(ownerId);
        skill.setOwner(owner);
        return skillRepository.save(skill);
    }

    @Transactional(readOnly = true)
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Skill> getSkillsPaged(Pageable pageable) {
        return skillRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Skill> searchSkills(String keyword, Pageable pageable) {
        return skillRepository.findByTitleContainingIgnoreCase(keyword, pageable);
    }

    @Transactional(readOnly = true)
    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Skill> getSkillsByOwner(Long ownerId) {
        userService.getUserById(ownerId); // Validate owner exists first
        return skillRepository.findByOwnerId(ownerId);
    }

    @Transactional(readOnly = true)
    public List<Skill> getSkillsByCategory(String category) {
        return skillRepository.findByCategory(category);
    }

    public Skill updateSkill(Long id, Skill updatedData) {
        Skill existing = getSkillById(id);
        existing.setTitle(updatedData.getTitle());
        existing.setDescription(updatedData.getDescription());
        existing.setCategory(updatedData.getCategory());
        return skillRepository.save(existing);
    }

    public void deleteSkill(Long id) {
        Skill skill = getSkillById(id);
        skillRepository.delete(skill);
    }
}
