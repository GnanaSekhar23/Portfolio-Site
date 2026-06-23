import { useEffect, useState } from 'react';
import { api, adminApi } from '../api/client';
import './admin.css';

const EMPTY_FORM = {
  id: null,
  title: '',
  description: '',
  techStack: '',
  highlights: '',
  repoUrl: '',
  liveUrl: '',
  status: 'live',
  displayOrder: 0,
};

function toFormState(project) {
  return {
    id: project.id,
    title: project.title || '',
    description: project.description || '',
    techStack: (project.techStack || []).join(', '),
    highlights: (project.highlights || []).join('\n'),
    repoUrl: project.repoUrl || '',
    liveUrl: project.liveUrl || '',
    status: project.status || 'live',
    displayOrder: project.displayOrder ?? 0,
  };
}

function toPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
    highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
    repoUrl: form.repoUrl.trim() || null,
    liveUrl: form.liveUrl.trim() || null,
    status: form.status,
    displayOrder: Number(form.displayOrder) || 0,
  };
}

export default function ProjectsManager({ token, onAuthError }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', text }

  const isEditing = form.id !== null;

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.getProjects();
        if (!cancelled) setProjects(data);
      } catch (err) {
        if (!cancelled) setFeedback({ type: 'error', text: err.message });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEdit = (project) => {
    setForm(toFormState(project));
    setFeedback(null);
  };

  const handleNew = () => {
    setForm(EMPTY_FORM);
    setFeedback(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const payload = toPayload(form);
      if (isEditing) {
        await adminApi.updateProject(token, form.id, payload);
        setFeedback({ type: 'success', text: 'Project updated.' });
      } else {
        await adminApi.createProject(token, payload);
        setFeedback({ type: 'success', text: 'Project created.' });
      }
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      if (err.status === 401) {
        onAuthError(err.message);
        return;
      }
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      await adminApi.deleteProject(token, id);
      if (form.id === id) setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      if (err.status === 401) {
        onAuthError(err.message);
        return;
      }
      setFeedback({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <span className="eyebrow">content</span>
          <h1 className="admin-page__title mono">Projects</h1>
        </div>
        <button className="btn btn--ghost" onClick={handleNew}>
          + New project
        </button>
      </div>

      <div className="admin-page__grid">
        <div className="admin-list">
          {loading ? (
            <p className="admin-empty mono">loading…</p>
          ) : projects.length === 0 ? (
            <p className="admin-empty mono">no projects yet</p>
          ) : (
            projects.map((project) => (
              <div className={`admin-list-item${form.id === project.id ? ' admin-list-item--active' : ''}`} key={project.id}>
                <div className="admin-list-item__main" onClick={() => handleEdit(project)}>
                  <span className="admin-list-item__title">{project.title}</span>
                  <span className="admin-list-item__meta mono">{project.status} · order {project.displayOrder}</span>
                </div>
                <button className="admin-list-item__delete mono" onClick={() => handleDelete(project.id)}>
                  delete
                </button>
              </div>
            ))
          )}
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <h2 className="admin-form__heading mono">{isEditing ? `Editing: ${form.title}` : 'New project'}</h2>

          <div className="admin-field">
            <label className="mono">title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="admin-field">
            <label className="mono">description</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} required />
          </div>

          <div className="admin-field">
            <label className="mono">tech stack (comma-separated)</label>
            <input name="techStack" value={form.techStack} onChange={handleChange} placeholder="React, Spring Boot, PostgreSQL" />
          </div>

          <div className="admin-field">
            <label className="mono">highlights (one per line)</label>
            <textarea name="highlights" rows={5} value={form.highlights} onChange={handleChange} />
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label className="mono">repo url</label>
              <input name="repoUrl" value={form.repoUrl} onChange={handleChange} placeholder="https://github.com/..." />
            </div>
            <div className="admin-field">
              <label className="mono">live url</label>
              <input name="liveUrl" value={form.liveUrl} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label className="mono">status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="live">live</option>
                <option value="in-progress">in-progress</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="mono">display order</label>
              <input name="displayOrder" type="number" value={form.displayOrder} onChange={handleChange} />
            </div>
          </div>

          <div className="admin-form__actions">
            <button className="btn btn--primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create project'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn--ghost" onClick={handleNew}>
                Cancel
              </button>
            )}
          </div>

          {feedback && (
            <p className={`admin-feedback mono admin-feedback--${feedback.type}`}>
              {feedback.type === 'success' ? '✓' : '✕'} {feedback.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
