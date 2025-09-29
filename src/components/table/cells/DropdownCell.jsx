import PropTypes from 'prop-types';

export function DropdownCell({
  initialValue,
  rowId,
  columnKey,
  updateData,
  options, // dropdown options
}) {
  const onChange = (e) => {
    const newValue = e.target.value;

    updateData(rowId, columnKey, newValue);
  };

  return (
    <select
      value={initialValue}
      onChange={onChange}
      className='w-full border border-gray-300 px-2.5 py-2.5 text-sm'
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

DropdownCell.propTypes = {
  initialValue: PropTypes.string.isRequired,
  rowId: PropTypes.string.isRequired,
  columnKey: PropTypes.string.isRequired,
  updateData: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
