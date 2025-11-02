export const SelectionColumn = (singleSelect = false) => ({
  id: 'select',
  header: ({ table }) =>
    singleSelect ? null : (
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
  size: 30,
  enableSorting: false,
  enableHiding: false,
});
