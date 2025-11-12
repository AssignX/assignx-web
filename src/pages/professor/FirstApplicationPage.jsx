import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import InputCell from '@/components/table/cells/InputCell';
import SearchCell from '@/components/table/cells/SearchCell';
import { SearchIcon } from '@/assets/icons';

import { useEffect, useCallback, useState } from 'react';
import DropdownCell from '../../components/table/cells/DropdownCell';

const unconfirmedTableColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: (info) => info.getValue(),
  },
  {
    header: '과목명',
    accessorKey: 'subjectName',
    size: 120,
    cell: (info) => info.getValue(),
  },
  {
    header: '과목코드',
    accessorKey: 'subjectCode',
    size: 100,
    cell: (info) => info.getValue(),
  },
  {
    header: '분반',
    accessorKey: 'classSection',
    size: 50,
    cell: (info) => info.getValue(),
  },
  {
    header: '강의시간',
    accessorKey: 'classTime',
    size: 200,
    cell: (info) => info.getValue(),
  },
  {
    header: '수강인원',
    accessorKey: 'studentCount',
    size: 64,
    cell: (info) => info.getValue(),
  },
  {
    header: '신청시간',
    accessorKey: 'applicationTime',
    size: 300,
    cell: (info) => {
      const rowData = info.row.original;
      const options = rowData.applicationOptions ?? [];
      return (
        <DropdownCell
          initialValue={rowData.applicationTime ?? ''} // 또는 info.getValue()
          options={options} // ⭐ row별 옵션 사용
          rowId={rowData.number.toString()} // 너가 구분에 쓰고 싶은 값
          columnKey='applicationTime'
          updateData={(rowId, columnKey, newValue) => {
            console.log('[신청시간 변경]', {
              rowId,
              columnKey,
              newValue,
              rowData,
            });
            // 여기서 setState로 실제 값 업데이트 하면 되고
            // DropdownCell은 그대로 둬도 됨
          }}
        />
      );
    },
  },
  {
    header: '강의실',
    accessorKey: 'classRoom',
    size: 150,
    cell: (info) => (
      <SearchCell
        initialValue={info.getValue() ?? ''}
        onSearch={(val) => {
          // 강의실 검색 모달 연결
          console.log('[강의실 검색]', { value: val, row: info.row.original });
        }}
      />
    ),
  },
];
const confirmedTableColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: (info) => info.getValue(),
  },
  {
    header: '과목명',
    accessorKey: 'subjectName',
    size: 120,
    cell: (info) => info.getValue(),
  },
  {
    header: '과목코드',
    accessorKey: 'subjectCode',
    size: 100,
    cell: (info) => info.getValue(),
  },
  {
    header: '분반',
    accessorKey: 'classSection',
    size: 50,
    cell: (info) => info.getValue(),
  },
  {
    header: '강의시간',
    accessorKey: 'classTime',
    size: 200,
    cell: (info) => info.getValue(),
  },
  {
    header: '확정 시간',
    accessorKey: 'confirmedTime',
    size: 300,
    cell: (info) => info.getValue(),
  },
  {
    header: '강의실',
    accessorKey: 'classRoom',
    size: 150,
    cell: (info) => info.getValue(),
  },
  {
    header: '수강인원',
    accessorKey: 'studentCount',
    size: 64,
    cell: (info) => info.getValue(),
  },
  {
    header: '확정여부',
    accessorKey: 'confirmationStatus',
    size: 100,
    cell: (info) => info.getValue(),
  },
];

const dummyUnconfirmedTableRows = [
  {
    number: 1,
    subjectName: '자료구조',
    subjectCode: 'CS101',
    classSection: '1',
    classTime: '월 10:00-12:00',
    classRoom: 'A101',
    studentCount: 45,
    applicationTime: '2024-06-01 09:00~12:00',
    applicationOptions: [
      { value: '2024-06-01 09:00~12:00', label: '2024-06-01 09:00~12:00' },
      { value: '2024-06-01 10:00~12:00', label: '2024-06-01 10:00~12:00' },
    ],
  },
  {
    number: 2,
    subjectName: '운영체제',
    subjectCode: 'CS102',
    classSection: '2',
    classTime: '화 14:00-16:00',
    classRoom: 'B202',
    studentCount: 40,
    applicationTime: '2024-06-01 10:00',
    applicationOptions: [
      { value: '2024-06-01 10:30~12:00', label: '2024-06-01 10:30~12:00' },
      { value: '2024-06-01 12:00~13:00', label: '2024-06-01 12:00~13:00' },
    ],
  },
];
const dummyConfirmedTableRows = [
  {
    number: 1,
    subjectName: '알고리즘',
    subjectCode: 'CS201',
    classSection: '1',
    classTime: '수 10:00-12:00',
    confirmedTime: '2024-06-02 09:00~12:00',
    classRoom: 'C303',
    studentCount: 50,
    confirmationStatus: '확정',
  },
  {
    number: 2,
    subjectName: '데이터베이스',
    subjectCode: 'CS202',
    classSection: '2',
    classTime: '목 14:00-16:00',
    confirmedTime: '2024-06-02 10:00~12:00',
    classRoom: 'D404',
    studentCount: 35,
    confirmationStatus: '확정',
  },
];

function FirstApplicationPage() {
  const [openYear, setOpenYear] = useState(2025);
  const [openSemester, setOpenSemester] = useState('1학기');
  const [department, setDepartment] = useState('컴퓨터공학과');
  const [professorId, setProfessorId] = useState('학번');
  const [professorName, setProfessorName] = useState('홍길동');
  const [unconfirmedTableRows, setUnconfirmedTableRows] = useState({});
  const [confirmedTableRows, setConfirmedTableRows] = useState({});

  const fetchUserData = useCallback(() => {
    setOpenYear(2025);
    setOpenSemester('1학기');
    setDepartment('컴퓨터공학과');
    setProfessorId('학번');
    setProfessorName('홍길동');
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const filterItems = [
    {
      id: 'openYear',
      label: '개설연도',
      required: true,
      labelWidth: '80px',
      contentWidth: '80px',
      content: (
        <InputCell value={String(openYear)} height={32} disabled={true} />
      ),
    },
    {
      id: 'openSemester',
      label: '개설학기',
      required: true,
      labelWidth: '80px',
      contentWidth: '80px',
      content: (
        <InputCell value={String(openSemester)} height={32} disabled={true} />
      ),
    },
    {
      id: 'department',
      label: '소속학과',
      required: true,
      labelWidth: '80px',
      contentWidth: '220px', // fill
      content: <InputCell value={department} height={32} disabled={true} />,
    },
    {
      id: 'professorId',
      label: '학번',
      required: true,
      labelWidth: '60px',
      contentWidth: '120px',
      content: <InputCell value={professorId} height={32} disabled={true} />,
    },
    {
      id: 'professorName',
      label: '이름',
      required: true,
      labelWidth: '60px',
      contentWidth: '80px',
      content: <InputCell value={professorName} height={32} disabled={true} />,
    },
  ];

  useEffect(() => {
    // fetch 함수
    setUnconfirmedTableRows(dummyUnconfirmedTableRows);
    setConfirmedTableRows(dummyConfirmedTableRows);
  }, []);

  return (
    <Section>
      <div className='isolate'>
        <PageHeader
          title='1차 시험 신청'
          helperText='※해당 시간표는 시스템 선정 기준 유력 후보 1순위만 표기하고 있습니다.'
          buttonsData={[
            {
              text: '검색',
              color: 'lightgray',
              Icon: SearchIcon,
              onClick: () => {},
            },
          ]}
        />
        <HorizontalTable items={filterItems} />
      </div>

      {/* 시간표 카드 */}
      <div className='isolate'>
        <SectionHeader
          title='미확정 과목 목록'
          subtitle='5건'
          controlGroup='buttonGroup'
          buttonsData={[{ text: '신청', color: 'red', onClick: () => {} }]}
        />
        <VerticalTable
          columns={unconfirmedTableColumns}
          data={unconfirmedTableRows}
          headerHeight={40}
          maxHeight={240}
          selectable={true}
        />
      </div>

      <div className='isolate'>
        <SectionHeader title='확정 과목 목록' subtitle='5건' />
        <VerticalTable
          columns={confirmedTableColumns}
          data={confirmedTableRows}
          headerHeight={40}
          maxHeight={240}
          selectable={false}
        />
      </div>
    </Section>
  );
}

export default FirstApplicationPage;
