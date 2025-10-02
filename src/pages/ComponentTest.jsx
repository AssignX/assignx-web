import PageHeader from '../components/PageHeader';
import SectionHeader from '../components/SectionHeader';
import { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import BreadCrumb from '../components/BreadCrumb';
import DateTimePicker from '../components/pickers/DateTimePicker';

function ComponentTest() {
  const [selected, setSelected] = useState(true);
  const [date, setDate] = useState(dayjs());

  const [range, setRange] = useState({ from: null, to: null });
  const handleUpdate = useCallback(({ range }) => {
    setRange(range);
  }, []);

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
      <BreadCrumb parentText='상위 메뉴' childText='하위 메뉴' />
      <div className='w-[300px]'>
        <div className='text-sm text-gray-600'>
          현재 값:{' '}
          {range.from && range.to
            ? `${dayjs(range.from).format('YYYY.MM.DD. HH:mm')} ~ ${dayjs(range.to).format('HH:mm')}`
            : '아직 선택되지 않았어요'}
        </div>
        <DateTimePicker
          initialDate='2025-09-20'
          initialStart='12:10'
          initialEnd='23:24'
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}

export default ComponentTest;
