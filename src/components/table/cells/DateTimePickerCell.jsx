// src/components/table/cells/DateTimePickerCell.jsx
import PropTypes from 'prop-types';
import DateTimePicker from '@/components/pickers/DateTimePicker.jsx';

function DateTimePickerCell({ range, onChange }) {
  return (
    <DateTimePicker
      initialDate={range?.from}
      initialStart={range?.from}
      initialEnd={range?.to}
      onUpdate={({ range: newRange }) => {
        if (!onChange || !newRange) return;
        onChange(newRange); // { from: Date, to: Date }
      }}
    />
  );
}

DateTimePickerCell.propTypes = {
  range: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
  }),
  onChange: PropTypes.func,
};

export default DateTimePickerCell;
