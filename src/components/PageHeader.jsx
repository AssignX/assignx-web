import PropTypes from 'prop-types';
import SelectionForm from './SelectionForm';
function PageHeader({
  title,
  helperText,
  hasConfirmSelection = false,
  selected,
  setSelected,
}) {
  return (
    <div className='border-border-sectionbottom flex items-center border-b pb-[10px]'>
      <div className='flex w-full flex-col gap-[5px]'>
        <div className='flex flex-row gap-[10px]'>
          <p
            className='text-text-main font-bold'
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
          <p className='text-blue' style={{ fontSize: '13px' }}>
            {helperText}
          </p>
        )}
      </div>
      {/* Buttons */}
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
