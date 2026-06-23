package com.gnana.portfolio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String company;

    @NotBlank
    private String role;

    private LocalDate startDate;
    private LocalDate endDate; // null = present

    @ElementCollection
    @CollectionTable(name = "experience_bullets", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "bullet", length = 1000)
    @OrderColumn(name = "position")
    private List<String> bullets = new ArrayList<>();

    @Column(nullable = false)
    private Integer displayOrder = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public List<String> getBullets() { return bullets; }
    public void setBullets(List<String> bullets) { this.bullets = bullets; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
