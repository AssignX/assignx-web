import PropTypes from 'prop-types';

export default function Section({ children }) {
  return (
    <div className='border-border-contents flex h-full w-full min-w-0 flex-col items-stretch justify-start gap-[20px] overflow-x-hidden border px-[20px] py-[40px]'>
      {children}
    </div>
  );
}

Section.propTypes = { children: PropTypes.node };
