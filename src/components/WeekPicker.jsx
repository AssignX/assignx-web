import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ChevronLeftIcon, ChevronRightIcon } from '@/assets/icons';

dayjs.extend(isoWeek);

// without onOpenPicker prop
function WeekPicker({ date, setDate }) {
  const goPrev = () => setDate(date.add(-7, 'day'));
  const goNext = () => setDate(date.add(7, 'day'));

  const getWeekLabel = (d) => {
    const year = d.year();
    const month = d.month() + 1;

    const firstDayOfMonth = dayjs(`${year}-${month}-01`);
    const weekOfMonth = d.isoWeek() - firstDayOfMonth.isoWeek() + 1;

    return `${year}년 ${month}월 ${weekOfMonth}주차`;
  };

  const label = getWeekLabel(date);
  return (
    <div className='text-text-main flex h-[20px] items-center gap-[10px]'>
      <button style={{ cursor: 'pointer' }} onClick={goPrev}>
        <ChevronLeftIcon />
      </button>
      <span
        className='text-[14px] leading-[17px] font-medium'
        style={{ cursor: 'pointer' }}
      >
        {label}
      </span>
      <button style={{ cursor: 'pointer' }} onClick={goNext}>
        <ChevronRightIcon />
      </button>
    </div>
  );
}

WeekPicker.propTypes = {
  date: PropTypes.object.isRequired,
  setDate: PropTypes.func.isRequired,
  //   onOpenPicker: PropTypes.func,
};

export default WeekPicker;
