import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__panel">
          <div className="hero__panel-header">
            <span className="eyebrow">status: operational</span>
            <span className="hero__panel-id mono">svc-gnana-01</span>
          </div>

          <h1 className="hero__title">
            Gnana Sekhar
            <br />
            Chandra
          </h1>
          <p className="hero__role mono">software engineer / java &amp; spring boot / ai automation</p>

          <p className="hero__summary">
            I build backend systems that stay up and AI tools that ship. Most recently:
            microservices handling 10,000+ daily requests at 99.9% uptime, and an automation
            platform that writes and submits job applications on its own.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact">
              Get in touch
            </a>
            <a className="btn btn--ghost" href="#projects">
              View projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
