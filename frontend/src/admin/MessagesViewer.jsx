import { useEffect, useState } from 'react';
import { adminApi } from '../api/client';
import './admin.css';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function MessagesViewer({ token, onAuthError }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.getMessages(token);
      setMessages(data);
    } catch (err) {
      if (err.status === 401) {
        onAuthError(err.message);
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await adminApi.getMessages(token);
        if (!cancelled) setMessages(data);
      } catch (err) {
        if (cancelled) return;
        if (err.status === 401) {
          onAuthError(err.message);
          return;
        }
        setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, onAuthError]);

  const toggleRead = async (msg) => {
    try {
      await adminApi.markMessageRead(token, msg.id, !msg.read);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m)));
    } catch (err) {
      if (err.status === 401) {
        onAuthError(err.message);
        return;
      }
      setError(err.message);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <span className="eyebrow">inbox</span>
          <h1 className="admin-page__title mono">
            Messages {unreadCount > 0 && <span className="admin-badge mono">{unreadCount} unread</span>}
          </h1>
        </div>
        <button className="btn btn--ghost" onClick={load}>
          Refresh
        </button>
      </div>

      {error && <p className="admin-feedback admin-feedback--error mono">✕ {error}</p>}

      {loading ? (
        <p className="admin-empty mono">loading…</p>
      ) : messages.length === 0 ? (
        <p className="admin-empty mono">no messages yet</p>
      ) : (
        <div className="admin-messages">
          {messages.map((msg) => (
            <div className={`admin-message${msg.read ? '' : ' admin-message--unread'}`} key={msg.id}>
              <div className="admin-message__header">
                <div>
                  <span className="admin-message__name">{msg.name}</span>
                  <a className="admin-message__email mono" href={`mailto:${msg.email}`}>
                    {msg.email}
                  </a>
                </div>
                <span className="admin-message__date mono">{formatDate(msg.submittedAt)}</span>
              </div>
              <p className="admin-message__body">{msg.message}</p>
              <button className="admin-message__toggle mono" onClick={() => toggleRead(msg)}>
                mark as {msg.read ? 'unread' : 'read'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
