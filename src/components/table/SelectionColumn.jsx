export const SelectionColumn = {
  id: 'select',
  header: ({ table }) => (
    <input
      type='checkbox'
      checked={table.getIsAllRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: ({ row }) => (
    <input
      type='checkbox'
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
    />
  ),
  size: 35,
  enableSorting: false,
  enableHiding: false,
};
