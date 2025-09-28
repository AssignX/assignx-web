import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button 컴포넌트
 * @param {string} text - 버튼에 표시될 텍스트 (기본값: "button")
 * @param {string} color - 버튼 색상 ("red" | "lightgray" | "gold")
 * @param {string} textSize - 텍스트 크기 (Tailwind text-클래스, 기본값: "text-sm")
 * @param {React.ElementType} Icon - 버튼 안에 표시할 아이콘 컴포넌트
 * @param {function} onClick - 클릭 이벤트 핸들러
 */

export default function Button({
  text = 'button',
  color = 'gray', // red |
  textSize = 'text-sm',
  Icon,
  onClick,
}) {
  // 색상 매핑
  const colors = {
    red: {
      bg: 'bg-[var(--color-red)]',
      text: 'text-[var(--color-white)]',
      hover: 'hover:opacity-90',
    },
    lightgray: {
      bg: 'bg-[var(--color-light-gray)]',
      text: 'text-black',
      hover: 'hover:opacity-90',
    },
    gold: {
      bg: 'bg-[var(--color-gold)]',
      text: 'text-[var(--color-white)]',
      hover: 'hover:opacity-90',
    },
  };

  const selected = colors[color] || colors.red;

  return (
    <button
      type='button'
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className={`flex items-center justify-center gap-1 ${selected.bg} ${selected.text} ${selected.hover}w-auto h-[30px] ${textSize} ${Icon ? 'px-[10px]' : 'px-4'} ouline-none rounded-none font-normal transition duration-200 focus:ring-0`}
    >
      {Icon && (
        <Icon className='relative top-[1px]' w-4 h-4 aria-hidden='true' />
      )}
      {text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired, // 반드시 문자열
  color: PropTypes.oneOf(['red', 'lightgray', 'gold']), // 3개 중 하나
  textSize: PropTypes.string, // Tailwind 사이즈 클래스
  Icon: PropTypes.elementType, // react component
  onClick: PropTypes.func, // 함수 -  클릭 이벤트 핸들러
};
