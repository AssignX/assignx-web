import React from 'react';
import PropTypes from 'prop-types';
import Button from '../buttons/Button.jsx';
import { CloseIcon } from '@/assets/icons';

/**
 * Modal 컴포넌트
 * 화면 중앙에 표시되는 모달 창으로, 제목 / 본문 / 확인 및 취소 버튼을 포함합니다.
 * content에는 단순 문자열뿐 아니라 테이블, 폼 등 React 노드를 자유롭게 전달할 수 있습니다.
 *
 * @param {string} title - 모달 상단에 표시할 제목 (기본값: "제목")
 * @param {React.ReactNode} content - 모달 본문에 표시할 내용 (문자열 또는 JSX 컴포넌트)
 * @param {string} confirmText - 확인 버튼에 표시할 텍스트 (기본값: "확인")
 * @param {string} cancelText - 취소 버튼에 표시할 텍스트 (기본값: "취소")
 * @param {function} onConfirm - 확인 버튼 클릭 시 실행할 함수
 * @param {function} onCancel - 취소 버튼 클릭 시 실행할 함수
 * @param {function} onClose - 닫기(X) 버튼 클릭 시 실행할 함수
 * @param {string} width - 모달의 너비
 * @param {string} height - 모달의 높이
 */

export default function Modal({
  title = '제목',
  content = '내용을 입력하세요.',
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  onClose,
  width,
  height,
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
      <div
        className={`relative flex h-auto max-h-[80vh] min-h-[200px] w-auto max-w-[70vw] min-w-[400px] flex-col bg-[var(--color-white)] shadow-lg`}
        style={{ width: width || 'auto', height: height || 'auto' }}
      >
        {/* 헤더 */}
        <div className='flex items-center justify-between bg-[var(--color-dark-gray)] px-4 py-2'>
          <span className='text-sm font-bold text-white'>{title}</span>
          <button
            onClick={onClose}
            className='text-white transition hover:opacity-80'
            aria-label='닫기'
          >
            <CloseIcon className='h-4 w-4 fill-white' />
          </button>
        </div>

        {/* 본문: 스크롤 가능 영역 - header와 footer는 고정 */}
        <div className='flex min-h-0 flex-1 flex-col px-4 py-4'>
          {/* 본문 내용: overflow auto로 스크롤 허용, min-h-0 필요 */}
          <div className='flex-1 overflow-auto text-sm leading-relaxed text-[var(--color-text-main)]'>
            {content}
          </div>

          {/* 버튼 영역 */}
          <div className='flex justify-center gap-4 pt-[16px]'>
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
