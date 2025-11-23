import { useState } from 'react';
import HorizontalTable from '@/components/table/HorizontalTable';
import DropdownCell from '@/components/table/cells/DropdownCell';
import InputCell from '@/components/table/cells/InputCell';
import YearPickerCell from '@/components/table/cells/YearPickerCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';
import PropTypes from 'prop-types';

const semesterOptions = [
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
];

const divisionOptions = [
  { value: '', label: '전체' },
  { value: '중간', label: '중간' },
  { value: '기말', label: '기말' },
  { value: '기타', label: '기타' },
];

export default function ScheduleSearchTable({ onSearch }) {
  const [filters, setFilters] = useState({
    year: '2025',
    semester: '2',
    division: '',
    keyword: '',
  });

  // console.log('ScheduleSearchTable filters:', filters);

  const updateFilters = (rowId, columnKey, value) => {
    setFilters((prev) => ({ ...prev, [columnKey]: value }));
  };

  const handleSearch = () => {
    if (onSearch) onSearch(filters);
  };

  const filterItems = [
    {
      id: 'year',
      label: '연도',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <YearPickerCell
          value={filters.year}
          onChange={(v) => setFilters((prev) => ({ ...prev, year: v }))}
        />
      ),
    },
    {
      id: 'semester',
      label: '학기',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <DropdownCell
          value={filters.semester}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, semester: value }))
          }
          options={semesterOptions}
          height={32}
        />
      ),
    },
    {
      id: 'division',
      label: '구분',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <DropdownCell
          initialValue={filters.division}
          options={divisionOptions}
          rowId='filters'
          columnKey='division'
          updateData={updateFilters}
          height={32}
        />
      ),
    },
    {
      id: 'keyword',
      label: '강좌검색',
      labelWidth: '130px',
      contentWidth: '355px',
      content: (
        <InputCell
          value={filters.keyword}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, keyword: e.target.value }))
          }
          height={32}
        />
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

ScheduleSearchTable.propTypes = { onSearch: PropTypes.func };
