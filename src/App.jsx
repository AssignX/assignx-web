import { Routes, Route } from 'react-router';
import './styles/reset.css';
import './styles/font.css';

import SyPage from './pages/sy/Sy.jsx';
import AdminHomePage from './pages/admin/Home.jsx';

export default function App() {
  return (
    <Routes>
      <Route index element={<SyPage />} />
      <Route path='admin'>
        <Route index element={<AdminHomePage />} />
      </Route>
    </Routes>
  );
}
