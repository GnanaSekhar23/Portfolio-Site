// Fallback content mirrors the seeded backend data. Used only if the live
// API is unreachable (e.g. a free-tier instance cold-starting), so the site
// never shows a blank or broken section.

export const fallbackProjects = [
  {
    id: 'fallback-1',
    title: 'AI-Powered Job Application Automation Platform',
    description:
      'Full-stack automation platform that uses GPT-4 and LangChain to generate ATS-optimized resumes and apply to jobs automatically. Built end-to-end, from a Chrome extension to the Azure deployment.',
    techStack: ['Spring Boot', 'React', 'PostgreSQL', 'Azure', 'GPT-4', 'LangChain', 'Apify'],
    highlights: [
      'Generates ATS-optimized resumes with a 92% success rate, processing 100+ job applications daily',
      'Chrome extension (MV3) with OAuth 2.0 auth and Apify-powered job scraping from Indeed',
      'Microservices deployed on Azure App Service and Container Instances, serving 10K+ monthly users',
      'LaTeX/Tectonic resume pipeline with automated PDF compilation, cutting manual resume creation time by 85%',
    ],
    status: 'live',
  },
  {
    id: 'fallback-2',
    title: 'Data Analysis Agent with Natural Language Querying',
    description:
      'An AI agent that lets non-technical users query a production database in plain English instead of writing SQL, with a dashboard for visualizing the results.',
    techStack: ['Python', 'LangGraph', 'FastAPI', 'React', 'PostgreSQL'],
    highlights: [
      'Natural language to SQL with 92% accuracy, cutting query time from 5 minutes to 10 seconds',
      'React dashboard with real-time visualization and query history',
      'Query validation layer preventing malformed SQL execution — 100% data integrity maintained',
    ],
    status: 'live',
  },
];

export const fallbackExperiences = [
  {
    id: 'fallback-e1',
    company: 'Dataqrypt LLC',
    role: 'Software Engineer',
    startDate: '2026-01-01',
    endDate: null,
    bullets: [
      'Designed and deployed a microservices architecture on Spring Boot handling 10,000+ daily API requests with sub-second latency and 99.9% uptime for 500+ concurrent users',
      'Optimized database queries with Spring Data JPA and Hibernate, improving response times by 30% and cutting infrastructure costs by an estimated 20% monthly',
      'Architected the CI/CD pipeline and an automated testing framework, reducing production bugs by 45% and enabling daily deployments with zero critical incidents',
    ],
  },
  {
    id: 'fallback-e2',
    company: 'University of Houston',
    role: 'Graduate Assistant',
    startDate: '2024-08-01',
    endDate: '2025-12-01',
    bullets: [
      'Built 3 production Spring Boot applications cutting housing operations processing time by 40% for 5,000+ students, with 99.9% uptime and zero critical issues',
      'Optimized PostgreSQL queries by 35% through JPA/Hibernate mapping refinement, protecting 12,000+ student records with full compliance to university IT security standards',
      'Architected 10+ RESTful API endpoints for real-time data sync, cutting data entry errors by 99% and improving adoption by 80% in the first semester',
      'Designed automated CI/CD pipelines, reducing deployment time from 2 hours to 15 minutes across 5+ weekly releases with zero downtime',
    ],
  },
  {
    id: 'fallback-e3',
    company: 'Indium Software',
    role: 'Software Engineer Intern',
    startDate: '2023-02-01',
    endDate: '2023-05-01',
    bullets: [
      'Delivered 5 production Spring Boot applications serving 2,000+ users at 99.8% uptime, with 20+ secure RESTful APIs using JWT authentication',
      'Built responsive React.js UI components across 8 client projects with cross-browser compatibility and accessibility standards',
      'Caught and resolved 50+ pre-production defects, improving code quality by 25% and cutting defect escape rate by 15%',
    ],
  },
];
