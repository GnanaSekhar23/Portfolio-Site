import './Experience.css';

function formatRange(start, end) {
  const opts = { year: 'numeric', month: 'short' };
  const startLabel = start ? new Date(start).toLocaleDateString('en-US', opts) : '';
  const endLabel = end ? new Date(end).toLocaleDateString('en-US', opts) : 'Present';
  return `${startLabel} — ${endLabel}`;
}

export default function Experience({ experiences, loading, error }) {
  return (
    <section className="experience" id="experience">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">release history</span>
          <h2 className="section-title">Experience</h2>
          <p className="section-sub">Each role, like a release: what shipped, and what it moved.</p>
        </div>

        {error && (
          <p className="projects__notice mono">live data unavailable — showing cached snapshot</p>
        )}

        <div className="timeline">
          {loading
            ? [0, 1, 2].map((i) => <div className="timeline-card timeline-card--skeleton" key={i} />)
            : experiences.map((exp) => (
                <div className="timeline-row" key={exp.id}>
                  <div className="timeline-row__rail">
                    <span className="timeline-row__node" />
                    <span className="timeline-row__line" />
                  </div>
                  <div className="timeline-card">
                    <div className="timeline-card__meta">
                      <span className="timeline-card__range mono">{formatRange(exp.startDate, exp.endDate)}</span>
                      {!exp.endDate && <span className="status-pill status-pill--live">current</span>}
                    </div>
                    <h3 className="timeline-card__role">{exp.role}</h3>
                    <p className="timeline-card__company mono">{exp.company}</p>
                    <ul className="timeline-card__bullets">
                      {exp.bullets?.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
