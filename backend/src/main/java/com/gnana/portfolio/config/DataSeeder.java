package com.gnana.portfolio.config;

import com.gnana.portfolio.model.Experience;
import com.gnana.portfolio.model.Project;
import com.gnana.portfolio.repository.ExperienceRepository;
import com.gnana.portfolio.repository.ProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;

    public DataSeeder(ProjectRepository projectRepository, ExperienceRepository experienceRepository) {
        this.projectRepository = projectRepository;
        this.experienceRepository = experienceRepository;
    }

    @Override
    public void run(String... args) {
        if (projectRepository.count() == 0) {
            seedProjects();
        }
        if (experienceRepository.count() == 0) {
            seedExperiences();
        }
    }

    private void seedProjects() {
        Project p1 = new Project();
        p1.setTitle("AI-Powered Job Application Automation Platform");
        p1.setDescription("Full-stack automation platform that uses GPT-4 and LangChain to generate ATS-optimized resumes and apply to jobs automatically. Built end-to-end, from a Chrome extension to the Azure deployment.");
        p1.setTechStack(List.of("Spring Boot", "React", "PostgreSQL", "Azure", "GPT-4", "LangChain", "Apify"));
        p1.setHighlights(List.of(
                "Generates ATS-optimized resumes with a 92% success rate, processing 100+ job applications daily",
                "Chrome extension (MV3) with OAuth 2.0 auth and Apify-powered job scraping from Indeed",
                "Microservices deployed on Azure App Service and Container Instances, serving 10K+ monthly users",
                "LaTeX/Tectonic resume pipeline with automated PDF compilation, cutting manual resume creation time by 85%"
        ));
        p1.setStatus("live");
        p1.setDisplayOrder(0);
        projectRepository.save(p1);

        Project p2 = new Project();
        p2.setTitle("Data Analysis Agent with Natural Language Querying");
        p2.setDescription("An AI agent that lets non-technical users query a production database in plain English instead of writing SQL, with a dashboard for visualizing the results.");
        p2.setTechStack(List.of("Python", "LangGraph", "FastAPI", "React", "PostgreSQL"));
        p2.setHighlights(List.of(
                "Natural language to SQL with 92% accuracy, cutting query time from 5 minutes to 10 seconds",
                "React dashboard with real-time visualization and query history",
                "Query validation layer preventing malformed SQL execution — 100% data integrity maintained"
        ));
        p2.setStatus("live");
        p2.setDisplayOrder(1);
        projectRepository.save(p2);
    }

    private void seedExperiences() {
        Experience e1 = new Experience();
        e1.setCompany("Dataqrypt LLC");
        e1.setRole("Software Engineer");
        e1.setStartDate(LocalDate.of(2026, 1, 1));
        e1.setEndDate(null); // present
        e1.setBullets(List.of(
                "Designed and deployed a microservices architecture on Spring Boot handling 10,000+ daily API requests with sub-second latency and 99.9% uptime for 500+ concurrent users",
                "Optimized database queries with Spring Data JPA and Hibernate, improving response times by 30% and cutting infrastructure costs by an estimated 20% monthly",
                "Architected the CI/CD pipeline and an automated testing framework, reducing production bugs by 45% and enabling daily deployments with zero critical incidents"
        ));
        e1.setDisplayOrder(0);
        experienceRepository.save(e1);

        Experience e2 = new Experience();
        e2.setCompany("University of Houston");
        e2.setRole("Graduate Assistant");
        e2.setStartDate(LocalDate.of(2024, 8, 1));
        e2.setEndDate(LocalDate.of(2025, 12, 1));
        e2.setBullets(List.of(
                "Built 3 production Spring Boot applications cutting housing operations processing time by 40% for 5,000+ students, with 99.9% uptime and zero critical issues",
                "Optimized PostgreSQL queries by 35% through JPA/Hibernate mapping refinement, protecting 12,000+ student records with full compliance to university IT security standards",
                "Architected 10+ RESTful API endpoints for real-time data sync, cutting data entry errors by 99% and improving adoption by 80% in the first semester",
                "Designed automated CI/CD pipelines, reducing deployment time from 2 hours to 15 minutes across 5+ weekly releases with zero downtime"
        ));
        e2.setDisplayOrder(1);
        experienceRepository.save(e2);

        Experience e3 = new Experience();
        e3.setCompany("Indium Software");
        e3.setRole("Software Engineer Intern");
        e3.setStartDate(LocalDate.of(2023, 2, 1));
        e3.setEndDate(LocalDate.of(2023, 5, 1));
        e3.setBullets(List.of(
                "Delivered 5 production Spring Boot applications serving 2,000+ users at 99.8% uptime, with 20+ secure RESTful APIs using JWT authentication",
                "Built responsive React.js UI components across 8 client projects with cross-browser compatibility and accessibility standards",
                "Caught and resolved 50+ pre-production defects, improving code quality by 25% and cutting defect escape rate by 15%"
        ));
        e3.setDisplayOrder(2);
        experienceRepository.save(e3);
    }
}
