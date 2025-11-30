import { Routes, Route } from 'react-router';
import './styles/font.css';

import SyPage from './pages/sy/Sy.jsx';

import LoginPage from './pages/login/LoginPage.jsx';

import SearchCoursePage from './pages/office/SearchCoursePage.jsx';
import SearchProfessorPage from './pages/office/SearchProfessorPage.jsx';
import SearchClassPage from './pages/office/SearchClassPage.jsx';
import SchedulePage from './pages/office/SchedulePage.jsx';
import ApproveExamPage from './pages/office/ApproveExamPage.jsx';

import CourseSchedulePage from './pages/professor/CourseSchedulePage.jsx';
import FirstApplicationPage from './pages/professor/FirstApplicationPage.jsx';
import SecondApplicationPage from './pages/professor/SecondApplicationPage.jsx';
import ExamStatusPage from './pages/professor/ExamStatusPage.jsx';

import DepartmentListPage from './pages/admin/DepartmentListPage.jsx';
import DepartmentEditPage from './pages/admin/DepartmentEditPage.jsx';
import BuildingListPage from './pages/admin/BuildingListPage.jsx';
import BuildingEditPage from './pages/admin/BuildingEditPage.jsx';

import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route index element={<SyPage />} />

      {/* Login Pages */}
      <Route path='login' element={<LoginPage />} />

      {/* Office Pages */}
      <Route path='office'>
        <Route index element={<SearchCoursePage />} />
        {/* 과목 목록 */}
        <Route path='courses' element={<SearchCoursePage />} />
        {/* 교수 목록 */}
        <Route path='professors' element={<SearchProfessorPage />} />
        {/* 강의실 목록 */}
        <Route path='classrooms' element={<SearchClassPage />} />
        {/* 시험 일정 조회 및 수정 */}
        <Route path='exam' element={<SchedulePage />} />
        <Route path='exam/approve/:id' element={<ApproveExamPage />} />
      </Route>

      {/* Professor Pages */}
      <Route path='professor'>
        <Route index element={<CourseSchedulePage />} />
        {/* 강의 조회 */}
        <Route path='schedule' element={<CourseSchedulePage />} />
        {/* 시험 신청 */}
        <Route path='first' element={<FirstApplicationPage />} />
        <Route path='second' element={<SecondApplicationPage />} />
        <Route path='status' element={<ExamStatusPage />} />
      </Route>

      {/* Admin Pages */}
      <Route path='admin'>
        <Route index element={<DepartmentListPage />} />
        {/* Department */}
        <Route path='department'>
          <Route index element={<DepartmentListPage />} />
          <Route path='edit' element={<DepartmentEditPage />} />
          <Route path='edit/:id' element={<DepartmentEditPage />} />
        </Route>
        {/* Building */}
        <Route path='building'>
          <Route index element={<BuildingListPage />} />
          <Route path='edit' element={<BuildingEditPage />} />
          <Route path='edit/:id' element={<BuildingEditPage />} />
        </Route>
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}
