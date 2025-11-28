// src/components/RoomSearchTable.jsx

import HorizontalTable from '@/components/table/HorizontalTable';
import InputCell from '@/components/table/cells/InputCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function RoomSearchTable({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(keyword.trim());
  };

  const filterItems = [
    {
      id: 'roomSearch',
      label: '강의실 번호',
      labelWidth: '130px',
      contentWidth: '738px',
      content: (
        <div className='flex items-center gap-[2px]'>
          <div className='w-[200px]'>
            <InputCell
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              height={32}
            />
          </div>
          <Button
            text='조회'
            Icon={SearchIcon}
            color='lightgray'
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

RoomSearchTable.propTypes = { onSearch: PropTypes.func };
