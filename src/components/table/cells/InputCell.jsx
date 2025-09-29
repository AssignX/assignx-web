import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export function InputCell({ initialValue, rowId, columnKey, updateData }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    if (initialValue !== value) {
      updateData(rowId, columnKey, value);
    }
  };

  return (
    <input
      type='text'
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className='h-8 w-full border border-gray-300 px-2.5 py-2.5 text-sm'
    />
  );
}

InputCell.propTypes = {
  initialValue: PropTypes.string.isRequired,
  rowId: PropTypes.string.isRequired,
  columnKey: PropTypes.string.isRequired,
  updateData: PropTypes.func.isRequired,
};
