import { NavLink, Outlet } from 'react-router-dom';
import './admin.css';

const NAV_ITEMS = [
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/messages', label: 'Messages' },
];

export default function AdminLayout({ onLogout }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand mono">
          gnana<span className="nav__brand-dot">.</span>dev
          <span className="admin-sidebar__tag mono">/admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-sidebar__link mono${isActive ? ' admin-sidebar__link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <a className="admin-sidebar__link mono" href="/" target="_blank" rel="noreferrer">
            View live site ↗
          </a>
          <button className="admin-sidebar__logout mono" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
