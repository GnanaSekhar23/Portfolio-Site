const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // response wasn't JSON — keep default message
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getProjects: () => request('/api/projects'),
  getExperiences: () => request('/api/experiences'),
  submitContact: (payload) =>
    request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

function adminRequest(path, token, options = {}) {
  return request(path, {
    ...options,
    headers: { 'X-Admin-Token': token, ...options.headers },
  });
}

export const adminApi = {
  // Used purely to verify a token is valid — any authed GET works for this.
  verifyToken: (token) => adminRequest('/api/admin/messages', token),

  // Projects
  createProject: (token, payload) =>
    adminRequest('/api/admin/projects', token, { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (token, id, payload) =>
    adminRequest(`/api/admin/projects/${id}`, token, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProject: (token, id) =>
    adminRequest(`/api/admin/projects/${id}`, token, { method: 'DELETE' }),

  // Experience
  createExperience: (token, payload) =>
    adminRequest('/api/admin/experiences', token, { method: 'POST', body: JSON.stringify(payload) }),
  updateExperience: (token, id, payload) =>
    adminRequest(`/api/admin/experiences/${id}`, token, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteExperience: (token, id) =>
    adminRequest(`/api/admin/experiences/${id}`, token, { method: 'DELETE' }),

  // Contact messages
  getMessages: (token) => adminRequest('/api/admin/messages', token),
  markMessageRead: (token, id, read) =>
    adminRequest(`/api/admin/messages/${id}/read`, token, {
      method: 'PATCH',
      body: JSON.stringify({ read }),
    }),
};

export { API_BASE };
