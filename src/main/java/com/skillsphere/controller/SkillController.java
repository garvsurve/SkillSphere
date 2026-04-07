package com.skillsphere.controller;

import com.skillsphere.dto.request.SkillCreateRequest;
import com.skillsphere.dto.response.SkillResponse;
import com.skillsphere.entity.Skill;
import com.skillsphere.mapper.EntityMapper;
import com.skillsphere.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;
    private final EntityMapper mapper;

    @PostMapping
    public ResponseEntity<SkillResponse> createSkill(@RequestParam Long ownerId, @Valid @RequestBody SkillCreateRequest req) {
        Skill skill = Skill.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .category(req.getCategory())
                .build();
        Skill created = skillService.createSkill(ownerId, skill);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toSkillResponse(created));
    }

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills().stream()
                .map(mapper::toSkillResponse).collect(Collectors.toList()));
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<SkillResponse>> getSkillsPaged(Pageable pageable) {
        return ResponseEntity.ok(skillService.getSkillsPaged(pageable)
                .map(mapper::toSkillResponse));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<SkillResponse>> searchSkills(
            @RequestParam String query, 
            Pageable pageable) {
        return ResponseEntity.ok(skillService.searchSkills(query, pageable)
                .map(mapper::toSkillResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillResponse> getSkillById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toSkillResponse(skillService.getSkillById(id)));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<SkillResponse>> getSkillsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(skillService.getSkillsByOwner(ownerId).stream()
                .map(mapper::toSkillResponse).collect(Collectors.toList()));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<SkillResponse>> getSkillsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(skillService.getSkillsByCategory(category).stream()
                .map(mapper::toSkillResponse).collect(Collectors.toList()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillResponse> updateSkill(@PathVariable Long id, @Valid @RequestBody SkillCreateRequest req) {
        Skill skillUpdate = Skill.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .category(req.getCategory())
                .build();
        return ResponseEntity.ok(mapper.toSkillResponse(skillService.updateSkill(id, skillUpdate)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
