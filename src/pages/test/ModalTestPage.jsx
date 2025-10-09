import { useState } from 'react';
import BaseModal from '@/components/modal/BaseModal.jsx';
import Button from '@/components/buttons/Button.jsx';

export default function ModalTestPage() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    alert('일정이 수정되었습니다.');
    setIsOpen(false);
  };

  const handleCancel = () => {
    alert('수정을 취소했습니다.');
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center bg-gray-100'>
      <h1 className='mb-6 text-[20px] font-semibold text-[var(--color-text-main)]'>
        Modal Test Page
      </h1>

      <Button
        text='모달 열기'
        color='gold'
        onClick={() => setIsOpen(true)}
        textSize='text-[16px]'
      />

      {isOpen && (
        <BaseModal
          title='일정 수정'
          content='일정을 수정하시겠습니까?'
          confirmText='확인'
          cancelText='취소'
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onClose={handleClose}
          width
          height
        />
      )}
    </div>
  );
}
