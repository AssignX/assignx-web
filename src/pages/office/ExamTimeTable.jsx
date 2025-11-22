import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import apiClient from '@/api/apiClient';
import TimeTable from '@/components/TimeTable';
import dayjs from 'dayjs';

export default function ExamTimeTable({ selectedRoom, weekDate }) {
  const [entries, setEntries] = useState({});

  const getKoreanDay = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  const toMinutes = (t) => {
    const d = new Date(t);
    return d.getHours() * 60 + d.getMinutes();
  };

  const getSlots = (start, end) => {
    const slots = [];
    let cur = toMinutes(start);
    const endMin = toMinutes(end);

    while (cur < endMin) {
      const hour = Math.floor(cur / 60);
      const half = cur % 60 === 0 ? 'A' : 'B';
      slots.push(`${hour}${half}`);
      cur += 30;
    }
    return slots;
  };

  useEffect(() => {
    if (!selectedRoom || !weekDate) return;

    const fetchExams = async () => {
      try {
        const res = await apiClient.get(`/api/exam/search`, {
          params: { year: selectedRoom.year, semester: selectedRoom.semester },
        });

        const allExams = res.data || [];

        const startOfWeek = weekDate.startOf('week');
        const endOfWeek = weekDate.endOf('week');

        const exams = allExams.filter((e) => {
          const start = dayjs(e.startTime);
          return (
            e.buildingName === selectedRoom.buildingName &&
            e.roomNumber === selectedRoom.roomNumber &&
            start.isBetween(startOfWeek, endOfWeek, 'day', '[]')
          );
        });

        const newEntries = {};

        exams.forEach((exam) => {
          const { courseName, courseCode, startTime, endTime } = exam;

          const day = getKoreanDay(startTime);
          const slots = getSlots(startTime, endTime);

          slots.forEach((slot) => {
            const key = `${day}-${slot}`;
            newEntries[key] = `${courseName}\n${courseCode}`;
          });
        });

        setEntries(newEntries);
      } catch (err) {
        console.error('시험 일정 조회 실패:', err);
        setEntries({});
      }
    };

    fetchExams();
  }, [selectedRoom, weekDate]); // ⬅ 중요: weekDate도 의존성에 포함

  return (
    <TimeTable
      key={`${selectedRoom.buildingName}-${selectedRoom.roomNumber}`}
      startTime='08:00'
      endTime='22:30'
      dayRange={['월', '화', '수', '목', '금', '토', '일']}
      entries={entries}
      maxHeight='740px'
    />
  );
}

ExamTimeTable.propTypes = {
  selectedRoom: PropTypes.object,
  weekDate: PropTypes.object,
};
