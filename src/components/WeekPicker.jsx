import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ChevronLeftIcon, ChevronRightIcon } from '@/assets/icons';

dayjs.extend(isoWeek);

// without onOpenPicker prop
/**
 * @props {object} date - date (dayjs 객체)
 * @props {function} setDate - date setter
 */
function WeekPicker({ date, setDate }) {
  const goPrev = () => setDate(date.add(-7, 'day'));
  const goNext = () => setDate(date.add(7, 'day'));

  const getWeekLabel = (d) => {
    const start = d.isoWeekday(1);
    const end = d.isoWeekday(7);
    return `${start.format('YYYY/MM/DD')} ~ ${end.format('YYYY/MM/DD')}`;
  };

  const label = getWeekLabel(date);
  return (
    <div className='text-text-main flex h-[20px] items-center gap-[10px]'>
      <button style={{ cursor: 'pointer' }} onClick={goPrev}>
        <ChevronLeftIcon />
      </button>
      <span
        className='text-[14px] leading-[17px] font-medium whitespace-nowrap'
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
