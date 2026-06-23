import { Navigate, Route, Routes } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import ProjectsManager from './ProjectsManager';
import ExperienceManager from './ExperienceManager';
import MessagesViewer from './MessagesViewer';

export default function AdminApp() {
  const { token, isAuthenticated, login, logout, invalidate, verifying, error } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} verifying={verifying} error={error} />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout onLogout={logout} />}>
        <Route index element={<Navigate to="projects" replace />} />
        <Route path="projects" element={<ProjectsManager token={token} onAuthError={invalidate} />} />
        <Route path="experience" element={<ExperienceManager token={token} onAuthError={invalidate} />} />
        <Route path="messages" element={<MessagesViewer token={token} onAuthError={invalidate} />} />
        <Route path="*" element={<Navigate to="projects" replace />} />
      </Route>
    </Routes>
  );
}
