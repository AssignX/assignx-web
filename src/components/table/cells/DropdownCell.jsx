import PropTypes from 'prop-types';

/**
 * 테이블 셀 내에서 사용되는 드롭다운(select) 컴포넌트
 * @param {string} initialValue - 드롭다운의 초기 선택 값 (필수)
 * @param {string} rowId - 현재 셀이 속한 행(row)의 고유 ID (필수)
 * @param {string} columnKey - 현재 셀이 속한 열(column)의 키 (필수)
 * @param {function} updateData - 값이 변경될 때 호출되는 콜백 함수. `(rowId, columnKey, newValue)`를 인자로 받음 (필수)
 * @param {Array<Object>} options - 드롭다운에 표시될 옵션 객체 배열 (필수). 각 객체는 `{ value: string, label: string }` 형태여야 함
 * @param {number} height - 드롭다운의 높이(px). (기본값(VerticalTable): 26px(row=35px일 때), HorizontalTable은 32px로 설정(row=41px일 때))
 */

export default function DropdownCell({
  initialValue,
  rowId,
  columnKey,
  updateData,
  options, // dropdown options
  height = 26,
}) {
  const onChange = (e) => {
    const newValue = e.target.value;

    updateData(rowId, columnKey, newValue);
  };

  return (
    <select
      value={initialValue}
      onChange={onChange}
      className='border-table-border w-full border px-2.5 text-[13px]'
      style={{ height: `${height}px` }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

DropdownCell.propTypes = {
  initialValue: PropTypes.string.isRequired,
  rowId: PropTypes.string.isRequired,
  columnKey: PropTypes.string.isRequired,
  updateData: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  height: PropTypes.number,
};
