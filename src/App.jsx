import { Routes, Route } from 'react-router';
import './styles/font.css';

import SyPage from './pages/sy/Sy.jsx';
import AdminHomePage from './pages/admin/Home.jsx';
import ComponentTest from './pages/test/ComponentTest.jsx';
import ButtonTestPage from './pages/test/ButtonTestPage.jsx';
import IconTestPage from './pages/test/IconTestPage.jsx';
import TableTestPage from './pages/test/TableTestPage.jsx';
import BarTestPage from './pages/test/BarTestPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route index element={<SyPage />} />
      <Route path='admin' element={<AdminHomePage />} />
      <Route path='components' element={<ComponentTest />} />
      <Route path='buttontest' element={<ButtonTestPage />} />
      <Route path='icontest' element={<IconTestPage />} />
      <Route path='tabletest' element={<TableTestPage />} />
      <Route path='bartest' element={<BarTestPage />} />
    </Routes>
  );
}
