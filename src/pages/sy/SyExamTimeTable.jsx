import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import apiClient from '@/api/apiClient';
import TimeTable from '@/components/TimeTable';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export default function SyExamTimeTable({ selectedRoom, date }) {
  const [entries, setEntries] = useState({});

  useEffect(() => {
    if (!selectedRoom || !date) return;

    const fetchExams = async () => {
      try {
        const res = await apiClient.get(`/api/exam/search`, {
          params: {
            year: selectedRoom.year,
            semester: selectedRoom.semester,
            roomId: selectedRoom.id,
          },
        });

        const exams = res.data || [];
        const newEntries = {};

        const weekStart = dayjs(date).startOf('week');
        const weekEnd = dayjs(date).endOf('week');

        exams.forEach((exam) => {
          const { courseName, courseCode, startTime, endTime, examType } = exam;

          const start = dayjs(startTime);
          const end = dayjs(endTime);

          // 1) 주간 필터링: 현재 주간에 포함되지 않으면 skip
          if (!(start.isAfter(weekStart) && start.isBefore(weekEnd))) {
            return;
          }

          // 2) TimeTable에 넣을 값 조립
          const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
          const day = dayMap[start.day()];

          const formatHM = (d) => d.format('HH:mm');

          const startHM = formatHM(start);
          const endHM = formatHM(end);

          const key = `${day}-${startHM}-${endHM}`;

          newEntries[key] = `${courseName}\n${courseCode}\n(${examType || ''})`;
        });

        setEntries(newEntries);
      } catch (err) {
        console.error('시험 목록 조회 실패:', err);
        setEntries({});
      }
    };

    fetchExams();
  }, [selectedRoom, date]);

  return (
    <TimeTable
      key={selectedRoom?.roomNumber}
      startTime='08:00'
      endTime='22:30'
      dayRange={['월', '화', '수', '목', '금', '토']}
      entries={entries}
      maxHeight='740px'
    />
  );
}

SyExamTimeTable.propTypes = {
  selectedRoom: PropTypes.object,
  date: PropTypes.object,
};
