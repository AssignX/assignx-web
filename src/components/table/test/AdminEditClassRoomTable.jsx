import { useMemo, useState } from 'react';
import VerticalTable from '../VerticalTable';
import { PlusCell } from '../cells/PlusCell';

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

export default function AdminEditClassRoomTable() {
  const [newRows, setNewRows] = useState([]);

  const handleAddNewRow = () => {
    const newRow = {
      id: `new-${Date.now()}`,
      buildingNo: '',
      buildingName: '',
      roomNo: '',
      capacity: 0,
      isNew: true,
    };
    setNewRows((current) => [...current, newRow]);
  };

  const handleNewRowChange = (rowId, columnKey, value) => {
    setNewRows((current) =>
      current.map((row) =>
        row.id === rowId ? { ...row, [columnKey]: value } : row
      )
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        size: 50,
        cell: ({ row }) => row.index + 1,
      },
      { accessorKey: 'buildingNo', header: '건물 번호', size: 200 },
      { accessorKey: 'buildingName', header: '건물 이름', size: 420 },
      { accessorKey: 'roomNo', header: '강의실 번호', size: 200 },
      { accessorKey: 'capacity', header: '수용인원', size: 200 },
    ],
    []
  );

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>수정 가능한 강의실 목록</h1>
      <div>
        <button
          onClick={handleAddNewRow}
          className='rounded border px-4 py-2 text-sm font-semibold text-black shadow-sm'
        >
          추가
        </button>
      </div>

      <VerticalTable
        columns={columns}
        data={initialData}
        selectable={true}
        newRows={newRows}
        onNewRowChange={handleNewRowChange}
        renderNewRowActions={() => (
          <div className='flex items-center justify-center space-x-2'>
            <PlusCell />
          </div>
        )}
      />
    </div>
  );
}
