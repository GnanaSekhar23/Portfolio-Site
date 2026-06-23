import { useEffect, useState } from 'react';
import './Nav.css';

const LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand mono">
          gnana<span className="nav__brand-dot">.</span>dev
        </a>

        <nav className="nav__links">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav__link mono">
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="btn btn--primary nav__cta">
          Let's talk
        </a>

        <button
          className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="nav__mobile">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav__mobile-link mono" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn btn--primary" onClick={() => setOpen(false)}>
            Let's talk
          </a>
        </div>
      )}
    </header>
  );
}
