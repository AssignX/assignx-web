import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import VerticalTable from '@/components/table/VerticalTable';
import TimeTable from '@/components/TimeTable';
import ClassRoomSearchTable from '@/components/table/ClassRoomSearchTable';

import { useEffect, useState } from 'react';

const subjectTableColumns = [
  {
    id: 'no',
    accessorKey: 'no',
    header: 'No',
    size: 50,
    cell: (info) => info.getValue(),
  },
  {
    id: 'subjectName',
    accessorKey: 'subjectName',
    header: '과목명',
    size: 124,
    cell: (info) => info.getValue(),
  },
  {
    id: 'subjectCode',
    accessorKey: 'subjectCode',
    header: '과목코드',
    size: 120,
    cell: (info) => info.getValue(),
  },
  {
    id: 'division',
    accessorKey: 'division',
    header: '분반',
    size: 50,
    cell: (info) => info.getValue(),
  },
  {
    id: 'classTime',
    accessorKey: 'classTime',
    header: '강의시간',
    size: 180,
    cell: (info) => info.getValue(),
  },
  {
    id: 'realTime',
    accessorKey: 'realTime',
    header: '강의시간(실제시간)',
    size: 260,
    cell: (info) => info.getValue(),
  },
  {
    id: 'classroom',
    accessorKey: 'classroom',
    header: '강의실',
    size: 100,
    cell: (info) => info.getValue(),
  },
  {
    id: 'students',
    accessorKey: 'students',
    header: '수강인원',
    size: 60,
    cell: (info) => info.getValue(),
  },
];
const timetableStart = '08:00';
const timetableEnd = '20:00';
const timetableDays = ['월', '화', '수', '목', '금', '토'];

// dummy data
const dummySubjectTableRows = [
  {
    id: '1',
    no: 1,
    subjectName: '자료구조',
    subjectCode: 'ITEC0401',
    division: '001',
    classTime: '화 8B,9A,9B, 목 8B,9A,9B',
    realTime: ['화 16:30 ~ 18:00, 목 16:30 ~ 18:00'],
    classroom: 'IT5-302',
    students: 42,
  },
  {
    id: '2',
    no: 2,
    subjectName: '알고리즘',
    subjectCode: 'ITEC0401',
    division: '002',
    classTime: '화 8B,9A,9B, 목 8B,9A,9B',
    realTime: ['화 16:30 ~ 18:00, 목 16:30 ~ 18:00'],
    classroom: 'IT5-205',
    students: 37,
  },
  {
    id: '3',
    no: 3,
    subjectName: '운영체제',
    subjectCode: 'ITEC0401',
    division: '001',
    classTime: '금 8A,8B,9A,9B',
    realTime: ['금 10:00 ~ 12:45'],
    classroom: 'IT4-508',
    students: 55,
  },
  {
    id: '4',
    no: 4,
    subjectName: '운영체제',
    subjectCode: 'ITEC0401',
    division: '001',
    classTime: '금 8A,8B,9A,9B',
    realTime: ['금 10:00 ~ 12:45'],
    classroom: 'IT4-508',
    students: 55,
  },
  {
    id: '5',
    no: 5,
    subjectName: '운영체제',
    subjectCode: 'ITEC0401',
    division: '001',
    classTime: '금 8A,8B,9A,9B',
    realTime: ['금 10:00 ~ 12:45'],
    classroom: 'IT4-508',
    students: 55,
  },
];
const dummyTimeTableEntries = {
  '월-0A': '자료구조\nITEC0401003',
  '월-0B': '자료구조\nITEC0401003',
  '월-1A': '자료구조\nITEC0401003',
  '목-0A': '자료구조\nITEC0401003',
  '목-0B': '자료구조\nITEC0401003',
  '목-1A': '자료구조\nITEC0401003',
  '화-2B': '알고리즘\nITEC0401003',
  '화-3A': '알고리즘\nITEC0401003',
  '화-3B': '알고리즘\nITEC0401003',
  '금-0A': '운영체제\nITEC0401003',
  '금-0B': '운영체제\nITEC0401003',
  '금-1A': '운영체제\nITEC0401003',
  '금-1B': '운영체제\nITEC0401003',
};

function ApplicationStatusPage() {
  const [subjectTableRows, setSubjectTableRows] = useState([]);
  const [timeTableEntries, setTimeTableEntries] = useState({});

  const [searchFilters, setSearchFilters] = useState(null);

  const handleSearchCondition = (filters) => {
    setSearchFilters(filters);
    console.log(searchFilters);
  };

  useEffect(() => {
    // fetch 함수
    setSubjectTableRows(dummySubjectTableRows);
  }, []);

  useEffect(() => {
    // fetch 함수
    setTimeTableEntries(dummyTimeTableEntries);
  }, []);

  const subtitle = `${subjectTableRows?.length ?? 0}건`;

  return (
    <Section>
      <div className='isolate'>
        <PageHeader title='시간표 조회' />
        <ClassRoomSearchTable onSearch={handleSearchCondition} />
      </div>

      <div className='isolate'>
        <SectionHeader title='과목 조회 목록' subtitle={subtitle} />
        <VerticalTable
          columns={subjectTableColumns}
          data={subjectTableRows}
          headerHeight={40}
          maxHeight={200}
          selectable={false}
        />
      </div>

      {/* 시간표 카드 */}
      <div className='isolate'>
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
