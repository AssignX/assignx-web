// src/pages/office/ExamTimeTable.jsx
import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import apiClient from '@/api/apiClient';
import TimeTable from '@/components/TimeTable';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

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
  useEffect(() => {
    if (!selectedRoom || !selectedRoom.roomId) {
      console.warn('⚠️ selectedRoom 또는 roomId 없음 → 렌더 중단');
      return;
    }

    const fetchExams = async () => {

      try {
        const res = await apiClient.get(`/api/exam/search`, {
          params: {
            year: selectedRoom.year,
            semester: selectedRoom.semester,
            departmentId: selectedRoom.departmentId,
            roomId: selectedRoom.roomId,
          },
        });

        const exams = res.data || [];

        const weekStart = dayjs(weekDate).startOf('isoWeek');
        const weekEnd = dayjs(weekDate).endOf('isoWeek');

        // 필터링된 시험 리스트
        const filtered = exams.filter((exam) => {
          const start = dayjs(exam.startTime);
          return start.isBetween(weekStart, weekEnd, 'day', '[]');
        });

        const newEntries = {};

        filtered.forEach((exam) => {
          const { courseName, courseCode, startTime, endTime, examType } = exam;

          const start = dayjs(startTime, 'YYYY-MM-DDTHH:mm:ss', true);
          const end = dayjs(endTime, 'YYYY-MM-DDTHH:mm:ss', true);

          if (!start.isValid() || !end.isValid()) {
            console.warn('❌ Invalid Date exam:', exam);
            return;
          }

          const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
          const day = dayMap[start.day()];

          // slot 기반 매칭
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
              const val = `${courseName}\n${courseCode}\n(${examType})`;

              newEntries[key] = val;
            }
          });
        });

        setEntries(newEntries);
      } catch (err) {
        console.error('❌ 시험 목록 조회 실패:', err);
        setEntries({});
      }
    };

    fetchExams();
  }, [selectedRoom, weekDate]);

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
