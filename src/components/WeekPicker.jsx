import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ChevronLeftIcon, ChevronRightIcon } from '@/assets/icons';

dayjs.extend(isoWeek);

/**
 * @props {object} date - date (dayjs 객체)
 * @props {function} setDate - date setter
 */
function WeekPicker({ date, setDate }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => date.startOf('month'));
  const popoverRef = useRef(null);

  const togglePopover = () => {
    setView(date.startOf('month'));
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e) => {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  const goPrev = () => setDate(date.add(-7, 'day'));
  const goNext = () => setDate(date.add(7, 'day'));

  const getWeeksOfMonth = (month) => {
    const startOfMonth = month.startOf('month');
    const endOfMonth = month.endOf('month');

    let gridStart = startOfMonth.isoWeekday(1);
    const gridEnd = endOfMonth.isoWeekday(7);

    const weeks = [];
    let index = 1;

    while (gridStart.isBefore(gridEnd) || gridStart.isSame(gridEnd, 'day')) {
      weeks.push({ index, startOfWeek: gridStart });
      gridStart = gridStart.add(7, 'day');
      index += 1;
    }
    return weeks;
  };

  const getWeekLabel = (d) => {
    const start = d.isoWeekday(1);
    const end = d.isoWeekday(7);
    return `${start.format('YYYY/MM/DD')} ~ ${end.format('YYYY/MM/DD')}`;
  };

  const label = getWeekLabel(date);
  return (
    <div className='relative inline-block'>
      <div className='text-text-main flex h-[20px] items-center gap-[10px]'>
        <button style={{ cursor: 'pointer' }} onClick={goPrev}>
          <ChevronLeftIcon />
        </button>
        <span
          className='text-[14px] leading-[17px] font-medium whitespace-nowrap'
          style={{ cursor: 'pointer' }}
          onClick={togglePopover}
        >
          {label}
        </span>
        <button style={{ cursor: 'pointer' }} onClick={goNext}>
          <ChevronRightIcon />
        </button>
      </div>

      {/* PopOver */}
      {open && (
        <div
          ref={popoverRef}
          className='border-light-gray absolute top-[calc(100%+8px)] left-1/2 z-1 w-[160px] -translate-x-1/2 rounded border bg-white p-2 shadow-lg'
          role='dialog'
          aria-modal='true'
        >
          {/* Header */}
          <div className='flex items-center justify-between pb-2'>
            <button
              type='button'
              className='p-1'
              style={{ cursor: 'pointer' }}
              onClick={() => setView(view.add(-1, 'month'))}
            >
              <ChevronLeftIcon />
            </button>
            <div className='text-sm font-medium'>{view.format('M월')}</div>
            <button
              type='button'
              className='p-1'
              style={{ cursor: 'pointer' }}
              onClick={() => setView(view.add(1, 'month'))}
            >
              <ChevronRightIcon />
            </button>
          </div>

          {/* Body */}
          <div className='border-light-gray flex flex-col border-t'>
            {getWeeksOfMonth(view).map(({ index, startOfWeek }) => {
              const isSelected =
                date.isoWeek() === startOfWeek.isoWeek() &&
                date.isoWeekYear() === startOfWeek.isoWeekYear();

              return (
                <button
                  key={startOfWeek.valueOf()}
                  type='button'
                  onClick={() => {
                    setDate(startOfWeek);
                    setOpen(false);
                  }}
                  className={[
                    'rounded p-2 text-center text-[12px]',
                    isSelected
                      ? 'bg-blue-50 ring-blue-200'
                      : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  {index}주차
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

WeekPicker.propTypes = {
  date: PropTypes.object.isRequired,
  setDate: PropTypes.func.isRequired,
  //   onOpenPicker: PropTypes.func,
};

export default WeekPicker;
