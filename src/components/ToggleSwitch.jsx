import PropTypes from 'prop-types';

export default function ToggleSwitch({ checked, onChange }) {
  return (
    <label className='flex cursor-pointer items-center select-none'>
      <div
        className={`border-table-border flex h-5 w-10 items-center rounded-full border p-1 transition-colors duration-300 ${checked ? 'bg-red' : 'bg-white'}`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </div>
    </label>
  );
}

ToggleSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
