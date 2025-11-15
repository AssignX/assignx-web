import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import VerticalTable from '@/components/table/VerticalTable';

import { useEffect, useState } from 'react';

const departmentColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: (info) => info.getValue(),
  },
  {
    header: '단과 대학',
    accessorKey: 'college',
    size: 200,
    cell: (info) => info.getValue(),
  },
  {
    header: '학과',
    accessorKey: 'major',
    size: 700, // fill 수정 필요
    cell: (info) => info.getValue(),
  },
];

const dummyData = [
  { number: 1, college: '공과대학', major: '컴퓨터공학과' },
  { number: 2, college: '공과대학', major: '전자공학과' },
];

function DepartmentListPage() {
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    // Fetch department data from API
    setDepartmentData(dummyData);
  }, []);

  return (
    <Section>
      <div>
        <PageHeader
          title='학과 목록'
          buttonsData={[
            { text: '추가', color: 'lightgray', onClick: () => {} },
            { text: '버튼', color: 'lightgray', onClick: () => {} },
            { text: '삭제', color: 'lightgray', onClick: () => {} },
          ]}
        />
        <VerticalTable
          columns={departmentColumns}
          data={departmentData}
          headerHeight={40}
          maxHeight={1200}
          selectable={true}
        />
      </div>
    </Section>
  );
}

export default DepartmentListPage;
