import './Projects.css';

const STATUS_LABEL = {
  live: 'live',
  'in-progress': 'in progress',
  archived: 'archived',
};

export default function Projects({ projects, loading, error }) {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">deployed services</span>
          <h2 className="section-title">Projects</h2>
          <p className="section-sub">
            Things I've built end to end — backend, frontend, infra, and the deploy pipeline in between.
          </p>
        </div>

        {error && (
          <p className="projects__notice mono">
            live data unavailable — showing cached snapshot
          </p>
        )}

        {loading ? (
          <div className="projects__grid">
            {[0, 1].map((i) => (
              <div className="project-card project-card--skeleton" key={i} />
            ))}
          </div>
        ) : (
          <div className="projects__grid">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-card__header">
                  <span className={`status-pill status-pill--${project.status}`}>
                    <span className="status-pill__dot" />
                    {STATUS_LABEL[project.status] || project.status}
                  </span>
                  <div className="project-card__links">
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noreferrer" className="icon-link" aria-label="View source code">
                        source
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="icon-link" aria-label="View live demo">
                        demo
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>

                <ul className="project-card__highlights">
                  {project.highlights?.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>

                <div className="project-card__stack">
                  {project.techStack?.map((tech) => (
                    <span className="tech-tag mono" key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
