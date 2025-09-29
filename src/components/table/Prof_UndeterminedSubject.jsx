// 실험용
import { useMemo, useState } from 'react';
import VerticalTable from './VerticalTable';
import { InputCell } from './cells/InputCell';
import { DropdownCell } from './cells/DropdownCell';

const timeOptions = [
  { value: '', label: '시간을 선택해주세요.' },
  { value: '2025/12/11(월) 16:30~18:00', label: '2025/12/11(월) 16:30~18:00' },
  { value: '2025/12/12(화) 16:30~18:00', label: '2025/12/12(화) 16:30~18:00' },
  { value: '2025/12/13(수) 10:00~11:30', label: '2025/12/13(수) 10:00~11:30' },
  { value: '2025/12/14(목) 16:30~18:00', label: '2025/12/14(목) 16:30~18:00' },
  { value: '2025/12/15(금) 16:30~18:00', label: '2025/12/15(금) 16:30~18:00' },
];

const initialData = [
  {
    id: '1',
    courseName: '서양의역사문화',
    courseCode: 'CLTR0043',
    section: '001',
    lectureTime: '화 8,9A,9B,목 8,9A,9B',
    enrolled: 70,
    requestedTime: '2025/12/12(화) 16:30~18:00',
    classroom: 'IT5-351',
  },
  {
    id: '2',
    courseName: '네트워크프로그래밍',
    courseCode: 'CLTR0043',
    section: '001',
    lectureTime: '화 8,9A,9B,목 8,9A,9B',
    enrolled: 70,
    requestedTime: '2025/12/12(화) 16:30~18:00',
    classroom: 'IT5-351',
  },
  {
    id: '3',
    courseName: '서양의역사문화',
    courseCode: 'CLTR0043',
    section: '001',
    lectureTime: '화 8,9A,9B,목 8,9A,9B',
    enrolled: 70,
    requestedTime: '2025/12/14(목) 16:30~18:00',
    classroom: 'IT5-351',
  },
];

export default function Prof_UndeterminedSubject() {
  const [data, setData] = useState(initialData);

  const updateData = (rowIndex, columnId, value) => {
    setData((old) =>
      old.map((row) => {
        if (row.id === rowIndex) {
          return { ...row, [columnId]: value };
        }
        return row;
      })
    );
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', size: 50 },
      { accessorKey: 'courseName', header: '과목명', size: 150 },
      { accessorKey: 'courseCode', header: '과목코드', size: 100 },
      { accessorKey: 'section', header: '분반', size: 50 },
      { accessorKey: 'lectureTime', header: '강의시간', size: 200 },
      { accessorKey: 'enrolled', header: '수강인원', size: 80 },
      {
        accessorKey: 'requestedTime',
        header: '신청 시간',
        size: 300,
        cell: ({ row, column, cell }) => (
          <DropdownCell
            initialValue={cell.getValue()}
            rowId={row.id}
            columnKey={column.id}
            updateData={updateData}
            options={timeOptions}
          />
        ),
      },
      {
        accessorKey: 'classroom',
        header: '강의실',
        size: 120,
        cell: ({ row, column, cell }) => (
          <InputCell
            initialValue={cell.getValue()}
            rowId={row.id}
            columnKey={column.id}
            updateData={updateData}
          />
        ),
      },
    ],
    []
  );

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>강의 시간 신청</h1>
      <VerticalTable columns={columns} data={data} selectable={true} />
    </div>
  );
}
