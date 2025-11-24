import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import VerticalTable from '@/components/table/VerticalTable';
import HorizontalTable from '@/components/table/HorizontalTable';
import TimeTable from '@/components/TimeTable';

import InputCell from '@/components/table/cells/InputCell';
import { SearchIcon } from '@/assets/icons';

import apiClient from '@/api/apiClient';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

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

// 시간표 범위/요일
const timetableStart = '08:00';
const timetableEnd = '20:00';
const timetableDays = ['월', '화', '수', '목', '금', '토'];

function ApplicationStatusPage() {
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

  const filterItems = [
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
      contentWidth: '220px', // fill
      content: <InputCell value={departmentName} height={32} disabled={true} />,
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
  ];

  const subtitle = `${courseTableRows.length}건`;

  return (
    <Section>
      <div>
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

      <div>
        <SectionHeader title='과목 조회 목록' subtitle={subtitle} />
        <VerticalTable
          columns={courseTableColumns}
          data={courseTableRows}
          headerHeight={40}
          maxHeight={200}
          selectable={false}
        />
      </div>

      <div>
        <SectionHeader title='강의 시간표' />
        <TimeTable
          startTime={timetableStart}
          endTime={timetableEnd}
          dayRange={timetableDays}
          entries={timeTableEntries}
          maxHeight='360px'
        />
      </div>
    </Section>
  );
}

export default ApplicationStatusPage;
