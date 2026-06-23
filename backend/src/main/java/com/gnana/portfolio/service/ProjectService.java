package com.gnana.portfolio.service;

import com.gnana.portfolio.exception.ResourceNotFoundException;
import com.gnana.portfolio.model.Project;
import com.gnana.portfolio.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> findAll() {
        return projectRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id));
    }

    public Project create(Project project) {
        return projectRepository.save(project);
    }

    public Project update(Long id, Project updated) {
        Project existing = findById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());

        // Mutate the managed collections in place rather than calling
        // setTechStack/setHighlights with a brand-new list. Hibernate wraps
        // @ElementCollection fields in its own PersistentList to track
        // ordering and orphan removal; swapping in a plain ArrayList from
        // the deserialized request body breaks that tracking and causes a
        // flush-time failure (surfaces to the client as a 500).
        existing.getTechStack().clear();
        existing.getTechStack().addAll(orEmpty(updated.getTechStack()));

        existing.getHighlights().clear();
        existing.getHighlights().addAll(orEmpty(updated.getHighlights()));

        existing.setRepoUrl(updated.getRepoUrl());
        existing.setLiveUrl(updated.getLiveUrl());
        existing.setStatus(updated.getStatus());
        existing.setDisplayOrder(updated.getDisplayOrder());
        return projectRepository.save(existing);
    }

    public void delete(Long id) {
        Project existing = findById(id);
        projectRepository.delete(existing);
    }

    private static List<String> orEmpty(List<String> list) {
        return list != null ? list : Collections.emptyList();
    }
}
