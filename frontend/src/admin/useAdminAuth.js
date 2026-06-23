import { useCallback, useState } from 'react';
import { adminApi } from '../api/client';

const STORAGE_KEY = 'portfolio_admin_token';

export function useAdminAuth() {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (candidateToken) => {
    setVerifying(true);
    setError('');
    try {
      await adminApi.verifyToken(candidateToken);
      sessionStorage.setItem(STORAGE_KEY, candidateToken);
      setToken(candidateToken);
      return true;
    } catch (err) {
      setError(err.message || 'Could not verify token.');
      return false;
    } finally {
      setVerifying(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken('');
  }, []);

  // Call this if a request made with the stored token comes back 401 —
  // e.g. the token was rotated on the backend after this session started.
  // Clears the stale token so the person is bounced back to the login screen
  // instead of staring at a dashboard that silently fails every request.
  const invalidate = useCallback((message) => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken('');
    setError(message || 'Your session is no longer valid. Please log in again.');
  }, []);

  return { token, isAuthenticated: Boolean(token), login, logout, invalidate, verifying, error };
}
