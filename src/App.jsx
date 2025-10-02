import { Routes, Route } from 'react-router';
import './styles/font.css';

import SyPage from './pages/sy/Sy.jsx';
import AdminHomePage from './pages/admin/Home.jsx';
import ComponentTest from './pages/test/ComponentTest.jsx';
import ButtonTestPage from './pages/test/ButtonTestPage.jsx';
import ComponentTest from './pages/ComponentTest.jsx';
import { SearchIcon, SaveIcon, PlusIcon } from '@/assets/icons';
import SY_ClassRoomTable from './components/table/SY_ClassRoomTable.jsx';
import Admin_EditClassRoomTable from './components/table/Admin_EditClassRoomTable.jsx';
import Prof_UndeterminedSubject from './components/table/Prof_UndeterminedSubject.jsx';
import SY_SearchTable from './components/table/SY_SearchTable.jsx';
import Prof_1stExamTable from './components/table/Prof_1stExamTable.jsx';

export default function App() {
  return (
    <Routes>
      <Route index element={<SyPage />} />
      <Route path='admin' element={<AdminHomePage />} />
      <Route path='components' element={<ComponentTest />} />
      <Route path='buttontest' element={<ButtonTestPage />} />
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
              <SY_ClassRoomTable />
            </div>
            <div className='w-[1120px]'>
              <Admin_EditClassRoomTable />
            </div>
            <div className='w-[1100px]'>
              <Prof_UndeterminedSubject />
            </div>
            <div>
              <SY_SearchTable />
            </div>
            <div className='w-[1300px]'>
              <Prof_1stExamTable />
            </div>
          </div>
        }
      />
    </Routes>
  );
}
