import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import InputCell from '@/components/table/cells/InputCell';
import { SearchIcon } from '@/assets/icons';

import { useEffect, useCallback, useState } from 'react';

function FirstApplicationPage() {
  const [openYear, setOpenYear] = useState(2025);
  const [openSemester, setOpenSemester] = useState('1학기');
  const [department, setDepartment] = useState('컴퓨터공학과');
  const [professorId, setProfessorId] = useState('학번');
  const [professorName, setProfessorName] = useState('홍길동');

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
      <HorizontalTable items={filterItems} />

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
