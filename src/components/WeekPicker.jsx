import PropTypes from 'prop-types';
import { ChevronLeftIcon, ChevronRightIcon } from '@/assets/icons';

function WeekPicker() {
  return (
    <div className='text-text-main flex h-[20px] items-center gap-[10px]'>
      <button style={{ cursor: 'pointer' }} onClick={() => {}}>
        <ChevronLeftIcon />
      </button>
      <span
        className='text-[14px] leading-[17px] font-medium'
        style={{ cursor: 'pointer' }}
      >
        2025년 9월 2주차
      </span>
      <button style={{ cursor: 'pointer' }} onClick={() => {}}>
        <ChevronRightIcon />
      </button>
    </div>
  );
}

WeekPicker.propTypes = {
  selectedWeek: PropTypes.string.isRequired,
  setSelectedWeek: PropTypes.func.isRequired,
};

export default WeekPicker;
