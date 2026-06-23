import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PortfolioSite from './PortfolioSite';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<PortfolioSite />} />
      </Routes>
    </BrowserRouter>
  );
}
