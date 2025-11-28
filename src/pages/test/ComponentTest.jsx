import { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import BreadCrumb from '@/components/Breadcrumb';
import DateTimePicker from '@/components/pickers/DateTimePicker';

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
        controlGroup='weekPicker'
        date={date}
        setDate={setDate}
      />
      <SectionHeader
        title='섹션 헤더입니다2'
        subtitle='2건'
        controlGroup='buttonGroup'
        buttonsData={[
          { text: '버튼', color: 'red', onClick: () => alert('버튼1 클릭') },
          {
            text: '버튼2',
            color: 'lightgray',
            onClick: () => alert('버튼2 클릭'),
          },
          { text: '버튼3', color: 'gold', onClick: () => alert('버튼3 클릭') },
        ]}
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
