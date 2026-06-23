import { useEffect, useState } from 'react';
import { api, adminApi } from '../api/client';
import './admin.css';

const EMPTY_FORM = {
  id: null,
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  bullets: '',
  displayOrder: 0,
};

function toFormState(exp) {
  return {
    id: exp.id,
    company: exp.company || '',
    role: exp.role || '',
    startDate: exp.startDate ? exp.startDate.slice(0, 10) : '',
    endDate: exp.endDate ? exp.endDate.slice(0, 10) : '',
    bullets: (exp.bullets || []).join('\n'),
    displayOrder: exp.displayOrder ?? 0,
  };
}

function toPayload(form) {
  return {
    company: form.company.trim(),
    role: form.role.trim(),
    startDate: form.startDate || null,
    endDate: form.endDate || null, // empty = current role
    bullets: form.bullets.split('\n').map((s) => s.trim()).filter(Boolean),
    displayOrder: Number(form.displayOrder) || 0,
  };
}

export default function ExperienceManager({ token, onAuthError }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isEditing = form.id !== null;

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getExperiences();
      setExperiences(data);
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
        const data = await api.getExperiences();
        if (!cancelled) setExperiences(data);
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

  const handleEdit = (exp) => {
    setForm(toFormState(exp));
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
        await adminApi.updateExperience(token, form.id, payload);
        setFeedback({ type: 'success', text: 'Experience updated.' });
      } else {
        await adminApi.createExperience(token, payload);
        setFeedback({ type: 'success', text: 'Experience created.' });
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
    if (!window.confirm('Delete this experience entry? This cannot be undone.')) return;
    try {
      await adminApi.deleteExperience(token, id);
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
          <h1 className="admin-page__title mono">Experience</h1>
        </div>
        <button className="btn btn--ghost" onClick={handleNew}>
          + New entry
        </button>
      </div>

      <div className="admin-page__grid">
        <div className="admin-list">
          {loading ? (
            <p className="admin-empty mono">loading…</p>
          ) : experiences.length === 0 ? (
            <p className="admin-empty mono">no experience entries yet</p>
          ) : (
            experiences.map((exp) => (
              <div className={`admin-list-item${form.id === exp.id ? ' admin-list-item--active' : ''}`} key={exp.id}>
                <div className="admin-list-item__main" onClick={() => handleEdit(exp)}>
                  <span className="admin-list-item__title">{exp.role} — {exp.company}</span>
                  <span className="admin-list-item__meta mono">
                    {exp.startDate?.slice(0, 10) || '—'} → {exp.endDate ? exp.endDate.slice(0, 10) : 'present'}
                  </span>
                </div>
                <button className="admin-list-item__delete mono" onClick={() => handleDelete(exp.id)}>
                  delete
                </button>
              </div>
            ))
          )}
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <h2 className="admin-form__heading mono">{isEditing ? `Editing: ${form.role}` : 'New entry'}</h2>

          <div className="admin-field-row">
            <div className="admin-field">
              <label className="mono">company</label>
              <input name="company" value={form.company} onChange={handleChange} required />
            </div>
            <div className="admin-field">
              <label className="mono">role</label>
              <input name="role" value={form.role} onChange={handleChange} required />
            </div>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label className="mono">start date</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
            </div>
            <div className="admin-field">
              <label className="mono">end date (blank = present)</label>
              <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
            </div>
          </div>

          <div className="admin-field">
            <label className="mono">bullets (one per line)</label>
            <textarea name="bullets" rows={6} value={form.bullets} onChange={handleChange} />
          </div>

          <div className="admin-field">
            <label className="mono">display order</label>
            <input name="displayOrder" type="number" value={form.displayOrder} onChange={handleChange} />
          </div>

          <div className="admin-form__actions">
            <button className="btn btn--primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create entry'}
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
