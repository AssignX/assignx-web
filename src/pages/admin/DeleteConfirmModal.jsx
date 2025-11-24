import Modal from '@/components/modal/Modal.jsx';
import PropTypes from 'prop-types';

function DeleteConfirmModal({ setIsOpen, onConfirm }) {
  const handleConfirm = () => {
    if (onConfirm) {
      // 실제 삭제 함수
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
      title='삭제하시겠습니까?'
      content={<div>선택한 항목을 삭제하시겠습니까?</div>}
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

DeleteConfirmModal.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
};

export default DeleteConfirmModal;
