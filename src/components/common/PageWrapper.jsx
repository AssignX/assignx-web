import PropTypes from 'prop-types';

export default function PageWrapper({ children }) {
  return <div className='flex h-screen w-screen flex-col'>{children}</div>;
}

PageWrapper.propTypes = { children: PropTypes.node };
