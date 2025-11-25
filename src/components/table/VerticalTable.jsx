import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { SelectionColumn } from './SelectionColumn';
import PropTypes from 'prop-types';
import InputCell from './cells/InputCell';

/**
 * 세로형 테이블
 * @param {array} columns - 테이블의 열을 정의하는 객체 배열 (필수)
 * @param {array} data - 테이블에 표시할 실제 데이터 배열 (기본값: [])
 * @param {number} headerHeight - 테이블 헤더의 높이 (기본값: 32px, sy페이지만 39.4px로 설정)
 * @param {number} maxHeight - 테이블의 최대 높이 (px 단위, 기본값: 700px). 이 높이를 초과하면 스크롤이 생성됨.
 * @param {function} updateSelection - 행 선택 상태가 변경될 때 호출되는 콜백 함수. 선택된 row ID 배열을 인자로 받음
 * @param {boolean} selectable - 행 선택 체크박스 표시 여부 (기본값: false)
 * @param {boolean} singleSelect - 단일 선택 모드 여부로 true: 한 번에 한 행만 선택 가능, false: 여러 행 동시 선택 가능 (기본값: false)
 * @param {array} newRows - 테이블 하단에 추가할 새로운 행들의 데이터 배열 (기본값: [])
 * @param {function} onNewRowChange - '새로운 행'의 InputCell 값이 변경될 때 호출되는 콜백 함수. (rowIndex, columnKey, value)를 인자로 받음
 * @param {function} renderNewRowActions - '새로운 행'의 첫 번째 액션 셀을 렌더링하는 함수. (rowIndex)를 인자로 받음
 * @param {boolean} resetSelection - 새로고침/필터링 시 선택된 행(rowSelection) 초기화 기능 (기본값: false-초기화 기능 사용 X)
 */
export default function VerticalTable({
  columns,
  data = [],
  headerHeight = 32,
  maxHeight = 700,
  updateSelection,
  selectable = false,
  singleSelect = false,
  newRows = [],
  onNewRowChange = () => {},
  renderNewRowActions = () => null,
  resetSelection = false,
}) {
  const [rowSelection, setRowSelection] = useState({});

  // resetSelection 변하면 선택 초기화
  useEffect(() => {
    setRowSelection({});
  }, [resetSelection]);

  const handleRowSelectionChange = (updater) => {
    let newSelection =
      typeof updater === 'function' ? updater(rowSelection) : updater;

    if (singleSelect) {
      const selectedIds = Object.keys(newSelection).filter(
        (key) => newSelection[key]
      );

      let lastSelected;
      if (selectedIds.length === 1) {
        lastSelected = selectedIds[0];
      } else if (selectedIds.length > 1) {
        lastSelected = selectedIds.find((id) => !rowSelection[id]);
      }

      if (lastSelected) newSelection = { [lastSelected]: true };
      else newSelection = {};
    }

    setRowSelection(newSelection);

    if (updateSelection) {
      const selectedRowIds = Object.keys(newSelection).filter(
        (key) => newSelection[key]
      );
      updateSelection(selectedRowIds);
    }
  };

  const tableColumns = selectable
    ? [SelectionColumn(singleSelect), ...columns]
    : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    ...(selectable && {
      state: { rowSelection },
      onRowSelectionChange: handleRowSelectionChange,
      getRowId: (row) => row.id,
    }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const dataColumns = columns;

  return (
    <div
      className='h-full overflow-y-auto bg-white'
      style={{ maxHeight: `${maxHeight}px` }}
    >
      <table className='border-table-border w-full table-fixed border-separate border-spacing-0 text-[13px]'>
        <thead className='sticky top-0 z-10'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`border-table-border bg-table-header-background text-table-header-text border-t border-b border-l p-1 text-center first:border-l last:border-r`}
                  style={{
                    width: header.getSize(),
                    height: `${headerHeight}px`,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={selectable && row.getIsSelected() ? 'select_row' : ''}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className='border-table-border h-[35px] border-b border-l p-1 text-center last:border-r'
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {newRows.length > 0 && (
          <tfoot className='sticky bottom-0 z-10'>
            {newRows.map((newRowData, rowIndex) => (
              <tr
                key={newRowData.id || `new-row-${rowIndex}`}
                className='bg-white'
              >
                {selectable && (
                  <td className='border-table-border h-[35px] border-b border-l last:border-r'></td>
                )}
                <td className='border-table-border h-[35px] border-b border-l p-1 text-center last:border-r'>
                  <div className='flex items-center justify-center'>
                    {renderNewRowActions(newRowData.id)}
                  </div>
                </td>
                {dataColumns.slice(1).map((column) => (
                  <td
                    key={column.accessorKey}
                    className='border-table-border h-[35px] border-b border-l p-1 text-center last:border-r'
                  >
                    <InputCell
                      value={newRowData[column.accessorKey] || ''}
                      onChange={(e) =>
                        onNewRowChange(
                          newRowData.id,
                          column.accessorKey,
                          e.target.value
                        )
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  );
}

VerticalTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  headerHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  updateSelection: PropTypes.func,
  selectable: PropTypes.bool,
  singleSelect: PropTypes.bool,
  newRows: PropTypes.array,
  onNewRowChange: PropTypes.func,
  renderNewRowActions: PropTypes.func,
  resetSelection: PropTypes.bool,
};
