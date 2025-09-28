import PropTypes from 'prop-types';
import { CheckIcon } from '@/assets/icons';

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
