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
import ModalTestPage from './pages/test/ModalTestPage.jsx';
import ModalTableTestPage from './pages/test/ModalTableTestPage.jsx';
import IconTestPage from './pages/test/IconTestPage.jsx';
import TableTestPage from './pages/test/TableTestPage.jsx';
import TimetableTest from './pages/test/TimetableTest.jsx';
import SearchClassPage from './pages/office/SearchClassPage.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
import SearchProfessorPage from './pages/office/SearchProfessorPage.jsx';\
import SchedulePage from './pages/office/SchedulePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route index element={<SyPage />} />
      <Route path='admin' element={<AdminHomePage />} />
      <Route path='components' element={<ComponentTest />} />
      <Route path='buttontest' element={<ButtonTestPage />} />
      <Route path='bartest' element={<BarTestPage />} />
      <Route path='modaltest' element={<ModalTestPage />} />
      <Route path='modaltabletest' element={<ModalTableTestPage />} />
      <Route path='icontest' element={<IconTestPage />} />
      <Route path='tabletest' element={<TableTestPage />} />
      <Route path='bartest' element={<BarTestPage />} />
      <Route path='timetable' element={<TimetableTest />} />
      <Route path='office/classrooms' element={<SearchClassPage />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='office/professors' element={<SearchProfessorPage />} />
      <Route path='office/exam' element={<SchedulePage />} />
    </Routes>
  );
}
