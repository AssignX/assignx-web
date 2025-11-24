import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import TimeTable from '@/components/TimeTable';

import ClassRoomSearchTable from '@/components/table/ClassRoomSearchTable';

import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import apiClient from '@/api/apiClient';
import {
  minutesToSlotLabel,
  SLOT_INTERVAL_MINUTES,
  WEEKDAYS,
} from './parsingTime';

dayjs.extend(isoWeek);

const timetableStart = '08:00';
const timetableEnd = '20:00';
const timetableDays = ['월', '화', '수', '목', '금', '토'];

const buildExamEntryLabel = (exam) => {
  const lines = [exam.courseName];
  const secondLine = exam.roomNumber || exam.courseCode;
  if (secondLine) lines.push(secondLine);
  return lines.filter(Boolean).join('\n');
};

const buildWeekEntriesFromExams = (exams, currentWeek) => {
  if (!Array.isArray(exams) || !currentWeek) return {};

  const weekStart = currentWeek.isoWeekday(1).startOf('day');
  const weekEnd = currentWeek.isoWeekday(7).endOf('day');
  const entries = {};

  exams.forEach((exam) => {
    if (exam.examAssigned !== 'WAITING_HIGH_PRIORITY') return;

    const start = dayjs(exam.startTime);
    const end = dayjs(exam.endTime);

    if (!start.isValid() || !end.isValid() || !end.isAfter(start)) return;
    if (start.isAfter(weekEnd) || end.isBefore(weekStart)) return;

    const dayChar = WEEKDAYS[start.day()];
    if (!dayChar) return;

    const display = buildExamEntryLabel(exam);
    let cursor = start.startOf('minute');

    while (cursor.isBefore(end)) {
      const minutes = cursor.hour() * 60 + cursor.minute();
      const slotLabel = minutesToSlotLabel(minutes);
      if (slotLabel) {
        entries[`${dayChar}-${slotLabel}`] = display;
      }
      cursor = cursor.add(SLOT_INTERVAL_MINUTES, 'minute');
    }
  });

  return entries;
};

function CourseSchedulePage() {
  const [examRows, setExamRows] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [selected, setSelected] = useState(true); // true: 수업, false: 시험

  const [searchFilters, setSearchFilters] = useState(null);

  const handleSearchCondition = (filters) => {
    setSearchFilters(filters);
  };

  useEffect(() => {
    if (!searchFilters) return;

    const { year, semester, roomId } = searchFilters;
    if (!year || !semester || !roomId) {
      setExamRows([]);
      return;
    }

    const fetchExamSchedule = async () => {
      try {
        const res = await apiClient.get('/api/exam/search', {
          params: {
            year: String(year),
            semester: String(semester),
            roomId: String(roomId),
          },
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setExamRows(list);
      } catch (error) {
        console.error('시험 일정 조회 실패:', error);
        setExamRows([]);
      }
    };

    fetchExamSchedule();
  }, [searchFilters]);

  const weekEntries = useMemo(
    () => buildWeekEntriesFromExams(examRows, date),
    [examRows, date]
  );

  return (
    <Section>
      <div>
        <PageHeader
          title='시간표 조회'
          helperText='※해당 시간표는 시스템 선정 기준 유력 후보 1순위만 표기하고 있습니다.'
        />
        <ClassRoomSearchTable onSearch={handleSearchCondition} />
      </div>

      {/* 시간표 카드 */}
      <div>
        <SectionHeader
          title='시간표'
          controlGroup='weekPicker'
          hasConfirmSelection={true}
          selected={selected}
          setSelected={setSelected}
          date={date}
          setDate={setDate}
        />
        <TimeTable
          startTime={timetableStart}
          endTime={timetableEnd}
          dayRange={timetableDays}
          entries={weekEntries}
          maxHeight='600px'
        />
      </div>
    </Section>
  );
}

export default CourseSchedulePage;
