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
      label: '', // 라벨 없음이면 빈 문자열
      labelWidth: '130px', // 테이블 레이아웃 맞춤
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
      {/* 테이블 */}

      <SectionHeader title='강의 시간표' />
      {/* 타임테이블 */}
    </Section>
  );
}

export default ApplicationStatusPage;
