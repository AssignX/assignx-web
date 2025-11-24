import Modal from '@/components/modal/Modal.jsx';
import PropTypes from 'prop-types';

function ConfirmModal({ setIsOpen, onConfirm, title, body }) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title={title}
      content={<div>{body}</div>}
      confirmText='확인'
      cancelText='취소'
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      onClose={handleClose}
      width
      height
      maxWidth='400px'
      maxHeight='200px'
    />
  );
}

ConfirmModal.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default ConfirmModal;
