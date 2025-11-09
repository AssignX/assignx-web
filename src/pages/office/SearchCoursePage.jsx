import { useState, useEffect, useMemo } from 'react';
import Layout from '@/pages/office/Layout';
import CourseSearchTable from './CourseSearchTable';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';
import PageHeader from '@/components/headers/PageHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from '@/components/ToggleSwitch';

export default function SearchCoursePage() {
  const [allCourses, setAllCourses] = useState([]); // 전체 데이터
  const [courses, setCourses] = useState([]); // 필터 적용된 데이터
  const [filters, setFilters] = useState({
    year: '2025',
    semester: '2',
    detailType: '',
    keyword: '',
  });
  const [toggleUnassigned, setToggleUnassigned] = useState(false);
  const { name, departmentName } = useAuthStore();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!accessToken) navigate('/login');
  }, [accessToken, navigate]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const { data } = await apiClient.get('/api/course/search');
        setAllCourses(data || []);
        setCourses(data || []);
      } catch (err) {
        console.error('전체 과목 목록 불러오기 실패:', err);
      }
    };
    fetchAllCourses();
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      console.warn('서버 로그아웃 실패 (클라이언트만 처리)');
    } finally {
      logout();
      navigate('/login');
    }
  };

  const handleSearch = () => {
    const { year, semester, detailType, keyword } = filters;

    let filtered = allCourses.filter((c) => {
      // 연도, 학기 기본 필터
      if (year && c.year !== year) return false;
      if (semester && c.semester !== semester) return false;

      // 상세검색
      if (keyword) {
        const k = keyword.trim().toLowerCase();
        if (detailType === '교과목명')
          return c.courseName?.toLowerCase().includes(k);
        if (detailType === '담당교수')
          return c.professorName?.toLowerCase().includes(k);
        if (detailType === '강좌번호')
          return c.courseCode?.toLowerCase().includes(k);
        // detailType 선택 안 한 경우 → 전체 텍스트 검색
        return (
          c.courseName?.toLowerCase().includes(k) ||
          c.professorName?.toLowerCase().includes(k) ||
          c.courseCode?.toLowerCase().includes(k)
        );
      }
      return true;
    });

    if (toggleUnassigned) {
      filtered = filtered.filter(
        (c) => !c.professorName || c.professorName.trim() === ''
      );
    }

    setCourses(filtered);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        size: 45,
        cell: ({ row }) => row.index + 1,
      },
      { accessorKey: 'year', header: '개설연도', size: 75 },
      { accessorKey: 'semester', header: '개설학기', size: 75 },
      { accessorKey: 'major', header: '개설학과', size: 100 },
      { accessorKey: 'courseCode', header: '강좌번호', size: 130 },
      { accessorKey: 'courseName', header: '교과목명', size: 130 },
      { accessorKey: 'professorName', header: '담당교수', size: 110 },
      { accessorKey: 'courseTime', header: '강의시간', size: 175 },
      { accessorKey: 'buildingName', header: '강의실', size: 175 },
      { accessorKey: 'enrolledCount', header: '정원', size: 50 },
    ],
    []
  );

  return (
    <Layout
      username={`${name ?? '사용자'} 님`}
      headerTitle={`${departmentName ?? ''} 메뉴`}
      onLogout={handleLogout}
      menus={[
        {
          title: '과목',
          isOpen: true,
          subItems: [
            { label: '과목 목록', path: '/office/courses', isSelected: true },
          ],
        },
        {
          title: '교수',
          subItems: [{ label: '교수 목록', path: '/office/professors' }],
        },
        {
          title: '강의실',
          subItems: [{ label: '강의실 목록', path: '/office/classrooms' }],
        },
        {
          title: '일정',
          subItems: [
            { label: '확정 목록', path: '/confirmed' },
            { label: '미확정 목록', path: '/unconfirmed' },
          ],
        },
      ]}
    >
      <div className='flex flex-col gap-y-5'>
        <div className='w-full'>
          <PageHeader title='과목 목록' />
          <CourseSearchTable
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
        </div>

        <div className='flex h-[764px] w-full flex-col gap-y-2.5 bg-white'>
          <div className='flex w-full items-center justify-end gap-2'>
            <span className='text-[16px]'>담당교수 미배정 과목</span>
            <ToggleSwitch
              checked={toggleUnassigned}
              onChange={setToggleUnassigned}
            />
          </div>
          <VerticalTable
            columns={columns}
            data={courses}
            selectable={true}
            singleSelect={true}
            headerHeight={32}
            maxHeight={670}
          />
        </div>
      </div>
    </Layout>
  );
}
