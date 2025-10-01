import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export function InputCell({
  initialValue,
  rowId,
  columnKey,
  updateData,
  disabled,
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    // Only update if the value has changed
    if (initialValue !== value) {
      updateData(rowId, columnKey, value);
    }
  };

  const inputClassName = `h-8 w-full border border-table-border px-2.5 py-2.5 text-sm ${
    disabled ? 'bg-inputCell-disabled' : ''
  }`;

  return (
    <input
      type='text'
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={inputClassName.trim()}
    />
  );
}

InputCell.propTypes = {
  initialValue: PropTypes.string.isRequired,
  rowId: PropTypes.string.isRequired,
  columnKey: PropTypes.string.isRequired,
  updateData: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

InputCell.defaultProps = { disabled: false };
