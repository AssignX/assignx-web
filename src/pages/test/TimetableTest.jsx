import Timetable from '../../components/table/TimeTable';

export default function TimetableTest() {
  const days = ['월', '화', '수', '목', '금', '토', '일'];

  const entries = {
    '월-0A': '대학글쓰기\nCLTF0205054',
    '화-1B': '종합설계프로젝트1\n ITEC0401003',
    '수-2A': '종합설계프로젝트1\n ITEC0401003',
    '금-3B': '종합설계프로젝트1\n ITEC0401003',
  };

  return (
    <div className='w-[1200px] space-y-4 p-8'>
      <p> TimeTable Test </p>
      <Timetable
        startTime='08:00'
        endTime='12:00'
        dayRange={days}
        entries={entries}
        maxHeight='400px'
      />
    </div>
  );
}
