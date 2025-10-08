import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SearchIcon } from '@/assets/icons';
import InputCell from './InputCell';

/**
 * 검색 아이콘 버튼이 결합된 텍스트 입력(input) 컴포넌트
 * @param {string} initialValue - 입력 필드의 초기 값 (기본값: '')
 * @param {function} onSearch - 검색 버튼을 클릭하거나 Enter 키를 눌렀을 때 호출되는 콜백 함수. 현재 입력 값을 인자로 받음 (필수)
 * @param {number} height - 입력 필드와 검색 버튼의 높이(px) (기본값: 26px(row=35px일 때), sy페이지만 32px로 설정(row=41px일 때))
 */

export default function SearchCell({ initialValue, onSearch, height = 26 }) {
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
        height={height}
      />
      <button
        type='button'
        onClick={handleSearchClick}
        className='border-table-border flex flex-shrink-0 items-center justify-center border-y border-r p-1'
        style={{ height: `${height}px`, width: `${height}px` }}
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
  height: PropTypes.number,
};

SearchCell.defaultProps = { initialValue: '' };
