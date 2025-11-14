import PropTypes from 'prop-types';

export default function Body({ children }) {
  return (
    <div className='flex h-full w-full flex-row items-start justify-center gap-[20px] bg-[#f5f6f8] p-[20px]'>
      {children}
    </div>
  );
}

Body.propTypes = { children: PropTypes.node };
