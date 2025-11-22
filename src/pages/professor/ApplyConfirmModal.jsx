import Modal from '@/components/modal/Modal.jsx';
import PropTypes from 'prop-types';

function ApplyConfirmModal({ setIsOpen, onConfirm }) {
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
      title='1차 신청'
      content={<div>신청하시겠습니까?</div>}
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

ApplyConfirmModal.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
};

export default ApplyConfirmModal;
