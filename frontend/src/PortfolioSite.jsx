import { useEffect, useState } from 'react';
import { api } from './api/client';
import { fallbackProjects, fallbackExperiences } from './api/fallbackData';

import Nav from './components/Nav';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function PortfolioSite() {
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [projectsData, experiencesData] = await Promise.all([
          api.getProjects(),
          api.getExperiences(),
        ]);
        if (cancelled) return;
        setProjects(projectsData?.length ? projectsData : fallbackProjects);
        setExperiences(experiencesData?.length ? experiencesData : fallbackExperiences);
      } catch {
        if (cancelled) return;
        setApiError(true);
        setProjects(fallbackProjects);
        setExperiences(fallbackExperiences);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects projects={projects} loading={loading} error={apiError} />
        <Experience experiences={experiences} loading={loading} error={apiError} />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
