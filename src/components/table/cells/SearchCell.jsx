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
        className='border-table-border h-8 w-8 flex-shrink-0 items-center border-y border-r p-1'
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
