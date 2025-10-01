// import { useEffect, useMemo, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import dayjs from 'dayjs';
import { CalendarDaysIcon } from '@/assets/icons';

function DateTimeRangePicker() {
  return (
    <div className='relative inline-flex w-full'>
      {/* 트리거 (버튼 대용) */}
      <button
        type='button'
        onClick={() => {}}
        className='border-light-gray flex w-full items-center justify-between border p-[10px]'
        style={{ cursor: 'pointer', fontSize: '13px' }}
      >
        <span className='leading-[16px]'>text</span>
        <CalendarDaysIcon />
      </button>
    </div>
  );
}

DateTimeRangePicker.propTypes = {
  // initialDate: PropTypes.oneOfType([
  //   PropTypes.instanceOf(Date),
  //   PropTypes.string, // "YYYY-MM-DD"
  // ]),
  // initialStart: PropTypes.oneOfType([
  //   PropTypes.instanceOf(Date),
  //   PropTypes.string, // "HH:mm"
  // ]),
  // initialEnd: PropTypes.oneOfType([
  //   PropTypes.instanceOf(Date),
  //   PropTypes.string, // "HH:mm"
  // ]),
  // onUpdate: PropTypes.func,
};

export default DateTimeRangePicker;
