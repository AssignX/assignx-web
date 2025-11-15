import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import InputCell from '@/components/table/cells/InputCell';
import PlusCell from '@/components/table/cells/PlusCell';
import { SaveIcon } from '@/assets/icons';
import { useEffect, useState } from 'react';

const ClassroomColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '강의실 번호', accessorKey: 'classRoomNumber', size: 400 },
  { header: '수용인원', accessorKey: 'capacity', size: 400 },
];

const classroomDummyData = [
  { id: 1, number: 1, classRoomNumber: '123', capacity: 30 },
  { id: 2, number: 2, classRoomNumber: '124', capacity: 50 },
];

/* 남은 할 일
1. 삭제 모달
2. URL endpoint에 따라 추가/수정 모드 구분
3. dummyData 대신 API 연동하여 데이터 불러오기
4. 간격 조정

++ buildingData를 받아와서, classRoomData로 변경할 때 (fetch 함수에서)
roomId와 같은 id를 추가해야 함
*/
function BuildingEditPage() {
  const [buildingNumber, setBuildingNumber] = useState('');
  const [buildingName, setBuildingName] = useState('');

  const [classroomData, setClassroomData] = useState([]);

  const [classroomNewRows, setClassroomNewRows] = useState([]);

  const [classroomSelectedRows, setClassroomSelectedRows] = useState([]);

  const departmentInfo = [
    {
      id: 'buildingNumber',
      label: '건물 번호',
      labelWidth: '130px',
      contentWidth: '300px',
      content: (
        <InputCell
          value={String(buildingNumber)}
          height={32}
          onChange={(e) => setBuildingNumber(e.target.value)}
        />
      ),
    },
    {
      id: 'buildingName',
      label: '건물 이름',
      labelWidth: '130px',
      contentWidth: '300px',
      content: (
        <InputCell
          value={String(buildingName)}
          height={32}
          onChange={(e) => setBuildingName(e.target.value)}
        />
      ),
    },
  ];

  useEffect(() => {
    // Fetch classroom data from API
    setClassroomData(classroomDummyData);
  }, []);

  const handleAddClassroomRow = () => {
    const newRow = {
      id: `new-${Date.now()}`,
      classRoomNumber: '',
      capacity: '',
      isNew: true,
    };
    setClassroomNewRows((prev) => [...prev, newRow]);
  };
  const handleClassroomNewRowChange = (rowId, key, value) => {
    setClassroomNewRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
    );
  };

  const handleDeleteClassroomRows = () => {
    if (classroomSelectedRows.length === 0) {
      alert('삭제할 강의실을 선택해주세요.');
      return;
    }
    // modal

    // delete API 호출
    setClassroomData((prev) =>
      prev.filter((row) => !classroomSelectedRows.includes(row.id))
    );

    setClassroomSelectedRows([]);
  };

  return (
    <Section>
      <div>
        <PageHeader
          title='건물 정보'
          buttonsData={[
            { text: '저장', color: 'gold', Icon: SaveIcon, onClick: () => {} },
          ]}
        />
        <HorizontalTable items={departmentInfo} />
      </div>

      <div>
        <SectionHeader
          title='강의실 목록'
          controlGroup='buttonGroup'
          buttonsData={[
            {
              text: '추가',
              color: 'lightgray',
              onClick: handleAddClassroomRow,
            },
            {
              text: '삭제',
              color: 'lightgray',
              onClick: handleDeleteClassroomRows,
            },
          ]}
          // 추가일 경우 buttonsDat 그대로 하고 수정일 경우 수정 버튼 추가 필요
        />
        <VerticalTable
          columns={ClassroomColumns}
          data={classroomData}
          headerHeight={40}
          selectable={true}
          updateSelection={setClassroomSelectedRows}
          newRows={classroomNewRows}
          onNewRowChange={handleClassroomNewRowChange}
          renderNewRowActions={() => <PlusCell />}
        />
      </div>
    </Section>
  );
}

export default BuildingEditPage;
