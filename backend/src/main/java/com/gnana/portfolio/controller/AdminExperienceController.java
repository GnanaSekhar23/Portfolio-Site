package com.gnana.portfolio.controller;

import com.gnana.portfolio.model.Experience;
import com.gnana.portfolio.service.ExperienceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/experiences")
public class AdminExperienceController {

    private final ExperienceService experienceService;

    public AdminExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    @PostMapping
    public ResponseEntity<Experience> createExperience(@Valid @RequestBody Experience experience) {
        return ResponseEntity.ok(experienceService.create(experience));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long id, @Valid @RequestBody Experience experience) {
        return ResponseEntity.ok(experienceService.update(id, experience));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        experienceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
