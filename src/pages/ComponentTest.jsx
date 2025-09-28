import PageHeader from '../components/PageHeader';
import SectionHeader from '../components/SectionHeader';
import { useState } from 'react';
import dayjs from 'dayjs';

function ComponentTest() {
  const [selected, setSelected] = useState(true);
  const [date, setDate] = useState(dayjs());

  return (
    <div className='flex flex-col gap-[40px] p-4'>
      <PageHeader
        title='페이지 헤더입니다1'
        helperText='※ HelperText 입니다'
        hasConfirmSelection={false}
      />
      <PageHeader
        title='페이지 헤더입니다2'
        helperText='※ HelperText 입니다'
        hasConfirmSelection={true}
        selected={selected}
        setSelected={setSelected}
      />
      <SectionHeader
        title='섹션 헤더입니다1'
        subtitle='2건'
        hasWeekPicker={true}
        date={date}
        setDate={setDate}
      />
      <SectionHeader
        title='섹션 헤더입니다2'
        subtitle='2건'
        hasWeekPicker={false}
      />
    </div>
  );
}

export default ComponentTest;
