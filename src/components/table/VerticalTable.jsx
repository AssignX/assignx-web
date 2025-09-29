import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import { SelectionColumn } from './SelectionColumn';
import PropTypes from 'prop-types';

/**
 * 세로형 테이블
 * @param {array} columns - 테이블의 열을 정의하는 객체 배열 (필수)
 * @param {array} data - 테이블에 표시할 실제 데이터 배열 (기본값: [])
 * @param {function} updateSelection - 행 선택 상태가 변경될 때 호출되는 콜백 함수. 선택된 row ID 배열을 인자로 받습니다.
 * @param {boolean} selectable - 행 선택 체크박스 표시 여부 (기본값: false)
 */

export default function VerticalTable({
  columns,
  data = [],
  updateSelection,
  selectable = false,
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

  return (
    <table className='w-full table-fixed border-collapse border border-[#D5D5D8]'>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className='h-10 border border-[#D5D5D8] bg-[#F1F2F4] px-2 py-1 text-center'
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
                className='h-10 border border-[#D5D5D8] px-2 py-1 text-center'
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

VerticalTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  updateSelection: PropTypes.func,
  selectable: PropTypes.bool,
};
