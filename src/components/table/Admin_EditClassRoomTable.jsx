// 실험용
import { useMemo } from 'react';
import VerticalTable from './VerticalTable';
import { InputCell } from './cells/InputCell';
import { PlusCell } from './cells/PlusCell';

const initialData = [
  {
    id: '1',
    buildingNo: 451,
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: 348,
    capacity: 60,
  },
  {
    id: '2',
    buildingNo: 451,
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: 352,
    capacity: 45,
  },
  {
    id: '3',
    buildingNo: 451,
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: 355,
    capacity: 55,
  },
  { id: 'new-row', isNew: true },
];

export default function Admin_EditClassRoomTable() {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        size: 50,
        cell: ({ row }) => {
          return row.original.isNew ? <PlusCell /> : row.index + 1;
        },
      },
      {
        accessorKey: 'buildingNo',
        header: '건물 번호',
        size: 200,
        cell: ({ row, cell }) => {
          return row.original.isNew ? (
            <InputCell placeholder='검색된 건물 번호' />
          ) : (
            cell.getValue()
          );
        },
      },
      {
        accessorKey: 'buildingName',
        header: '건물 이름',
        size: 420,
        cell: ({ row, cell }) => {
          return row.original.isNew ? (
            <InputCell placeholder='검색된 건물 이름' />
          ) : (
            cell.getValue()
          );
        },
      },
      {
        accessorKey: 'roomNo',
        header: '강의실 번호',
        size: 200,
        cell: ({ row, cell }) => {
          return row.original.isNew ? (
            <InputCell placeholder='검색된 강의실 번호' />
          ) : (
            cell.getValue()
          );
        },
      },
      {
        accessorKey: 'capacity',
        header: '수용인원',
        size: 200,
        cell: ({ row, cell }) => {
          return row.original.isNew ? (
            <InputCell placeholder='검색된 강의실 수용인원' />
          ) : (
            cell.getValue()
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      <h1>수정 가능한 강의실 목록</h1>
      <VerticalTable columns={columns} data={initialData} selectable={true} />
    </div>
  );
}
