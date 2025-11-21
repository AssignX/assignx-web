import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import VerticalTable from '@/components/table/VerticalTable';
import TimeTable from '@/components/TimeTable';
import InputCell from '@/components/table/cells/InputCell';
import HorizontalTable from '@/components/table/HorizontalTable';

import { SearchIcon } from '@/assets/icons';

import apiClient from '@/api/apiClient';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const courseTableColumns = [
  { id: 'no', accessorKey: 'no', header: 'No', size: 40 },
  { id: 'courseName', accessorKey: 'courseName', header: '과목명', size: 120 },
  {
    id: 'courseCode',
    accessorKey: 'courseCode',
    header: '과목코드',
    size: 120,
  },
  { id: 'classSection', accessorKey: 'classSection', header: '분반', size: 40 },
  {
    id: 'courseTime',
    accessorKey: 'courseTime',
    header: '강의시간',
    size: 220,
  },
  {
    id: 'courseRealTime',
    accessorKey: 'courseRealTime',
    header: '강의시간(실제시간)',
    size: 220,
  },
  { id: 'classroom', accessorKey: 'classroom', header: '강의실', size: 120 },
  {
    id: 'enrolledCount',
    accessorKey: 'enrolledCount',
    header: '수강인원',
    size: 40,
  },
];

const timetableStart = '08:00';
const timetableEnd = '20:00';
const timetableDays = ['월', '화', '수', '목', '금', '토'];
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
  return h * 60 + m;
};

const fromMinutes = (min) => {
  const h = String(Math.floor(min / 60)).padStart(2, '0');
  const m = String(min % 60).padStart(2, '0');
  return `${h}:${m}`;
};

const slotLabelToRange = (label) => {
  const startBase = toMinutes(timetableStart);
  const num = parseInt(label.slice(0, -1), 10);
  const isA = label.endsWith('A');
  const from = startBase + num * 60 + (isA ? 0 : 30);
  const to = from + 30;
  return { from, to };
};

const parseCourseTime = (courseTime) => {
  const result = [];
  if (!courseTime) return result;

  const dayPattern = /^(월|화|수|목|금|토|일)\s*/;

  const parts = courseTime.split(',');
  let currentDay = null;

  parts.forEach((raw) => {
    const token = raw.trim();
    if (!token) return;

    const match = token.match(dayPattern);
    if (match) {
      currentDay = match[1];
      const slot = token.slice(match[0].length);
      if (slot) result.push({ day: currentDay, slot });
    } else if (currentDay) {
      result.push({ day: currentDay, slot: token });
    }
  });

  return result;
};

function buildCourseRealTime(courseTime) {
  const daySlots = parseCourseTime(courseTime);
  if (!daySlots.length) return '';

  const grouped = {};
  daySlots.forEach(({ day, slot }) => {
    const { from, to } = slotLabelToRange(slot);
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push({ from, to });
  });

  const dayStrings = Object.entries(grouped).map(([day, slots]) => {
    slots.sort((a, b) => a.from - b.from);
    const merged = [];
    let current = { ...slots[0] };

    for (let i = 1; i < slots.length; i++) {
      const s = slots[i];
      if (s.from === current.to) {
        current.to = s.to;
      } else {
        merged.push(current);
        current = { ...s };
      }
    }
    merged.push(current);

    return merged
      .map((seg) => `${day} ${fromMinutes(seg.from)}~${fromMinutes(seg.to)}`)
      .join(', ');
  });

  return dayStrings.join(', ');
}

function buildTimeTableEntries(courses) {
  const result = {};

  courses.forEach((course) => {
    if (!course.courseTime) return;
    const displayText = `${course.courseName}\n${course.courseCode}`;

    const daySlots = parseCourseTime(course.courseTime);
    daySlots.forEach(({ day, slot }) => {
      result[`${day}-${slot}`] = displayText;
    });
  });

  return result;
}

function ApplicationStatusPage() {
  const [openYear, setOpenYear] = useState(2025);
  const [openSemester, setOpenSemester] = useState('2학기'); // 추후 학기 받아오는 부분도 넣을지 고민해봐야할듯
  const departmentName = useAuthStore((state) => state.departmentName);
  const idNumber = useAuthStore((state) => state.idNumber);
  const name = useAuthStore((state) => state.name);

  const [courseTableRows, setCourseTableRows] = useState([]);
  const [timeTableEntries, setTimeTableEntries] = useState({});

  useEffect(() => {
    setOpenYear(2025);
    setOpenSemester('2학기');
  }, []);

  const handleSearch = async () => {
    try {
      const semesterQuery =
        typeof openSemester === 'string'
          ? openSemester.replace('학기', '')
          : String(openSemester);

      const res = await apiClient.get('/api/course/search', {
        params: {
          year: String(openYear),
          semester: semesterQuery,
          professorName: name,
        },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const mappedRows = data.map((course, index) => {
        const [code, section] = course.courseCode?.split('-') ?? ['', ''];
        return {
          no: index + 1,
          courseName: course.courseName,
          courseCode: code,
          classSection: section,
          courseTime: course.courseTime,
          courseRealTime: buildCourseRealTime(course.courseTime),
          classroom:
            `${course.buildingName ?? ''} ${course.roomNumber ?? ''}`.trim(),
          enrolledCount: course.enrolledCount,
        };
      });
      setCourseTableRows(mappedRows);

      const entries = buildTimeTableEntries(data);
      setTimeTableEntries(entries);
    } catch (error) {
      console.error('과목 조회 실패:', error);
      setCourseTableRows([]);
      setTimeTableEntries({});
    }
  };

  const filterItems = [
    {
      id: 'openYear',
      label: '개설연도',
      required: true,
      labelWidth: '80px',
      contentWidth: '80px',
      content: (
        <InputCell value={String(openYear)} height={32} disabled={true} />
      ),
    },
    {
      id: 'openSemester',
      label: '개설학기',
      required: true,
      labelWidth: '80px',
      contentWidth: '80px',
      content: (
        <InputCell value={String(openSemester)} height={32} disabled={true} />
      ),
    },
    {
      id: 'department',
      label: '소속학과',
      required: true,
      labelWidth: '80px',
      contentWidth: '220px', // fill
      content: <InputCell value={departmentName} height={32} disabled={true} />,
    },
    {
      id: 'professorId',
      label: '학번',
      required: true,
      labelWidth: '60px',
      contentWidth: '120px',
      content: <InputCell value={idNumber} height={32} disabled={true} />,
    },
    {
      id: 'professorName',
      label: '이름',
      required: true,
      labelWidth: '60px',
      contentWidth: '80px',
      content: <InputCell value={name} height={32} disabled={true} />,
    },
  ];

  const subtitle = `${courseTableRows.length}건`;

  return (
    <Section>
      <div>
        <PageHeader
          title='시간표 조회'
          buttonsData={[
            {
              text: '조회',
              color: 'lightgray',
              Icon: SearchIcon,
              onClick: handleSearch,
            },
          ]}
        />
        <HorizontalTable items={filterItems} />
      </div>

      <div>
        <SectionHeader title='과목 조회 목록' subtitle={subtitle} />
        <VerticalTable
          columns={courseTableColumns}
          data={courseTableRows}
          headerHeight={40}
          maxHeight={200}
          selectable={false}
        />
      </div>

      {/* 시간표 카드 */}
      <div>
        <SectionHeader title='강의 시간표' />
        <TimeTable
          startTime={timetableStart}
          endTime={timetableEnd}
          dayRange={timetableDays}
          entries={timeTableEntries}
          maxHeight='360px'
        />
      </div>
    </Section>
  );
}

export default ApplicationStatusPage;
