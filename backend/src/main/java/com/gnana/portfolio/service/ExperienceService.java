package com.gnana.portfolio.service;

import com.gnana.portfolio.exception.ResourceNotFoundException;
import com.gnana.portfolio.model.Experience;
import com.gnana.portfolio.repository.ExperienceRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    public List<Experience> findAll() {
        return experienceRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Experience findById(Long id) {
        return experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id " + id));
    }

    public Experience create(Experience experience) {
        return experienceRepository.save(experience);
    }

    public Experience update(Long id, Experience updated) {
        Experience existing = findById(id);
        existing.setCompany(updated.getCompany());
        existing.setRole(updated.getRole());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());

        // See ProjectService.update for why this mutates in place rather
        // than calling existing.setBullets(updated.getBullets()) directly.
        existing.getBullets().clear();
        existing.getBullets().addAll(orEmpty(updated.getBullets()));

        existing.setDisplayOrder(updated.getDisplayOrder());
        return experienceRepository.save(existing);
    }

    public void delete(Long id) {
        Experience existing = findById(id);
        experienceRepository.delete(existing);
    }

    private static List<String> orEmpty(List<String> list) {
        return list != null ? list : Collections.emptyList();
    }
}
