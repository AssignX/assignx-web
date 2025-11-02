import { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronUpIcon, ChevronDownIcon } from '@/assets/icons';

/**
 * 연도 선택(YearPicker) 컴포넌트
 * @param {string} rowId - 현재 셀이 속한 행(row)의 고유 ID
 * @param {string} columnKey - 현재 셀이 속한 열(column)의 키
 * @param {function} updateData - (rowId, columnKey, value)를 인자로 받아 상위 상태를 업데이트
 * @param {number} initialValue - 초기 연도
 */
function YearPickerCell({ rowId, columnKey, updateData, initialValue }) {
  const [year, setYear] = useState(initialValue || new Date().getFullYear());

  const handleIncrease = () => {
    const newYear = year + 1;
    setYear(newYear);
    updateData?.(rowId, columnKey, newYear);
  };

  const handleDecrease = () => {
    const newYear = year - 1;
    setYear(newYear);
    updateData?.(rowId, columnKey, newYear);
  };

  return (
    <div
      className='border-table-border flex w-full items-center border p-2.5'
      style={{ height: `32px` }}
    >
      <div className='w-full text-center text-[13px]'>{year}</div>

      <div className='flex flex-col leading-none'>
        <button
          onClick={handleIncrease}
          className='-mb-[2px] cursor-pointer leading-none text-gray-600'
        >
          <ChevronUpIcon />
        </button>
        <button
          onClick={handleDecrease}
          className='-mt-[2px] cursor-pointer leading-none text-gray-600'
        >
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  );
}

YearPickerCell.propTypes = {
  rowId: PropTypes.string,
  columnKey: PropTypes.string,
  updateData: PropTypes.func,
  initialValue: PropTypes.number,
  height: PropTypes.number,
};

export default YearPickerCell;
