import { useState } from 'react';
import HorizontalTable from '@/components/table/HorizontalTable';
import DropdownCell from '@/components/table/cells/DropdownCell';
import InputCell from '@/components/table/cells/InputCell';
import SearchCell from '@/components/table/cells/SearchCell';
import YearPickerCell from '@/components/table/cells/YearPickerCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';

const semesterOptions = [
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
];

export default function ClassRoomSearchTable() {
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
      label: '개설연도',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <YearPickerCell
          rowId='filters'
          columnKey='year'
          initialValue={Number(filters.year)}
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
            updateData={updateFilters}
            disabled={true}
            height={32}
          />
        </div>
      ),
    },
    {
      id: 'search-button',
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

  return <HorizontalTable items={filterItems} />;
}
