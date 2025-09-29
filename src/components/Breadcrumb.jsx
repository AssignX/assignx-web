import PropTypes from 'prop-types';
import { ChevronRightIcon, HouseIcon } from '../assets/icons';

function BreadCrumb({ parentText, childText }) {
  return (
    <div
      className='text-breadcrumb flex h-[40px] w-fit items-center gap-[5px] py-[10px]'
      style={{ fontSize: '13px' }}
    >
      <HouseIcon />
      <div className='flex flex-row items-center gap-[5px]'>
        <span>{parentText}</span>
        <ChevronRightIcon strokeWidth={1} />
      </div>
      <span className='font-bold'>{childText}</span>
    </div>
  );
}

BreadCrumb.propTypes = {
  parentText: PropTypes.string,
  childText: PropTypes.string,
};

export default BreadCrumb;
