import { useState } from 'react';
import HorizontalTable from '../HorizontalTable';
import { DropdownCell } from '../cells/DropdownCell';
import { InputCell } from '../cells/InputCell';
import { SearchCell } from '../cells/SearchCell';

const yearOptions = [
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
];
const semesterOptions = [
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
];

export default function SYSearchTable() {
  const [filters, setFilters] = useState({
    year: '2025',
    semester: '1',
    buildingNum: '',
    buildingName: '',
  });

  // --- 모달 관련 상태 및 핸들러를 alert으로 대체 ---
  const handleBuildingSearch = (searchValue) => {
    handleFilterChange('buildingNum', searchValue);

    if (searchValue) {
      alert(`(시뮬레이션) 모달을 엽니다.\n입력된 초기값: '${searchValue}'`);
    } else {
      alert('(시뮬레이션) 모달을 엽니다 (초기값 없음).');
    }
  };

  const handleFilterChange = (columnKey, value) => {
    setFilters((prev) => ({ ...prev, [columnKey]: value }));
  };

  const handleSearch = () => {
    alert(`조회 조건:\n${JSON.stringify(filters, null, 2)}`);
  };

  const updateFilters = (rowId, columnKey, value) => {
    handleFilterChange(columnKey, value);
  };

  const filterItems = [
    {
      id: 'year',
      label: '개설년도',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <DropdownCell
          initialValue={filters.year}
          options={yearOptions}
          rowId='filters'
          columnKey='year'
          updateData={updateFilters}
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
          updateData={updateFilters}
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
          />
          <InputCell
            initialValue={filters.buildingName}
            rowId='filters'
            columnKey='buildingName'
            updateData={updateFilters}
            disabled={true}
          />
        </div>
      ),
    },
    {
      id: 'search-button',
      contentWidth: '355px',
      content: (
        <button
          onClick={handleSearch}
          className='w-[65px] rounded bg-gray-600 px-4 py-1.5 text-sm text-white hover:bg-gray-700'
        >
          조회
        </button>
      ),
    },
  ];

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>강의실 조회</h1>
      <HorizontalTable items={filterItems} />
    </div>
  );
}
