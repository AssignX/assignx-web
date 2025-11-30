export const SelectionColumn = (
  singleSelect = false,
  hideCheckbox = false
) => ({
  id: 'select',
  header: ({ table }) =>
    singleSelect && hideCheckbox ? null : (
      <input
        type='checkbox'
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
  cell: ({ row }) =>
    singleSelect && hideCheckbox ? null : (
      <input
        type='checkbox'
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  size: singleSelect && hideCheckbox ? 0 : 30,
  enableSorting: false,
  enableHiding: false,
});
