import PropTypes from 'prop-types';
import WeekPicker from '../pickers/WeekPicker';
import ButtonGroup from '../buttons/ButtonGroup';
import SelectionForm from '../SelectionForm';

/**
 * SectionHeader 컴포넌트
 * @props {string} title - 섹션 헤더의 제목
 * @props {string} subtitle - 섹션 헤더의 부제목
 * @props {string} controlGroup - 우측 컨트롤 그룹 종류 ('none', 'weekPicker', 'buttonGroup')
 * @props {boolean} hasConfirmSelection - 확정/미확정 선택 폼 표시 여부 (기본값: false)
 * @props {boolean} selected - 확정 / 미확정 선택 상태, true: 확정
 * @props {function} setSelected - selected setter
 * @props {object} date - date (dayjs 객체)
 * @props {function} setDate - date setter
 * @props {array} buttonsData - buttonGroup에 필요한 button data 배열
 */
function SectionHeader({
  title = '',
  subtitle,
  controlGroup = 'none',
  hasConfirmSelection = false,
  selected,
  setSelected,
  date,
  setDate,
  buttonsData = [],
}) {
  return (
    <div className='border-border-sectionbottom flex h-[40px] items-end border-b pb-[10px]'>
      <div className='flex flex-1 flex-row gap-[10px]'>
        <div className='flex items-center gap-[5px]'>
          {title && (
            <span
              className='text-text-main leading-[22px] font-bold'
              style={{ fontSize: '18px' }}
            >
              {title}
            </span>
          )}
          {subtitle && (
            <span
              className='text-text-sub leading-[16px]'
              style={{ fontSize: '13px' }}
            >
              {subtitle}
            </span>
          )}
        </div>

        {hasConfirmSelection && (
          <SelectionForm
            leftText='확정'
            rightText='미확정'
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </div>
      {controlGroup === 'weekPicker' && (
        <WeekPicker date={date || new Date()} setDate={setDate || (() => {})} />
      )}
      {controlGroup === 'buttonGroup' && buttonsData.length > 0 && (
        <ButtonGroup direction='row' buttons={buttonsData} />
      )}
    </div>
  );
}

SectionHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  controlGroup: PropTypes.oneOf(['none', 'weekPicker', 'buttonGroup']),
  hasConfirmSelection: PropTypes.bool,
  selected: PropTypes.bool,
  setSelected: PropTypes.func,
  date: PropTypes.object,
  setDate: PropTypes.func,
  buttonsData: PropTypes.arrayOf(PropTypes.node),
};

export default SectionHeader;
