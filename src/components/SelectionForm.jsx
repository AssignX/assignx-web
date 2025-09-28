import PropTypes from 'prop-types';
import { CheckIcon } from '@/assets/icons';

/**
 * @props {string} leftText - 왼쪽 버튼 텍스트 (예: '확정')
 * @props {string} rightText - 오른쪽 버튼 텍스트 (예: '미확정')
 * @props {boolean} selected - 선택 상태, true: 왼쪽 버튼 선택, false: 오른쪽 버튼 선택
 * @props {function} setSelected - selected setter
 */
function SelectionForm({ leftText, rightText, selected, setSelected }) {
  return (
    <div className='flex flex-row items-center gap-[5px]'>
      <SelectButton
        text={leftText}
        onClick={() => setSelected(true)}
        isSelected={selected === true}
      />
      <SelectButton
        text={rightText}
        onClick={() => setSelected(false)}
        isSelected={selected === false}
      />
    </div>
  );
}

function SelectButton({ text, onClick, isSelected }) {
  return (
    <button
      className={`flex flex-row items-center gap-[5px] rounded-[16px] border px-[8px] py-[3px] ${isSelected ? 'border-red text-red' : 'border-dark-gray text-dark-gray'}`}
      style={{ fontSize: '14px', cursor: 'pointer' }}
      onClick={onClick}
    >
      <CheckIcon
        className={
          isSelected ? 'border-red text-red' : 'border-dark-gray text-dark-gray'
        }
      />
      {text}
    </button>
  );
}

SelectButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

SelectionForm.propTypes = {
  leftText: PropTypes.string.isRequired,
  rightText: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default SelectionForm;
