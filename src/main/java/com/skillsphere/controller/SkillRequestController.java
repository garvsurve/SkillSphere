package com.skillsphere.controller;

import com.skillsphere.dto.request.SkillRequestCreateRequest;
import com.skillsphere.dto.request.SessionScheduleRequest;
import com.skillsphere.dto.response.SkillRequestResponse;
import com.skillsphere.entity.SkillRequest;
import com.skillsphere.mapper.EntityMapper;
import com.skillsphere.service.SkillRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class SkillRequestController {

    private final SkillRequestService skillRequestService;
    private final EntityMapper mapper;

    @PostMapping
    public ResponseEntity<SkillRequestResponse> createRequest(@Valid @RequestBody SkillRequestCreateRequest req) {
        SkillRequest request = skillRequestService.createRequest(req.getSkillId(), req.getLearnerId(), req.getMessage());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toSkillRequestResponse(request));
    }

    @GetMapping
    public ResponseEntity<List<SkillRequestResponse>> getAllRequests() {
        return ResponseEntity.ok(skillRequestService.getAllRequests().stream()
                .map(mapper::toSkillRequestResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillRequestResponse> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toSkillRequestResponse(skillRequestService.getRequestById(id)));
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<SkillRequestResponse> acceptRequest(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toSkillRequestResponse(skillRequestService.acceptRequest(id)));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<SkillRequestResponse> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toSkillRequestResponse(skillRequestService.rejectRequest(id)));
    }

    @PatchMapping("/{id}/schedule")
    public ResponseEntity<SkillRequestResponse> scheduleSession(
            @PathVariable Long id, 
            @Valid @RequestBody SessionScheduleRequest req) {
        SkillRequest request = skillRequestService.scheduleSession(id, req.getMeetingLink(), req.getScheduledAt());
        return ResponseEntity.ok(mapper.toSkillRequestResponse(request));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<SkillRequestResponse> completeSession(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toSkillRequestResponse(skillRequestService.markAsCompleted(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        skillRequestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
