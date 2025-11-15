import { Routes, Route } from 'react-router';
import './styles/font.css';

import SyPage from './pages/sy/Sy.jsx';
import AdminPage from './pages/admin/Admin.jsx';
import ComponentTest from './pages/test/ComponentTest.jsx';
import ButtonTestPage from './pages/test/ButtonTestPage.jsx';
import BarTestPage from '@/pages/test/BarTestPage.jsx';
import { SearchIcon, SaveIcon, PlusIcon } from '@/assets/icons';
import SYClassRoomTable from './components/table/test/SYClassRoomTable.jsx';
import AdminEditClassRoomTable from './components/table/test/AdminEditClassRoomTable.jsx';
import ProfUndeterminedSubject from './components/table/test/ProfUndeterminedSubject.jsx';
import SYSearchTable from './components/table/test/SYSearchTable.jsx';
import Prof1stExamTable from './components/table/test/Prof1stExamTable.jsx';
import ModalTestPage from './pages/test/ModalTestPage.jsx';
import ModalTableTestPage from './pages/test/ModalTableTestPage.jsx';
import IconTestPage from './pages/test/IconTestPage.jsx';
import TableTestPage from './pages/test/TableTestPage.jsx';
import TimetableTest from './pages/test/TimetableTest.jsx';
import DepartmentListPage from './pages/admin/DepartmentListPage.jsx';
import DepartmentEditPage from './pages/admin/DepartmentEditPage.jsx';
import EmployeeModal from './pages/admin/EmployeeModal.jsx';
import ClassRoomModal from './pages/admin/ClassRoomModal.jsx';

import BuildingListPage from './pages/admin/BuildingListPage.jsx';
import BuildingEditPage from './pages/admin/BuildingEditPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route index element={<SyPage />} />
      <Route path='components' element={<ComponentTest />} />
      <Route path='buttontest' element={<ButtonTestPage />} />
      <Route path='bartest' element={<BarTestPage />} />
      <Route path='modaltest' element={<ModalTestPage />} />
      <Route path='modaltabletest' element={<ModalTableTestPage />} />
      <Route path='icontest' element={<IconTestPage />} />
      <Route path='tabletest' element={<TableTestPage />} />
      <Route path='bartest' element={<BarTestPage />} />
      <Route path='timetable' element={<TimetableTest />} />

      {/* Admin Pages */}
      <Route path='admin' element={<AdminPage />}>
        <Route path='department'>
          {/* /admin/department 진입 시 기본으로 목록 보여줌 */}
          <Route index element={<DepartmentListPage />} />
          <Route path='edit' element={<DepartmentEditPage />} />
          <Route path='edit/:id' element={<DepartmentEditPage />} />
        </Route>

        <Route path='building'>
          {/* /admin/building 진입 시 기본으로 목록 */}
          <Route index element={<BuildingListPage />} />
          <Route path='edit' element={<BuildingEditPage />} />
          <Route path='edit/:id' element={<BuildingEditPage />} />
        </Route>
      </Route>

      {/* Modal test */}
      <Route path='employeemodaltest' element={<EmployeeModal />} />
      <Route path='classroommodaltest' element={<ClassRoomModal />} />
    </Routes>
  );
}
