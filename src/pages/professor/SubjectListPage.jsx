import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import TimeTable from '@/components/TimeTable';

import ClassRoomSearchTable from '@/components/table/ClassRoomSearchTable';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const timetableStart = '08:00';
const timetableEnd = '20:00';
const timetableDays = ['월', '화', '수', '목', '금', '토'];

const dummyTimeTableEntries = {
  '월-0A': '자료구조\nITEC0401003',
  '월-0B': '자료구조\nITEC0401003',
  '월-1A': '자료구조\nITEC0401003',
  '목-0A': '자료구조\nITEC0401003',
  '목-0B': '자료구조\nITEC0401003',
  '목-1A': '자료구조\nITEC0401003',
  '화-2B': '알고리즘\nITEC0401003',
  '화-3A': '알고리즘\nITEC0401003',
  '화-3B': '알고리즘\nITEC0401003',
  '금-0A': '운영체제\nITEC0401003',
  '금-0B': '운영체제\nITEC0401003',
  '금-1A': '운영체제\nITEC0401003',
  '금-1B': '운영체제\nITEC0401003',
};

function SubjectListPage() {
  const [timeTableEntries, setTimeTableEntries] = useState({});
  const [date, setDate] = useState(dayjs());
  const [selected, setSelected] = useState(true); // true: 수업, false: 시험

  const [searchFilters, setSearchFilters] = useState(null);

  const handleSearchCondition = (filters) => {
    setSearchFilters(filters);
    console.log(searchFilters);
  };

  useEffect(() => {
    // fetch 함수
    setTimeTableEntries(dummyTimeTableEntries);
  }, []);

  return (
    <Section>
      <div className='isolate'>
        <PageHeader
          title='신청 현황 조회'
          helperText='※해당 시간표는 시스템 선정 기준 유력 후보 1순위만 표기하고 있습니다.'
        />
        <ClassRoomSearchTable onSearch={handleSearchCondition} />
      </div>

      {/* 시간표 카드 */}
      <div className='isolate'>
        <SectionHeader
          title='시간표'
          controlGroup='weekPicker'
          hasConfirmSelection={true}
          selected={selected}
          setSelected={setSelected}
          date={date}
          setDate={setDate}
        />
        <TimeTable
          startTime={timetableStart}
          endTime={timetableEnd}
          dayRange={timetableDays}
          entries={timeTableEntries}
          maxHeight='600px'
        />
      </div>
    </Section>
  );
}

export default SubjectListPage;
