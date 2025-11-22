import PropTypes from 'prop-types';

export default function Section({ children }) {
  return (
    <div className='flex h-full w-full flex-col items-stretch justify-start gap-[20px] px-[20px] py-[40px]'>
      {children}
    </div>
  );
}

Section.propTypes = { children: PropTypes.node };
