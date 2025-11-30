import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import apiClient from '@/api/apiClient';
import TimeTable from '@/components/TimeTable';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export default function SyExamTimeTable({ selectedRoom, date }) {
  const [entries, setEntries] = useState({});

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

        const weekStart = dayjs(date).startOf('isoWeek');
        const weekEnd = dayjs(date).endOf('isoWeek');

        exams.forEach((exam) => {
          const { courseName, courseCode, startTime, endTime } = exam;

          const start = dayjs(startTime);
          const end = dayjs(endTime);

          if (!start.isValid() || !end.isValid()) return;

          if (start.isBefore(weekStart) || start.isAfter(weekEnd)) {
            return;
          }

          const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
          const day = dayMap[start.day()];

          slots.forEach((slot) => {
            const slotStart = dayjs(
              `${start.format('YYYY-MM-DD')} ${slot.from}`
            );
            const slotEnd = dayjs(`${start.format('YYYY-MM-DD')} ${slot.to}`);

            const isInside =
              (slotStart.isAfter(start) || slotStart.isSame(start)) &&
              (slotEnd.isBefore(end) || slotEnd.isSame(end));

            if (isInside) {
              const key = `${day}-${slot.label}`;
              const value = `${courseName}\n${courseCode}`;

              newEntries[key] = value;
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
  }, [selectedRoom, date, slots]);

  return (
    <TimeTable
      key={selectedRoom?.roomNumber}
      startTime='08:00'
      endTime='22:30'
      dayRange={['월', '화', '수', '목', '금', '토']}
      entries={entries}
    />
  );
}

SyExamTimeTable.propTypes = {
  selectedRoom: PropTypes.object,
  date: PropTypes.object,
};
