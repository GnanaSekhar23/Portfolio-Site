import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="mono footer__line">
          <span className="footer__dot" /> gnana.dev — built with Spring Boot &amp; React
        </span>
        <div className="footer__links">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="mailto:gnanasekharchandra@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  );
}
