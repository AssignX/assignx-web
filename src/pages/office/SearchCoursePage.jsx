import { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@/components/Layout';
import CourseSearchTable from './CourseSearchTable';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';
import PageHeader from '@/components/headers/PageHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from '@/components/ToggleSwitch';
import Button from '@/components/buttons/Button';
import ProfessorMappingModal from './ProfessorMappingModal';
import { TriangleAlertIcon } from '@/assets/icons/index.js';
import TableWrapper from '@/components/layout/TableWrapper';

export default function SearchCoursePage() {
  const [allCourses, setAllCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const getDefaultSemester = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 6) return '1';
    if (month >= 9) return '2';
    return '1';
  };

  const [filters, setFilters] = useState({
    year: '2025',
    semester: getDefaultSemester(),
    detailType: '',
    keyword: '',
  });
  const [toggleUnassigned, setToggleUnassigned] = useState(false);

  const { name } = useAuthStore();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [resetSelection, setResetSelection] = useState(false);
  const [modalMetaInfo, setModalMetaInfo] = useState(null);

  const handleMappingClick = () => {
    if (!selectedCourse) {
      alert('과목을 선택하세요.');
      return;
    }

    if (selectedCourse.isProfessorMapped) {
      alert('이미 담당 교수가 배정된 과목입니다.');
      return;
    }

    setModalMetaInfo({
      year: selectedCourse.year,
      courseCode: selectedCourse.courseCode,
      courseId: selectedCourse.courseId,
      courseName: selectedCourse.courseName,
      professorName: selectedCourse.professorName,
      major: selectedCourse.major,
      courseTime: selectedCourse.courseTime,
    });

    setIsMappingModalOpen(true);
  };

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

  const refreshCourses = async () => {
    try {
      const { data } = await apiClient.get('/api/course/search');
      setAllCourses(data || []);
      applyFilter(data || []);

      setSelectedCourse(null);
      setResetSelection((prev) => !prev);
    } catch (err) {
      console.error('과목 목록 새로고침 실패:', err);
    }
  };

  const applyFilter = useCallback(
    (source) => {
      const { year, semester, detailType, keyword } = filters;

      let filtered = source.filter((c) => {
        if (year && c.year !== year) return false;
        if (semester && c.semester !== semester) return false;

        if (keyword) {
          const k = keyword.trim().toLowerCase();
          if (detailType === '교과목명')
            return c.courseName?.toLowerCase().includes(k);
          if (detailType === '담당교수')
            return c.professorName?.toLowerCase().includes(k);
          if (detailType === '강좌번호')
            return c.courseCode?.toLowerCase().includes(k);

          return (
            c.courseName?.toLowerCase().includes(k) ||
            c.professorName?.toLowerCase().includes(k) ||
            c.courseCode?.toLowerCase().includes(k)
          );
        }

        return true;
      });

      if (toggleUnassigned) {
        filtered = filtered.filter((c) => !c.isProfessorMapped);
      }

      setCourses(filtered);
    },
    [filters, toggleUnassigned]
  );

  useEffect(() => {
    applyFilter(allCourses);
    setSelectedCourse(null);
    setResetSelection((prev) => !prev);
  }, [filters, toggleUnassigned, allCourses, applyFilter]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        size: 40,
        cell: ({ row }) => row.index + 1,
      },
      { accessorKey: 'year', header: '개설연도', size: 75 },
      { accessorKey: 'semester', header: '개설학기', size: 75 },
      { accessorKey: 'major', header: '개설학과', size: 100 },
      { accessorKey: 'courseCode', header: '강좌번호', size: 130 },
      { accessorKey: 'courseName', header: '교과목명', size: 130 },
      {
        accessorKey: 'professorName',
        header: '담당교수',
        size: 130,
        cell: ({ row }) => {
          const { professorName, isProfessorMapped } = row.original;

          if (!isProfessorMapped) {
            return (
              <div className='flex items-center justify-center gap-1'>
                <TriangleAlertIcon size={16} />
                {professorName || ''}
              </div>
            );
          }
          return professorName || '';
        },
      },

      { accessorKey: 'courseTime', header: '강의시간', size: 180 },
      { accessorKey: 'buildingName', header: '강의실', size: 175 },
      { accessorKey: 'enrolledCount', header: '인원', size: 50 },
    ],
    []
  );

  return (
    <Layout
      username={`${name ?? '사용자'} 님`}
      headerTitle={`사무실 메뉴`}
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
          title: '시험',
          isOpen: true,
          subItems: [{ label: '시험 일정', path: '/office/exam' }],
        },
      ]}
    >
      <div className='flex flex-col gap-y-5'>
        <div className='w-full'>
          <PageHeader title='과목 목록' />
          <CourseSearchTable
            filters={filters}
            onSearch={(newFilters) => handleSearch(newFilters)}
          />
        </div>

        <div className='flex h-full w-full flex-col gap-y-2.5'>
          <div className='flex w-full items-center justify-end gap-2'>
            <span className='text-[16px]'>담당교수 미배정 과목</span>
            <ToggleSwitch
              checked={toggleUnassigned}
              onChange={setToggleUnassigned}
            />
            <Button
              text='배정'
              color='lightgray'
              onClick={handleMappingClick}
            />
          </div>

          <TableWrapper height='560px'>
            <VerticalTable
              columns={columns}
              data={courses}
              selectable={true}
              singleSelect={true}
              headerHeight={32}
              resetSelection={resetSelection}
              updateSelection={(rows) => {
                const idx = rows[0];
                setSelectedCourse(
                  idx !== undefined && idx !== null ? courses[idx] : null
                );
              }}
            />
          </TableWrapper>
        </div>
      </div>

      {modalMetaInfo && (
        <ProfessorMappingModal
          isOpen={isMappingModalOpen}
          onClose={() => setIsMappingModalOpen(false)}
          onSelect={() => {
            refreshCourses();
            setIsMappingModalOpen(false);
          }}
          metaInfo={modalMetaInfo}
        />
      )}
    </Layout>
  );
}
