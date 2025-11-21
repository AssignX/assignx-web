import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import apiClient from '@/api/apiClient';
import TimeTable from '@/components/TimeTable';

export default function ExamTimeTable({ selectedRoom }) {
  const [entries, setEntries] = useState({});

  // 날짜 → 요일(월~일)
  const getKoreanDay = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  // HH:mm 변환용
  const toMinutes = (t) => {
    const d = new Date(t);
    return d.getHours() * 60 + d.getMinutes();
  };

  // 30분 단위 슬롯 생성
  const getSlots = (start, end) => {
    const slots = [];
    let cur = toMinutes(start);
    const endMin = toMinutes(end);

    while (cur < endMin) {
      const hour = Math.floor(cur / 60);
      const half = cur % 60 === 0 ? 'A' : 'B'; // 00 → A, 30 → B
      slots.push(`${hour}${half}`);
      cur += 30;
    }
    return slots;
  };

  useEffect(() => {
    if (!selectedRoom) return;

    const fetchExams = async () => {
      try {
        const res = await apiClient.get(`/api/exam/search`, {
          params: { year: selectedRoom.year, semester: selectedRoom.semester },
        });

        const allExams = res.data || [];

        // 1) buildingName + roomNumber 기준으로 exam 필터링
        const exams = allExams.filter(
          (e) =>
            e.buildingName === selectedRoom.buildingName &&
            e.roomNumber === selectedRoom.roomNumber
        );

        const newEntries = {};

        // 2) 시험 시간표 파싱: startTime/endTime → 요일/슬롯
        exams.forEach((exam) => {
          const { courseName, courseCode, startTime, endTime } = exam;

          const day = getKoreanDay(startTime); // "월" 등
          const slots = getSlots(startTime, endTime); // ["9A","9B",...]

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
  }, [selectedRoom]);

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

ExamTimeTable.propTypes = { selectedRoom: PropTypes.object };
