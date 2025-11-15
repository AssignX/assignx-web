import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import InputCell from '@/components/table/cells/InputCell';
import { SaveIcon } from '@/assets/icons';
import { useEffect, useState } from 'react';

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
  { number: 1, employeeId: 'EMP001', name: '홍길동', department: '컴퓨터공학' },
  { number: 2, employeeId: 'EMP002', name: '김철수', department: '전자공학과' },
  { number: 3, employeeId: 'EMP003', name: '이영희', department: '기계공학' },
];

const classroomDummyData = [
  {
    number: 1,
    buildingNo: '451',
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: '348',
    capacity: 60,
  },
  {
    number: 2,
    buildingNo: '451',
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: '352',
    capacity: 45,
  },
  {
    number: 3,
    buildingNo: '451',
    buildingName: 'IT대학5호관(IT융복합관)',
    roomNo: '355',
    capacity: 55,
  },
];

function DepartmentManagePage() {
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [classroomData, setClassroomData] = useState([]);

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

  return (
    <Section>
      <div>
        <PageHeader
          title='학과 목록'
          buttonsData={[
            { text: '저장', color: 'gold', Icon: SaveIcon, onClick: () => {} },
          ]}
        />
        <HorizontalTable items={departmentInfo} />
      </div>

      <div>
        <SectionHeader
          title='직원 목록'
          controlGroup='buttonGroup'
          buttonsData={[
            { text: '추가', color: 'lightgray', onClick: () => {} },
            { text: '삭제', color: 'lightgray', onClick: () => {} },
          ]}
        />
        <VerticalTable
          columns={employeeColumns}
          data={employeeData}
          headerHeight={40}
          maxHeight={160}
          selectable={true}
        />
      </div>

      <div className='mt-8'>
        <SectionHeader
          title='강의실 목록'
          controlGroup='buttonGroup'
          buttonsData={[
            { text: '추가', color: 'lightgray', onClick: () => {} },
            { text: '삭제', color: 'lightgray', onClick: () => {} },
          ]}
        />
        <VerticalTable
          columns={ClassroomColumns}
          data={classroomData}
          headerHeight={40}
          maxHeight={600}
          selectable={true}
        />
      </div>
    </Section>
  );
}

export default DepartmentManagePage;
