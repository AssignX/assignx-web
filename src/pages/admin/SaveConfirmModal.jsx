import Modal from '@/components/modal/Modal.jsx';
import PropTypes from 'prop-types';

function SaveConfirmModal({ setIsOpen, onConfirm }) {
  const handleConfirm = () => {
    if (onConfirm) {
      // 실제 저장 함수
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
      title='저장'
      content={<div>저장하시겠습니까?</div>}
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

SaveConfirmModal.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
};

export default SaveConfirmModal;
