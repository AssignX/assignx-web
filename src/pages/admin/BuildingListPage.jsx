import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import VerticalTable from '@/components/table/VerticalTable';

import { useEffect, useState } from 'react';

const buildingColumns = [
  { header: 'No', accessorKey: 'number', size: 50 },
  { header: '건물 번호', accessorKey: 'buildingNumber', size: 200 },
  {
    header: '건물 이름',
    accessorKey: 'buildingName',
    size: 700, // fill 수정 필요
  },
];

const dummyData = [
  { number: 1, buildingNumber: 'B001', buildingName: 'IT대학5호관(IT융복합)' },
  { number: 2, buildingNumber: 'B002', buildingName: 'Science Center' },
];

function BuildingListPage() {
  const [buildingData, setBuildingData] = useState([]);

  useEffect(() => {
    // Fetch building data from API
    setBuildingData(dummyData);
  }, []);

  return (
    <Section>
      <div>
        <PageHeader
          title='건물 목록'
          buttonsData={[
            { text: '추가', color: 'lightgray', onClick: () => {} },
            { text: '버튼', color: 'lightgray', onClick: () => {} },
            { text: '삭제', color: 'lightgray', onClick: () => {} },
          ]}
        />
        <VerticalTable
          columns={buildingColumns}
          data={buildingData}
          headerHeight={40}
          maxHeight={1200}
          selectable={true}
        />
      </div>
    </Section>
  );
}

export default BuildingListPage;
