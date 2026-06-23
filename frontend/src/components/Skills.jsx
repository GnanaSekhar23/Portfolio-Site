import './Skills.css';

const SKILL_GROUPS = [
  {
    label: 'backend',
    items: ['Java', 'Spring Boot', 'Spring Security', 'Spring Cloud', 'Spring Data JPA', 'Hibernate'],
  },
  {
    label: 'ai / ml',
    items: ['Python', 'LangGraph', 'LangChain', 'FastAPI', 'GPT-4 Integration', 'Prompt Engineering'],
  },
  {
    label: 'frontend',
    items: ['React.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'],
  },
  {
    label: 'data',
    items: ['PostgreSQL', 'MySQL', 'JPA/Hibernate ORM', 'Query Optimization'],
  },
  {
    label: 'cloud / devops',
    items: ['Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Maven', 'Git'],
  },
  {
    label: 'core competencies',
    items: ['Microservices', 'RESTful API Design', 'Performance Tuning', 'Agile', 'Code Architecture'],
  },
];

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">system inventory</span>
          <h2 className="section-title">Skills</h2>
          <p className="section-sub">What's currently installed and load-bearing.</p>
        </div>

        <div className="skills__grid">
          {SKILL_GROUPS.map((group) => (
            <div className="skill-group" key={group.label}>
              <h3 className="skill-group__label mono">{group.label}</h3>
              <div className="skill-group__items">
                {group.items.map((item) => (
                  <span className="tech-tag mono" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
