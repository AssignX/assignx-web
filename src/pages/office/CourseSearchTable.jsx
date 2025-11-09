import DropdownCell from '@/components/table/cells/DropdownCell';
import InputCell from '@/components/table/cells/InputCell';
import YearPickerCell from '@/components/table/cells/YearPickerCell';
import Button from '@/components/buttons/Button';
import HorizontalTable from '@/components/table/HorizontalTable';
import { SearchIcon } from '@/assets/icons';
import PropTypes from 'prop-types';

const semesterOptions = [
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
];

const detailOptions = [
  { value: '', label: '선택' },
  { value: '담당교수', label: '담당교수' },
  { value: '강좌번호', label: '강좌번호' },
  { value: '교과목명', label: '교과목명' },
];

export default function CourseSearchTable({ filters, setFilters, onSearch }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateFilters = (rowId, columnKey, value) => {
    handleChange(columnKey, value);
  };

  const filterItems = [
    {
      id: 'year',
      label: '개설연도',
      labelWidth: '100px',
      contentWidth: '115px',
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
      labelWidth: '100px',
      contentWidth: '115px',
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
      id: 'detailType',
      label: '강좌상세검색',
      labelWidth: '100px',
      contentWidth: '345px',
      content: (
        <div className='flex items-center gap-1'>
          <DropdownCell
            initialValue={filters.detailType}
            options={detailOptions}
            rowId='filters'
            columnKey='detailType'
            updateData={updateFilters}
            height={32}
          />
          <InputCell
            initialValue={filters.keyword}
            rowId='filters'
            columnKey='keyword'
            updateData={updateFilters}
            placeholder='검색어 입력'
            height={32}
          />
        </div>
      ),
    },
    {
      id: 'search-button',
      contentWidth: '300px',
      content: (
        <Button
          text='조회'
          color='lightgray'
          textSize='text-sm'
          Icon={SearchIcon}
          onClick={onSearch}
        />
      ),
    },
  ];

  return <HorizontalTable items={filterItems} />;
}

CourseSearchTable.propTypes = {
  filters: PropTypes.shape({
    year: PropTypes.string.isRequired,
    semester: PropTypes.string.isRequired,
    detailType: PropTypes.string,
    keyword: PropTypes.string,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};
