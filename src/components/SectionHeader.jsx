import PropTypes from 'prop-types';
import WeekPicker from './WeekPicker';
// import Button from './Button';

/**
 * SectionHeader 컴포넌트
 * @props {string} title - 섹션 헤더의 제목 (필수!)
 * @props {string} subtitle - 섹션 헤더의 부제목
 * @props {boolean} hasWeekPicker - WeekPicker 표시 여부 (기본값: false)
 * @props {object} date - date (dayjs 객체)
 * @props {function} setDate - date setter
 * @props {array} buttonsData - buttonGroup에 필요한 button data 배열
 */
function SectionHeader({
  title,
  subtitle,
  hasWeekPicker = false,
  date,
  setDate,
  //   buttonsData = [],
}) {
  return (
    <div className='border-border-sectionbottom flex h-[40px] items-end border-b pb-[10px]'>
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
