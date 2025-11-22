import PropTypes from 'prop-types';

export default function TableWrapper({ height, children }) {
  return (
    <div className='bg-white' style={{ height }}>
      {children}
    </div>
  );
}

TableWrapper.propTypes = { height: PropTypes.string, children: PropTypes.node };
