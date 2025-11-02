import { useState } from 'react';
import dayjs from 'dayjs';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import ClassRoomSearchTable from '../../components/table/ClassRoomSearchTable';
import SyClassRoomTable from './SyClassRoomTable';

export default function Sy() {
  const [selected, setSelected] = useState(true);
  const [date, setDate] = useState(dayjs());

  return (
    <div className='bg-light-gray p-5'>
      <PageHeader title='강의실 시간표 조회' />
      <ClassRoomSearchTable />
      <section className='flex h-[764px] flex-row gap-2.5 py-2.5'>
        <div className='w-[500px]'>
          <SectionHeader title='강의실 목록' />
          <SyClassRoomTable />
        </div>
        <div className='w-full'>
          <SectionHeader
            title='시간표 조회'
            controlGroup='weekPicker'
            hasConfirmSelection='true'
            selected={selected}
            setSelected={setSelected}
            date={date}
            setDate={setDate}
          />
        </div>
      </section>
    </div>
  );
}
