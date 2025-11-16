import { useState, useEffect } from 'react';
import DropdownCell from '@/components/table/cells/DropdownCell';
import InputCell from '@/components/table/cells/InputCell';
import YearPickerCell from '@/components/table/cells/YearPickerCell';
import Button from '@/components/buttons/Button';
import HorizontalTable from '@/components/table/HorizontalTable';
import { SearchIcon } from '@/assets/icons';
import PropTypes from 'prop-types';

export default function CourseSearchTable({ filters, onSearch }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateLocal = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
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
          initialValue={Number(localFilters.year)}
          updateData={(row, col, val) => updateLocal(col, String(val))}
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
          initialValue={localFilters.semester}
          options={[
            { value: '1', label: '1학기' },
            { value: '2', label: '2학기' },
          ]}
          rowId='filters'
          columnKey='semester'
          updateData={(row, col, val) => updateLocal(col, val)}
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
            initialValue={localFilters.detailType}
            options={[
              { value: '', label: '선택' },
              { value: '담당교수', label: '담당교수' },
              { value: '강좌번호', label: '강좌번호' },
              { value: '교과목명', label: '교과목명' },
            ]}
            rowId='filters'
            columnKey='detailType'
            updateData={(row, col, val) => updateLocal(col, val)}
            height={32}
          />

          <InputCell
            value={localFilters.keyword}
            onChange={(e) => updateLocal('keyword', e.target.value)}
            height={32}
            placeholder='검색어'
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
          onClick={() => onSearch(localFilters)}
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
