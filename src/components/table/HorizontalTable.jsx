import React from 'react';
import PropTypes from 'prop-types';

/**
 * 가로형 테이블
 * `items` 배열의 객체에 `label`이 없으면 단독 `<td>` 셀로 렌더링
 * @param {Array<Object>} items - 테이블에 표시할 항목 배열.
 * item : 각 셀을 정의하는 객체 배열
 * - id: (필수) 각 항목의 고유 키
 * - label: (필수) 라벨(헤더)에 표시될 텍스트
 * - content: (필수) 컨텐츠 영역에 렌더링될 React 노드 (문자열, JSX 등)
 * - required: (선택) 라벨 앞에 필수(*) 표시 여부
 * - labelWidth: (선택) 라벨 셀의 너비 (e.g., '120px')
 * - contentWidth: (선택) 컨텐츠 셀의 너비 (e.g., '250px')
 */

export default function HorizontalTable({ items = [] }) {
  return (
    <table className='border-table-border w-full table-auto border-collapse border'>
      <tbody>
        <tr>
          {items.map((item) =>
            item.label ? (
              <React.Fragment key={item.id}>
                <th
                  className='border-table-border bg-table-header-background text-table-header-text h-10 border px-3 py-1 text-center'
                  style={{ width: item.labelWidth || 'auto' }}
                >
                  {item.required && (
                    <span className='mr-1 text-red-500'>*</span>
                  )}
                  {item.label}
                </th>
                <td
                  className='border-table-border h-10 border px-2 py-1 align-middle'
                  style={{ width: item.contentWidth || 'auto' }}
                >
                  {item.content}
                </td>
              </React.Fragment>
            ) : (
              <td
                key={item.id}
                className='border-table-border h-10 border px-2 py-1 align-middle'
                style={{ width: item.contentWidth || 'auto' }}
              >
                {item.content}
              </td>
            )
          )}
        </tr>
      </tbody>
    </table>
  );
}

HorizontalTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string, // optional
      content: PropTypes.node.isRequired,
      required: PropTypes.bool,
      labelWidth: PropTypes.string,
      contentWidth: PropTypes.string,
    })
  ).isRequired,
};
