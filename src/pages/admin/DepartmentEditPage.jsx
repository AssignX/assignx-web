import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import InputCell from '@/components/table/cells/InputCell';
import PlusCell from '@/components/table/cells/PlusCell';
import { SaveIcon } from '@/assets/icons';

import EmployeeModal from './EmployeeModal';
import ClassRoomModal from '@/components/ClassRoomModal';
import SaveConfirmModal from './SaveConfirmModal';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const employeeColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '교번', accessorKey: 'employeeId', size: 200 },
  { header: '이름', accessorKey: 'name', size: 200 },
  { header: '소속학과', accessorKey: 'department', size: 400 },
];

const ClassroomColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '건물 번호', accessorKey: 'buildingNo', size: 200 },
  { header: '건물 이름', accessorKey: 'buildingName', size: 400 },
  { header: '강의실 번호', accessorKey: 'roomNo', size: 200 },
  { header: '수용 인원', accessorKey: 'capacity', size: 100 },
];

const employeeDummyData = [
  { id: '1', employeeId: 'EMP001', name: '홍길동', department: '컴퓨터공학' },
  { id: '2', employeeId: 'EMP002', name: '김철수', department: '전자공학과' },
  { id: '3', employeeId: 'EMP003', name: '이영희', department: '기계공학' },
];

const classroomDummyData = [
  {
    id: '1',
    buildingNo: '451',
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: '348',
    capacity: 60,
  },
  {
    id: '2',
    buildingNo: '451',
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: '352',
    capacity: 45,
  },
  {
    id: '3',
    buildingNo: '451',
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: '355',
    capacity: 55,
  },
];

/* 남은 할 일
1. dummyData 대신 API 연동하여 데이터 불러오기
2. 간격 조정
3. Row 수정 기능 구현 필요 (VerticalTable의 button)
*/
function DepartmentEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isClassRoomModalOpen, setIsClassRoomModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');

  const [employeeData, setEmployeeData] = useState([]);
  const [classroomData, setClassroomData] = useState([]);

  const [employeeSelectedRows, setEmployeeSelectedRows] = useState([]);
  const [classroomSelectedRows, setClassroomSelectedRows] = useState([]);

  const [employeeNewRows, setEmployeeNewRows] = useState([]);
  const [classroomNewRows, setClassroomNewRows] = useState([]);

  const departmentInfo = [
    {
      id: 'college',
      label: '단과대학',
      required: false,
      labelWidth: '130px',
      contentWidth: '300px',
      content: (
        <InputCell
          value={String(college)}
          height={32}
          onChange={(e) => setCollege(e.target.value)}
        />
      ),
    },
    {
      id: 'department',
      label: '학과',
      required: false,
      labelWidth: '130px',
      contentWidth: '300px',
      content: (
        <InputCell
          value={String(department)}
          height={32}
          onChange={(e) => setDepartment(e.target.value)}
        />
      ),
    },
  ];

  useEffect(() => {
    // Fetch employee data from API
    setEmployeeData(employeeDummyData);
    // Fetch classroom data from API
    setClassroomData(classroomDummyData);
  }, []);

  const handleEmployeeNewRowChange = (rowId, columnKey, value) => {
    setEmployeeNewRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [columnKey]: value } : row
      )
    );
  };

  const handleDeleteEmployeeRows = () => {
    if (employeeSelectedRows.length === 0) {
      alert('삭제할 직원을 선택해주세요.');
      return;
    }
    setEmployeeData((prev) =>
      prev.filter((row) => !employeeSelectedRows.includes(row.id))
    );
    setEmployeeSelectedRows([]);
  };

  const handleEditEmployeeRows = () => {
    // 수정은 추후 구현 예정
    console.log('수정', employeeSelectedRows);
  };

  const handleClassroomNewRowChange = (rowId, columnKey, value) => {
    setClassroomNewRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [columnKey]: value } : row
      )
    );
  };

  const handleDeleteClassroomRows = () => {
    if (classroomSelectedRows.length === 0) {
      alert('삭제할 강의실을 선택해주세요.');
      return;
    }
    setClassroomData((prev) =>
      prev.filter((row) => !classroomSelectedRows.includes(row.id))
    );
    setClassroomSelectedRows([]);
  };

  const handleSelectEmployee = (employees) => {
    setEmployeeData((prev) => {
      const newOnes = employees.filter(
        (emp) => !prev.some((row) => row.id === emp.id)
      );
      return [...prev, ...newOnes];
    });
  };

  const handleSelectClassRoom = (rooms) => {
    setClassroomData((prev) => {
      const newOnes = rooms.filter(
        (room) => !prev.some((r) => r.id === room.id)
      );
      return [...prev, ...newOnes];
    });
  };

  const handleOpenSaveModal = () => {
    setIsSaveModalOpen(true);
  };
  const handleConfirmSave = () => {
    // TODO: 실제 저장 API 호출
    navigate(-1); // 저장 후 이전 페이지로 이동
  };

  const employeeSectionButtons = isEditMode
    ? [
        {
          text: '추가',
          color: 'lightgray',
          onClick: () => setIsEmployeeModalOpen(true),
        },
        { text: '수정', color: 'lightgray', onClick: handleEditEmployeeRows },
        { text: '삭제', color: 'lightgray', onClick: handleDeleteEmployeeRows },
      ]
    : [
        {
          text: '추가',
          color: 'lightgray',
          onClick: () => setIsEmployeeModalOpen(true),
        },
        { text: '삭제', color: 'lightgray', onClick: handleDeleteEmployeeRows },
      ];

  return (
    <Section>
      <div>
        <PageHeader
          title='학과 목록'
          buttonsData={[
            {
              text: '저장',
              color: 'gold',
              Icon: SaveIcon,
              onClick: handleOpenSaveModal,
            },
          ]}
        />
        <HorizontalTable items={departmentInfo} />
      </div>

      <div>
        <SectionHeader
          title='직원 목록'
          controlGroup='buttonGroup'
          buttonsData={employeeSectionButtons}
        />
        <VerticalTable
          columns={employeeColumns}
          data={employeeData}
          headerHeight={40}
          maxHeight={160} // newRow에 의해 기존 Row가 짤리는 문제
          selectable={true}
          newRows={employeeNewRows}
          updateSelection={setEmployeeSelectedRows}
          onNewRowChange={handleEmployeeNewRowChange}
          renderNewRowActions={() => <PlusCell />}
        />
      </div>

      <div className='mt-8'>
        <SectionHeader
          title='강의실 목록'
          controlGroup='buttonGroup'
          buttonsData={[
            {
              text: '추가',
              color: 'lightgray',
              onClick: () => setIsClassRoomModalOpen(true),
            },
            {
              text: '삭제',
              color: 'lightgray',
              onClick: handleDeleteClassroomRows,
            },
          ]}
        />
        <VerticalTable
          columns={ClassroomColumns}
          data={classroomData}
          headerHeight={40}
          maxHeight={600}
          selectable={true}
          newRows={classroomNewRows}
          updateSelection={setClassroomSelectedRows}
          onNewRowChange={handleClassroomNewRowChange}
          renderNewRowActions={() => <PlusCell />}
        />
      </div>

      {isEmployeeModalOpen && (
        <EmployeeModal
          setIsOpen={setIsEmployeeModalOpen}
          onSelect={handleSelectEmployee}
        />
      )}
      {isClassRoomModalOpen && (
        <ClassRoomModal
          setIsOpen={setIsClassRoomModalOpen}
          onSelect={handleSelectClassRoom}
        />
      )}
      {isSaveModalOpen && (
        <SaveConfirmModal
          setIsOpen={setIsSaveModalOpen}
          onConfirm={handleConfirmSave}
        />
      )}
    </Section>
  );
}

export default DepartmentEditPage;
