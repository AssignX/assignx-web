import HorizontalTable from '@/components/table/HorizontalTable';
import InputCell from '@/components/table/cells/InputCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function BuildingSearchTable({ onSearch, initialValue = '' }) {
  const [keyword, setKeyword] = useState(initialValue);

  useEffect(() => {
    setKeyword(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    if (onSearch) onSearch(keyword.trim());
  };

  const filterItems = [
    {
      id: 'buildingSearch',
      label: '건물코드/명',
      labelWidth: '130px',
      contentWidth: '738px',
      content: (
        <div className='items-left flex gap-[2px]'>
          <div className='w-[200px]'>
            <InputCell
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              height={32}
            />
          </div>
          <Button
            text='조회'
            color='lightgray'
            Icon={SearchIcon}
            onClick={handleSearch}
          />
        </div>
      ),
    },
  ];

  return (
    <div className='w-full'>
      <HorizontalTable items={filterItems} />
    </div>
  );
}

BuildingSearchTable.propTypes = {
  onSearch: PropTypes.func,
  initialValue: PropTypes.string,
};
