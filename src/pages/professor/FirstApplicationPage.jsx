import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import { SearchIcon } from '@/assets/icons';

function FirstApplicationPage() {
  return (
    <Section>
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
      {/* <HorizontalTable items={filterItems} /> */}

      {/* 시간표 카드 */}
      <div className='isolate'>
        <SectionHeader
          title='미확정 과목 목록'
          subtitle='5건'
          controlGroup='buttonGroup'
          buttonsData={[{ text: '신청', color: 'red', onClick: () => {} }]}
        />
        {/* <VerticalTable
          columns={subjectTableColumns}
          data={subjectTableRows}
          headerHeight={40}
          maxHeight={240}
          selectable={false}
        /> */}
      </div>

      <div className='isolate'>
        <SectionHeader title='확정 과목 목록' subtitle='5건' />
        {/* <VerticalTable
          columns={subjectTableColumns}
          data={subjectTableRows}
          headerHeight={40}
          maxHeight={240}
          selectable={false}
        /> */}
      </div>
    </Section>
  );
}

export default FirstApplicationPage;
