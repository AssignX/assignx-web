import { useState } from 'react';
import dayjs from 'dayjs';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import ClassRoomSearchTable from '../../components/table/ClassRoomSearchTable';
import SyClassRoomTable from './SyClassRoomTable';
import SyCourseTimeTable from './SyCourseTimeTable';
import SyExamTimeTable from './SyExamTimeTable';
import TableWrapper from '@/components/layout/TableWrapper';

export default function Sy() {
  const [selected, setSelected] = useState(true);
  const [date, setDate] = useState(dayjs());
  const [searchFilters, setSearchFilters] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleSearchCondition = (filters) => {
    setSearchFilters(filters);
  };

  const handleRoomSelect = (roomData) => {
    setSelectedRoom(roomData);
  };

  return (
    <div className='bg-light-gray h-screen p-5'>
      <PageHeader title='강의실 시간표 조회' />
      <ClassRoomSearchTable onSearch={handleSearchCondition} />
      <section className='flex flex-row gap-2.5 py-2.5'>
        <div className='w-[510px] p-2.5'>
          <SectionHeader title='강의실 목록' />
          <SyClassRoomTable
            maxHeight='560'
            filters={searchFilters}
            onSelect={handleRoomSelect}
          />
        </div>
        <div className='p-2.5'>
          <SectionHeader
            title='시간표 조회'
            controlGroup='weekPicker'
            hasConfirmSelection='true'
            selected={selected}
            setSelected={setSelected}
            date={date}
            setDate={setDate}
          />
          <TableWrapper height='560px'>
            {selected ? (
              <SyCourseTimeTable selectedRoom={selectedRoom} />
            ) : (
              <SyExamTimeTable selectedRoom={selectedRoom} date={date} />
            )}
          </TableWrapper>
        </div>
      </section>
    </div>
  );
}
