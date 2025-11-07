import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';
import TimeTable from '@/components/TimeTable';

import DropdownCell from '@/components/table/cells/DropdownCell';
import InputCell from '@/components/table/cells/InputCell';
import SearchCell from '@/components/table/cells/SearchCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';

import { useState } from 'react';

const yearOptions = [
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
];

const semesterOptions = [
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
];

const subjectTableColumns = [
  {
    id: 'no',
    accessorKey: 'no',
    header: 'No',
    size: 60,
    cell: (info) => info.getValue(),
  },
  {
    id: 'subjectName',
    accessorKey: 'subjectName',
    header: '과목명',
    size: 220,
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
    size: 80,
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
    header: (
      <div className='flex w-full flex-col items-center justify-center'>
        <span>강의시간</span>
        <span className='text-text-sub ml-1 text-[11px]'>(실제시간)</span>
      </div>
    ),
    size: 260, // 실사용 시간 상세가 길 수 있어서 넉넉히
    cell: (info) => info.getValue(),
  },
  {
    id: 'classroom',
    accessorKey: 'classroom',
    header: '강의실',
    size: 140,
    cell: (info) => info.getValue(),
  },
  {
    id: 'students',
    accessorKey: 'students',
    header: '수강인원',
    size: 100,
    cell: (info) => info.getValue(),
  },
];

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
];

const timetableStart = '08:00';
const timetableEnd = '20:00';
const timetableDays = ['월', '화', '수', '목', '금'];

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
  const subtitle = 'N건';

  const [filters, setFilters] = useState({
    year: '2025',
    semester: '1',
    buildingNum: '',
    buildingName: '',
  });

  const updateFilters = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleBuildingSearch = (searchValue) => {
    updateFilters('buildingNum', searchValue);
    // TODO: 여기서 모달 오픈 로직 연결
    console.log('[모달 시뮬]', { init: searchValue || '(없음)' });
  };

  const handleSearch = () => {
    // TODO: 실제 조회 API 호출
    console.log('[조회 조건]', filters);
  };

  const filterItems = [
    {
      id: 'year',
      label: '개설연도',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <DropdownCell
          initialValue={filters.year}
          options={yearOptions}
          rowId='filters'
          columnKey='year'
          updateData={(_, __, v) => updateFilters('year', v)}
          height={32}
        />
      ),
    },
    {
      id: 'semester',
      label: '개설학기',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <DropdownCell
          initialValue={filters.semester}
          options={semesterOptions}
          rowId='filters'
          columnKey='semester'
          updateData={(_, __, v) => updateFilters('semester', v)}
          height={32}
        />
      ),
    },
    {
      id: 'buildingSearch',
      label: '건물상세검색',
      labelWidth: '130px',
      contentWidth: '355px',
      content: (
        <div className='flex items-center gap-1'>
          <SearchCell
            initialValue={filters.buildingNum}
            onSearch={handleBuildingSearch}
            height={32}
          />
          <InputCell
            initialValue={filters.buildingName}
            rowId='filters'
            columnKey='buildingName'
            updateData={(_, __, v) => updateFilters('buildingName', v)}
            disabled={true}
            height={32}
          />
        </div>
      ),
    },
    {
      id: 'search-button',
      label: '',
      labelWidth: '130px',
      contentWidth: '355px',
      content: (
        <Button
          text='조회'
          color='lightgray'
          textSize='text-sm'
          Icon={SearchIcon}
          onClick={handleSearch}
        />
      ),
    },
  ];

  return (
    <Section>
      <PageHeader title='시간표 조회' />
      <HorizontalTable items={filterItems} />

      <SectionHeader title='과목 조회 목록' subtitle={subtitle} />
      <VerticalTable
        columns={subjectTableColumns}
        data={dummySubjectTableRows}
        headerHeight={36}
        maxHeight={480}
        selectable={false}
      />

      <SectionHeader title='강의 시간표' />
      <TimeTable
        startTime={timetableStart}
        endTime={timetableEnd}
        dayRange={timetableDays}
        entries={dummyTimeTableEntries}
        maxHeight='520px'
      />
    </Section>
  );
}

export default ApplicationStatusPage;
