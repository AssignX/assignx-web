import { useMemo } from 'react';
import VerticalTable from '@/components/table/VerticalTable';

export default function SYClassRoomTable() {
  const columns = useMemo(
    () => [
      { accessorKey: 'no', header: 'No', size: 50 },
      { accessorKey: 'buildingName', header: '건물명', size: 245 },
      { accessorKey: 'room', header: '강의실', size: 195 },
    ],
    []
  );

  const data = useMemo(() => []);

  const isSelectable = false;

  return (
    <VerticalTable columns={columns} data={data} selectable={isSelectable} />
  );
}
