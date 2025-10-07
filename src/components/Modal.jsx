import React from 'react';
import PropTypes from 'prop-types';
import Button from './buttons/Button.jsx';
import { CloseIcon } from '@/assets/icons';

export default function Modal({
  title = '제목',
  content = '내용을 입력하세요.',
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  onClose,
  width = '400px',
  height = '200px',
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
      <div
        className='relative flex flex-col rounded-md bg-[var(--color-white)] shadow-lg'
        style={{ width, height }}
      >
        {/* 헤더 */}
        <div className='flex items-center justify-between rounded-t-md bg-[var(--color-dark-gray)] px-4 py-3'>
          <span className='text-sm font-bold text-white'>{title}</span>
          <button
            onClick={onClose}
            className='text-white transition hover:opacity-80'
            aria-label='닫기'
          >
            <CloseIcon className='h-4 w-4 fill-white' />
          </button>
        </div>

        {/* 본문 + 버튼 영역 */}
        <div className='flex flex-1 flex-col justify-between px-4 py-4'>
          {/* 본문 내용 */}
          <div className='text-sm leading-relaxed text-[var(--color-text-main)]'>
            {content}
          </div>

          {/* 버튼 영역 */}
          <div className='mt-10 flex justify-center gap-4'>
            <Button
              text={confirmText}
              color='red'
              onClick={onConfirm}
              textSize='text-sm'
            />
            <Button
              text={cancelText}
              color='lightgray'
              onClick={onCancel}
              textSize='text-sm'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
};
