import { useState } from 'react';
import { api } from '../api/client';
import './Contact.css';

const INITIAL_FORM = { name: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await api.submitContact(form);
      setStatus('sent');
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container contact__inner">
        <div className="section-head contact__head">
          <span className="eyebrow">open connection</span>
          <h2 className="section-title">Get in touch</h2>
          <p className="section-sub">
            Hiring, collaborating, or just want to talk shop about query optimization — send a message
            and it lands straight in my inbox.
          </p>

          <dl className="contact__direct">
            <div>
              <dt className="mono">email</dt>
              <dd>
                <a href="mailto:gnanasekharchandra@gmail.com">gnanasekharchandra@gmail.com</a>
              </dd>
            </div>
            <div>
              <dt className="mono">phone</dt>
              <dd>+1 425 471 0590</dd>
            </div>
          </dl>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field__label mono" htmlFor="name">
              name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Ada Lovelace"
              disabled={status === 'sending'}
            />
          </div>

          <div className="field">
            <label className="field__label mono" htmlFor="email">
              email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              disabled={status === 'sending'}
            />
          </div>

          <div className="field">
            <label className="field__label mono" htmlFor="message">
              message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me what you're building..."
              disabled={status === 'sending'}
            />
          </div>

          <button className="btn btn--primary contact__submit" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'sent' && (
            <p className="contact__feedback contact__feedback--success mono">
              ✓ message sent — I'll reply soon
            </p>
          )}
          {status === 'error' && (
            <p className="contact__feedback contact__feedback--error mono">✕ {errorMsg}</p>
          )}
        </form>
      </div>
    </section>
  );
}
