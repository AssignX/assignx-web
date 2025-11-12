import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import TimeTable from '@/components/TimeTable';
import HorizontalTable from '@/components/table/HorizontalTable';

import DropdownCell from '@/components/table/cells/DropdownCell';
import InputCell from '@/components/table/cells/InputCell';
import SearchCell from '@/components/table/cells/SearchCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const yearOptions = [
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
];
const semesterOptions = [
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
];
const timetableStart = '08:00';
const timetableEnd = '20:00';
const timetableDays = ['월', '화', '수', '목', '금', '토'];

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

function SubjectListPage() {
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

  const [timeTableEntries, setTimeTableEntries] = useState({});
  const [date, setDate] = useState(dayjs());
  const [selected, setSelected] = useState(true); // true: 수업, false: 시험

  useEffect(() => {
    // fetch 함수
    setTimeTableEntries(dummyTimeTableEntries);
  }, []);

  return (
    <Section>
      <div className='isolate'>
        <PageHeader
          title='신청 현황 조회'
          helperText='※해당 시간표는 시스템 선정 기준 유력 후보 1순위만 표기하고 있습니다.'
        />
        <HorizontalTable items={filterItems} />
      </div>

      {/* 시간표 카드 */}
      <div className='isolate'>
        <SectionHeader
          title='시간표'
          controlGroup='weekPicker'
          hasConfirmSelection={true}
          selected={selected}
          setSelected={setSelected}
          date={date}
          setDate={setDate}
        />
        <TimeTable
          startTime={timetableStart}
          endTime={timetableEnd}
          dayRange={timetableDays}
          entries={timeTableEntries}
          maxHeight='600px'
        />
      </div>
    </Section>
  );
}

export default SubjectListPage;
