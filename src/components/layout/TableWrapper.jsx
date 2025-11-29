import PropTypes from 'prop-types';

export default function TableWrapper({ height, children, className }) {
  return (
    <div className={`bg-white ${className ?? ''}`} style={{ height }}>
      {children}
    </div>
  );
}

TableWrapper.propTypes = {
  height: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};
