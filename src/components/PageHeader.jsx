import PropTypes from 'prop-types';
import SelectionForm from './SelectionForm';
// import Button from './Button';

/**
 * PageHeader 컴포넌트
 * @props {string} title - 페이지 헤더의 제목 (필수!)
 * @props {string} helperText - 페이지 헤더의 도움말 텍스트
 * @props {boolean} hasConfirmSelection - 확정/미확정 선택 폼 표시 여부 (기본값: false)
 * @props {boolean} selected - 확정 / 미확정 선택 상태, true: 확정
 * @props {function} setSelected - selected setter
 * @props {array} buttonsData - buttonGroup에 필요한 button data 배열
 */
function PageHeader({
  title,
  helperText,
  hasConfirmSelection = false,
  selected,
  setSelected,
  //   buttonsData = [],
}) {
  return (
    <div className='border-border-sectionbottom flex items-center border-b pb-[10px]'>
      <div className='flex w-full flex-col gap-[5px]'>
        <div className='flex flex-row gap-[10px]'>
          <p
            className='text-text-main leading-[23px] font-bold'
            style={{ fontSize: '19.5px' }}
          >
            {title}
          </p>
          {hasConfirmSelection && (
            <SelectionForm
              leftText='확정'
              rightText='미확정'
              selected={selected}
              setSelected={setSelected}
            />
          )}
        </div>
        {helperText && (
          <p
            className='text-blue leading-[16px] font-bold'
            style={{ fontSize: '13px' }}
          >
            {helperText}
          </p>
        )}
      </div>
      <div className='gap-[8px]'>{/* Buttons */}</div>
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  hasConfirmSelection: PropTypes.bool,
  selected: PropTypes.bool,
  setSelected: PropTypes.func,
  //   buttonsData: PropTypes.arrayOf(PropTypes.node),
};

export default PageHeader;
