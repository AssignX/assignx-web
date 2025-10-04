import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SearchIcon } from '@/assets/icons';
import { InputCell } from './InputCell';

export function SearchCell({ initialValue, onSearch }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className='flex w-full items-center'>
      <InputCell
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button
        type='button'
        onClick={handleSearchClick}
<<<<<<< HEAD
        className='border-table-border flex h-8 w-8 flex-shrink-0 items-center justify-center border-y border-r p-1'
=======
        className='border-table-border h-8 w-8 flex-shrink-0 items-center border-y border-r p-1'
>>>>>>> 9b823e9c17d4eb9acf1b6909d8dc309729df0563
        aria-label='Search'
      >
        <SearchIcon />
      </button>
    </div>
  );
}

SearchCell.propTypes = {
  initialValue: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

SearchCell.defaultProps = { initialValue: '' };
