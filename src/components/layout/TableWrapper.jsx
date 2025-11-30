import PropTypes from 'prop-types';

export default function TableWrapper({ height, children }) {
  const style = height ? { height, maxHeight: height } : undefined;

  return (
    <div
      className={`bg-white ${height ? 'overflow-y-auto' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
}

TableWrapper.propTypes = { height: PropTypes.string, children: PropTypes.node };
