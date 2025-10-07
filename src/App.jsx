import { Routes, Route } from 'react-router';
import './styles/font.css';

import SyPage from './pages/sy/Sy.jsx';
import AdminHomePage from './pages/admin/Home.jsx';
import ComponentTest from './pages/test/ComponentTest.jsx';
import ButtonTestPage from './pages/test/ButtonTestPage.jsx';
import BarTestPage from '@/pages/test/BarTestPage.jsx';
import { SearchIcon, SaveIcon, PlusIcon } from '@/assets/icons';
import SYClassRoomTable from './components/table/test/SYClassRoomTable.jsx';
import AdminEditClassRoomTable from './components/table/test/AdminEditClassRoomTable.jsx';
import ProfUndeterminedSubject from './components/table/test/ProfUndeterminedSubject.jsx';
import SYSearchTable from './components/table/test/SYSearchTable.jsx';
import Prof1stExamTable from './components/table/test/Prof1stExamTable.jsx';

export default function App() {
  return (
    <Routes>
      <Route index element={<SyPage />} />
      <Route path='admin' element={<AdminHomePage />} />
      <Route path='components' element={<ComponentTest />} />
      <Route path='buttontest' element={<ButtonTestPage />} />
      <Route path='bartest' element={<BarTestPage />} />
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
      <Route
        path='tabletest'
        element={
          <div>
            <h1>tabletest</h1>
            <div className='w-[500px]'>
              <SYClassRoomTable />
            </div>
            <div className='w-[1120px]'>
              <AdminEditClassRoomTable />
            </div>
            <div className='w-[1100px]'>
              <ProfUndeterminedSubject />
            </div>
            <div>
              <SYSearchTable />
            </div>
            <div className='w-[1300px]'>
              <Prof1stExamTable />
            </div>
          </div>
        }
      />
    </Routes>
  );
}
