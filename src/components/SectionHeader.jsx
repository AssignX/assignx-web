import PropTypes from 'prop-types';
import SelectionForm from './SelectionForm';
// import Button from './Button';

function SectionHeader({
  title,
  subtitle,
  //   buttonsData = [],
}) {
  return (
    <div className='border-border-sectionbottom flex items-center border-b pb-[10px]'>
      <div className='flex w-full flex-row items-center gap-[5px]'>
        <p
          className='text-text-main leading-[22px] font-bold'
          style={{ fontSize: '18px' }}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className='text-text-sub leading-[16px]'
            style={{ fontSize: '13px' }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className='gap-[8px]'>{/* Buttons */}</div>
    </div>
  );
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  //   buttonsData: PropTypes.arrayOf(PropTypes.node),
};

export default SectionHeader;
