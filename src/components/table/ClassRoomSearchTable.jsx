import { useState } from 'react';
import HorizontalTable from '@/components/table/HorizontalTable';
import DropdownCell from '@/components/table/cells/DropdownCell';
import InputCell from '@/components/table/cells/InputCell';
import SearchCell from '@/components/table/cells/SearchCell';
import YearPickerCell from '@/components/table/cells/YearPickerCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';
import BuildingSearchModal from '@/components/BuildingSearchModal';
import PropTypes from 'prop-types';

const semesterOptions = [
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
];

export default function ClassRoomSearchTable({ onSearch }) {
  const [filters, setFilters] = useState({
    year: '2025',
    semester: '1',
    buildingId: '',
    buildingNum: '',
    buildingName: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialSearch, setInitialSearch] = useState('');

  const handleFilterChange = (columnKey, value) => {
    setFilters((prev) => ({ ...prev, [columnKey]: value }));
  };

  const handleBuildingSearch = (searchValue) => {
    setInitialSearch(searchValue ?? '');
    setIsModalOpen(true);
  };

  const handleModalSelect = ({ buildingId, buildingNum, buildingName }) => {
    setFilters((prev) => ({ ...prev, buildingId, buildingNum, buildingName }));
  };

  const handleSearch = () => {
    if (onSearch) onSearch(filters);
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
            key={`buildingName-${filters.buildingName}`}
            value={filters.buildingName}
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

  return (
    <>
      <HorizontalTable items={filterItems} />
      <BuildingSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialValue={initialSearch}
        onSelect={handleModalSelect}
      />
    </>
  );
}

ClassRoomSearchTable.propTypes = { onSearch: PropTypes.func };
