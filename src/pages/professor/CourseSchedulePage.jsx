import Layout from '@/components/Layout';
import TableWrapper from '@/components/layout/TableWrapper';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import VerticalTable from '@/components/table/VerticalTable';
import HorizontalTable from '@/components/table/HorizontalTable';
import TimeTable from '@/components/TimeTable';

import InputCell from '@/components/table/cells/InputCell';
import { SearchIcon } from '@/assets/icons';

import apiClient from '@/api/apiClient';
import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { buildCourseRealTime, buildTimeTableEntries } from './parsingTime';

const courseTableColumns = [
  { id: 'no', accessorKey: 'no', header: 'No', size: 40 },
  { id: 'courseName', accessorKey: 'courseName', header: '과목명', size: 120 },
  {
    id: 'courseCode',
    accessorKey: 'courseCode',
    header: '과목코드',
    size: 120,
  },
  { id: 'classSection', accessorKey: 'classSection', header: '분반', size: 40 },
  {
    id: 'courseTime',
    accessorKey: 'courseTime',
    header: '강의시간',
    size: 220,
  },
  {
    id: 'courseRealTime',
    accessorKey: 'courseRealTime',
    header: '강의시간(실제시간)',
    size: 220,
  },
  { id: 'classroom', accessorKey: 'classroom', header: '강의실', size: 120 },
  {
    id: 'enrolledCount',
    accessorKey: 'enrolledCount',
    header: '수강인원',
    size: 40,
  },
];

const timetableStart = '08:00';
const timetableEnd = '20:00';
const timetableDays = ['월', '화', '수', '목', '금', '토'];

function CourseSchedulePage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { name: userNameFromStore } = useAuthStore();

  useEffect(() => {
    if (!accessToken) navigate('/login');
  }, [accessToken, navigate]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.warn('logout failed', err);
    }
    logout();
    navigate('/login');
  };

  const [openYear, setOpenYear] = useState(2025);
  const [openSemester, setOpenSemester] = useState('2학기');

  const departmentName = useAuthStore((state) => state.departmentName);
  const idNumber = useAuthStore((state) => state.idNumber);
  const name = useAuthStore((state) => state.name);

  const [courseTableRows, setCourseTableRows] = useState([]);
  const [timeTableEntries, setTimeTableEntries] = useState({});

  useEffect(() => {
    setOpenYear(2025);
    setOpenSemester('2학기');
  }, []);

  const handleSearch = async () => {
    try {
      const semesterQuery =
        typeof openSemester === 'string'
          ? openSemester.replace('학기', '')
          : String(openSemester);

      const res = await apiClient.get('/api/course/search', {
        params: {
          year: String(openYear),
          semester: semesterQuery,
          professorName: name,
        },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const mappedRows = data.map((course, index) => {
        const [code, section] = course.courseCode?.split('-') ?? ['', ''];
        return {
          no: index + 1,
          courseName: course.courseName,
          courseCode: code,
          classSection: section,
          courseTime: course.courseTime,
          courseRealTime: buildCourseRealTime(course.courseTime),
          classroom:
            `${course.buildingName ?? ''} ${course.roomNumber ?? ''}`.trim(),
          enrolledCount: course.enrolledCount,
        };
      });
      setCourseTableRows(mappedRows);
      const entries = buildTimeTableEntries(data);
      setTimeTableEntries(entries);
    } catch (error) {
      console.error('과목 조회 실패:', error);
      setCourseTableRows([]);
      setTimeTableEntries({});
    }
  };

  const filterItems = useMemo(
    () => [
      {
        id: 'openYear',
        label: '개설연도',
        required: true,
        labelWidth: '80px',
        contentWidth: '80px',
        content: (
          <InputCell value={String(openYear)} height={32} disabled={true} />
        ),
      },
      {
        id: 'openSemester',
        label: '개설학기',
        required: true,
        labelWidth: '80px',
        contentWidth: '80px',
        content: (
          <InputCell value={String(openSemester)} height={32} disabled={true} />
        ),
      },
      {
        id: 'department',
        label: '소속학과',
        required: true,
        labelWidth: '80px',
        contentWidth: '220px',
        content: (
          <InputCell value={departmentName} height={32} disabled={true} />
        ),
      },
      {
        id: 'professorId',
        label: '학번',
        required: true,
        labelWidth: '60px',
        contentWidth: '120px',
        content: <InputCell value={idNumber} height={32} disabled={true} />,
      },
      {
        id: 'professorName',
        label: '이름',
        required: true,
        labelWidth: '60px',
        contentWidth: '80px',
        content: <InputCell value={name} height={32} disabled={true} />,
      },
    ],
    [departmentName, openSemester, openYear, idNumber, name]
  );

  const subtitle = `${courseTableRows.length}건`;

  return (
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle='교수 메뉴'
      onLogout={handleLogout}
      menus={[
        {
          title: '강의 조회',
          subItems: [
            {
              label: '시간표 조회',
              path: '/professor/schedule',
              isSelected: true,
            },
          ],
        },
        {
          title: '시험 신청',
          subItems: [
            { label: '1차 시험 신청', path: '/professor/first' },
            { label: '2차 시험 신청', path: '/professor/second' },
            { label: '신청 현황 조회', path: '/professor/status' },
          ],
        },
      ]}
    >
      <div className='flex flex-col'>
        <PageHeader
          title='시간표 조회'
          buttonsData={[
            {
              text: '조회',
              color: 'lightgray',
              Icon: SearchIcon,
              onClick: handleSearch,
            },
          ]}
        />
        <HorizontalTable items={filterItems} />
      </div>

      <div className='flex flex-col'>
        <SectionHeader title='과목 조회 목록' subtitle={subtitle} />
        <TableWrapper height='200px'>
          <VerticalTable
            columns={courseTableColumns}
            data={courseTableRows}
            headerHeight={40}
            selectable={false}
          />
        </TableWrapper>
      </div>

      <div className='flex flex-col'>
        <SectionHeader title='강의 시간표' />
        <TableWrapper height='360px'>
          <TimeTable
            startTime={timetableStart}
            endTime={timetableEnd}
            dayRange={timetableDays}
            entries={timeTableEntries}
          />
        </TableWrapper>
      </div>
    </Layout>
  );
}

export default CourseSchedulePage;
