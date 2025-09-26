import PropTypes from 'prop-types';

function PageHeader({ title, helperText }) {
  return (
    <div className='border-border-sectionbottom flex items-center border-b pb-[10px]'>
      <div className='flex flex-col gap-[5px]'>
        <div className='flex flex-row gap-[5px]'>
          <h1
            className='text-text-main font-bold'
            style={{ fontSize: '19.5px' }}
          >
            {title}
          </h1>
          {/* ConfirmSelection */}
        </div>
        {helperText && <p className='text-blue'>{helperText}</p>}
      </div>
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  //   hasConfirmSelection: PropTypes.bool,
  //   onConfirmSelection: PropTypes.func,
  //   buttonsData: PropTypes.arrayOf(PropTypes.node),
};

export default PageHeader;
