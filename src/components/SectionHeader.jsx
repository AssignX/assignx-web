import PropTypes from 'prop-types';
import WeekPicker from './WeekPicker';
// import Button from './Button';

function SectionHeader({
  title,
  subtitle,
  hasWeekPicker = false,
  date,
  setDate,
  //   buttonsData = [],
}) {
  return (
    <div className='border-border-sectionbottom flex h-[40px] items-center border-b pb-[10px]'>
      <div className='flex w-full flex-row items-center gap-[5px]'>
        <span
          className='text-text-main leading-[22px] font-bold'
          style={{ fontSize: '18px' }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className='text-text-sub leading-[16px]'
            style={{ fontSize: '13px' }}
          >
            {subtitle}
          </span>
        )}
      </div>
      {hasWeekPicker && (
        <WeekPicker date={date || new Date()} setDate={setDate || (() => {})} />
      )}
      <div className='gap-[8px]'>{/* Buttons */}</div>
    </div>
  );
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  hasWeekPicker: PropTypes.bool,
  date: PropTypes.object,
  setDate: PropTypes.func,
  //   buttonsData: PropTypes.arrayOf(PropTypes.node),
};

export default SectionHeader;
