import { Routes, Route } from 'react-router';
import './styles/reset.css';
import './styles/font.css';

import SyPage from './pages/sy/Sy.jsx';
import AdminHomePage from './pages/admin/Home.jsx';
import { SearchIcon, SaveIcon, PlusIcon } from '@/assets/icons';

export default function App() {
  return (
    <Routes>
      <Route index element={<SyPage />} />
      <Route path='admin' element={<AdminHomePage />} />
      <Route
        path='icontest'
        element={
          <div>
            <h1>icontest</h1>
            <SearchIcon width={40} height={40} />
            <SaveIcon width={40} height={40} />
            <PlusIcon width={40} height={40} />
          </div>
        }
      />
    </Routes>
  );
}
