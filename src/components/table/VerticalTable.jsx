import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import { SelectionColumn } from './SelectionColumn';
import PropTypes from 'prop-types';
import { InputCell } from './cells/InputCell';

/**
 * 세로형 테이블
 * @param {array} columns - 테이블의 열을 정의하는 객체 배열 (필수)
 * @param {array} data - 테이블에 표시할 실제 데이터 배열 (기본값: [])
 * @param {function} updateSelection - 행 선택 상태가 변경될 때 호출되는 콜백 함수. 선택된 row ID 배열을 인자로 받음
 * @param {boolean} selectable - 행 선택 체크박스 표시 여부 (기본값: false)
 * @param {array} newRows - 테이블 하단에 추가할 새로운 행들의 데이터 배열 (기본값: [])
 * @param {function} onNewRowChange - '새로운 행'의 InputCell 값이 변경될 때 호출되는 콜백 함수. (rowIndex, columnKey, value)를 인자로 받음
 * @param {function} renderNewRowActions - '새로운 행'의 첫 번째 액션 셀을 렌더링하는 함수. (rowIndex)를 인자로 받음
 */
export default function VerticalTable({
  columns,
  data = [],
  updateSelection,
  selectable = false,
  newRows = [],
  onNewRowChange = () => {},
  renderNewRowActions = () => null,
}) {
  const [rowSelection, setRowSelection] = useState({});

  const handleRowSelectionChange = (updater) => {
    setRowSelection(updater);
    if (updateSelection) {
      const newSelection =
        typeof updater === 'function' ? updater(rowSelection) : updater;
      const selectedRowIds = Object.keys(newSelection).filter(
        (key) => newSelection[key]
      );
      updateSelection(selectedRowIds);
    }
  };

  const tableColumns = selectable ? [SelectionColumn, ...columns] : columns;

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
    <table className='border-table-border w-full table-fixed border-collapse border'>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className='border-table-border bg-table-header-background text-table-header-text h-10 border px-2 py-1 text-center'
                style={{ width: header.getSize() }}
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
                className='border-table-border h-10 border px-2 py-1 text-center'
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {newRows.length > 0 && (
        <tfoot>
          {newRows.map((newRowData, rowIndex) => (
            <tr key={`new-row-${rowIndex}`}>
              {selectable && (
                <td className='border-table-border h-10 border'></td>
              )}
              <td className='border-table-border h-10 border px-2 py-1 text-center'>
                <div className='flex items-center justify-center'>
                  {renderNewRowActions(rowIndex)}
                </div>
              </td>
              {dataColumns.slice(1).map((column) => (
                <td
                  key={column.accessorKey}
                  className='border-table-border h-10 border px-2 py-1 text-center'
                >
                  <InputCell
                    value={newRowData[column.accessorKey] || ''}
                    onChange={(e) =>
                      onNewRowChange(
                        rowIndex,
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
  );
}

VerticalTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  updateSelection: PropTypes.func,
  selectable: PropTypes.bool,
  newRows: PropTypes.array,
  onNewRowChange: PropTypes.func,
  renderNewRowActions: PropTypes.func,
};
