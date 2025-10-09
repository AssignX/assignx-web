import { useMemo } from 'react';
import VerticalTable from '../VerticalTable';

export default function SYClassRoomTable() {
  const columns = useMemo(
    () => [
      { accessorKey: 'no', header: 'No', size: 50 },
      { accessorKey: 'buildingName', header: '건물명', size: 245 },
      { accessorKey: 'room', header: '강의실', size: 195 },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        id: 'b101',
        no: 1,
        buildingName: 'IT대학5호관(IT융복합관)',
        room: 'B101',
      },
      {
        id: 'b102',
        no: 2,
        buildingName: 'IT대학5호관(IT융복합관)',
        room: 'B102',
      },
      {
        id: '224',
        no: 3,
        buildingName: 'IT대학5호관(IT융복합관)',
        room: '224',
      },
      {
        id: '245',
        no: 4,
        buildingName: 'IT대학5호관(IT융복합관)',
        room: '245',
      },
      {
        id: '248',
        no: 5,
        buildingName: 'IT대학5호관(IT융복합관)',
        room: '248',
      },
      {
        id: '251',
        no: 6,
        buildingName: 'IT대학5호관(IT융복합관)',
        room: '251',
      },
    ],
    []
  );

  const isSelectable = false;

  return (
    <div>
      <h1>강의실 목록</h1>

      <VerticalTable columns={columns} data={data} selectable={isSelectable} />
    </div>
  );
}
