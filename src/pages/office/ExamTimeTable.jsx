// src/pages/office/ExamTimeTable.jsx
import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import apiClient from '@/api/apiClient';
import TimeTable from '@/components/TimeTable';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export default function ExamTimeTable({ selectedRoom, weekDate }) {
  const [entries, setEntries] = useState({});

  /** 1) 30분 단위 슬롯 생성 (SyExamTimeTable와 동일) */
  const slots = useMemo(() => {
    const toMinutes = (hhmm) => {
      const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
      return h * 60 + m;
    };
    const fromMinutes = (min) => {
      const h = String(Math.floor(min / 60)).padStart(2, '0');
      const m = String(min % 60).padStart(2, '0');
      return `${h}:${m}`;
    };

    const buildSlots = (startHHMM, endHHMM) => {
      const start = toMinutes(startHHMM);
      const end = toMinutes(endHHMM);
      const arr = [];
      let idxHour = 0;

      for (let t = start; t < end; t += 30) {
        const from = t;
        const to = Math.min(t + 30, end);
        const delta = t - start;
        const isA = delta % 60 === 0;
        if (delta > 0 && delta % 60 === 0) idxHour++;

        const label = `${idxHour}${isA ? 'A' : 'B'}`;
        arr.push({
          key: label,
          label,
          from: fromMinutes(from),
          to: fromMinutes(to),
        });
      }
      return arr;
    };

    return buildSlots('08:00', '22:30');
  }, []);

  /** 2) 시험 조회 및 Slot 기반 timetable 생성 */
  useEffect(() => {
    if (!selectedRoom || !selectedRoom.roomId || !weekDate) return;

    const fetchExams = async () => {
      try {
        const res = await apiClient.get('/api/exam/search', {
          params: {
            year: selectedRoom.year,
            semester: selectedRoom.semester,
            roomId: selectedRoom.roomId,
            departmentId: selectedRoom.departmentId,
          },
        });

        const exams = res.data || [];
        const newEntries = {};

        const weekStart = dayjs(weekDate).startOf('isoWeek');
        const weekEnd = dayjs(weekDate).endOf('isoWeek');

        exams.forEach((exam) => {
          const { courseName, courseCode, startTime, endTime, examType } = exam;

          const start = dayjs(startTime);
          const end = dayjs(endTime);

          // 날짜가 null이거나 Invalid Date이면 skip
          if (!start.isValid() || !end.isValid()) return;

          // 주간 범위에 들어가지 않으면 skip
          if (start.isBefore(weekStart) || start.isAfter(weekEnd)) return;

          // 요일
          const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
          const day = dayMap[start.day()];

          // 슬롯 → 시간 범위 체크 후 채우기
          slots.forEach((slot) => {
            const slotStart = dayjs(
              `${start.format('YYYY-MM-DD')} ${slot.from}`
            );
            const slotEnd = dayjs(`${start.format('YYYY-MM-DD')} ${slot.to}`);

            const isInside =
              (slotStart.isSame(start) || slotStart.isAfter(start)) &&
              (slotEnd.isSame(end) || slotEnd.isBefore(end));

            if (isInside) {
              const key = `${day}-${slot.label}`;
              newEntries[key] =
                `${courseName}\n${courseCode}\n(${examType || ''})`;
            }
          });
        });

        setEntries(newEntries);
      } catch (err) {
        console.error('시험 목록 조회 실패:', err);
        setEntries({});
      }
    };

    fetchExams();
  }, [selectedRoom, weekDate, slots]);

  return (
    <TimeTable
      key={selectedRoom?.roomNumber}
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
