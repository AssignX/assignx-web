import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * ButtonGroup 컴포넌트
 * @param {Array} buttons - 버튼 데이터 배열 [{ text, color, Icon, onClick }]
 * @param {"row" | "col"} direction - 버튼 정렬 방향 (기본값: "row")
 * @param {string} gap - 버튼 사이 간격 (Tailwind gap 클래스, 기본값: "gap-[5px]")
 */

export default function ButtonGroup({
  buttons = [],
  direction = 'row', // "row" || "col"
  gap = 'gap-[5px]',
}) {
  return (
    <div
      className={`flex ${direction === 'col' ? 'flex-col' : 'flex-row'}${gap}`}
    >
      {buttons.map((btn, index) => (
        <Button
          key={index}
          text={btn.text}
          color={btn.color}
          Icon={btn.Icon}
          onClick={btn.onClick}
        />
      ))}
    </div>
  );
}

ButtonGroup.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      color: PropTypes.oneOf(['red', 'lightgray', 'gold']),
      Icon: PropTypes.elementType,
      onClick: PropTypes.func,
    })
  ), // 버튼 리스트
  direction: PropTypes.oneOf(['row', 'col']), // row 또는 col
  gap: PropTypes.string, // tailwind gap 클래스
};
