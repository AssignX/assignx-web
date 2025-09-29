import { useMemo, useState } from 'react';
import VerticalTable from './VerticalTable';

const initialData = [
  {
    id: '1',
    buildingNo: '451',
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: '348',
    capacity: '60',
  },
  {
    id: '2',
    buildingNo: '451',
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: '352',
    capacity: '45',
  },
  {
    id: '3',
    buildingNo: '451',
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: '355',
    capacity: '55',
  },
];

const emptyNewRow = {
  buildingNo: '',
  buildingName: '',
  roomNo: '',
  capacity: '',
};

export default function Admin_EditClassRoomTable() {
  const [newRowData, setNewRowData] = useState(emptyNewRow);

  const handleNewRowChange = (columnId, value) => {
    setNewRowData((prev) => ({ ...prev, [columnId]: value }));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        size: 50,
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'buildingNo',
        header: '건물 번호',
        size: 200,
        cell: ({ cell }) => cell.getValue(),
      },
      {
        accessorKey: 'buildingName',
        header: '건물 이름',
        size: 420,
        cell: ({ cell }) => cell.getValue(),
      },
      {
        accessorKey: 'roomNo',
        header: '강의실 번호',
        size: 200,
        cell: ({ cell }) => cell.getValue(),
      },
      {
        accessorKey: 'capacity',
        header: '수용인원',
        size: 200,
        cell: ({ cell }) => cell.getValue(),
      },
    ],
    []
  );

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>수정 가능한 강의실 목록</h1>
      <VerticalTable
        columns={columns}
        data={initialData}
        selectable={true}
        useNewRow={true}
        newRowState={newRowData}
        onNewRowChange={handleNewRowChange}
      />
    </div>
  );
}
