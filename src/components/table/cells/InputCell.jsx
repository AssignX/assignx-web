import PropTypes from 'prop-types';

/**
 * 테이블 셀 내에서 사용되는 기본 텍스트 입력(input) 컴포넌트
 * @param {string} value - 입력 필드의 현재 값 (필수)
 * @param {function} onChange - 입력 값이 변경될 때 호출되는 콜백 함수 (필수)
 * @param {function} onKeyDown - 키보드 키가 눌렸을 때 호출되는 콜백 함수 (선택)
 * @param {function} onBlur - 입력 필드가 포커스를 잃었을 때 호출되는 콜백 함수 (선택)
 * @param {boolean} disabled - 입력 필드를 비활성화할지 여부 (기본값: false)
 * @param {string} className - 추가적으로 적용할 Tailwind CSS 클래스 문자열 (선택)
 * @param {number} height - 입력 필드의 높이(px).  (기본값(VerticalTable): 26px(row=35px일 때), HorizontalTable은 32px로 설정(row=41px일 때))
 */

export default function InputCell({
  value,
  onChange,
  onKeyDown,
  onBlur,
  disabled,
  className,
  height = 26,
  type = 'text',
}) {
  const defaultClassName = `w-full border border-table-border p-2.5 text-[13px] ${
    disabled ? 'bg-inputCell-disabled' : ''
  }`;

  const finalClassName = `${defaultClassName} ${className || ''}`.trim();

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      disabled={disabled}
      className={finalClassName}
      style={{ height: `${height}px` }}
    />
  );
}

InputCell.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  height: PropTypes.number,
  type: PropTypes.string,
};

InputCell.defaultProps = { disabled: false, type: 'text' };
