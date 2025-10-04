import PropTypes from 'prop-types';

export function InputCell({
  value,
  onChange,
  onKeyDown,
  onBlur,
  disabled,
  className,
}) {
  const defaultClassName = `h-8 w-full border border-table-border p-2.5 text-[13px] ${
    disabled ? 'bg-inputCell-disabled' : ''
  }`;

  const finalClassName = `${defaultClassName} ${className || ''}`.trim();

  return (
    <input
      type='text'
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      disabled={disabled}
      className={finalClassName}
    />
  );
}

InputCell.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

InputCell.defaultProps = { disabled: false };
