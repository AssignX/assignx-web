import Layout from '@/components/Layout';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import TimeTable from '@/components/TimeTable';

import HorizontalTable from '@/components/table/HorizontalTable';
import YearPickerCell from '@/components/table/cells/YearPickerCell';
import DropdownCell from '@/components/table/cells/DropdownCell';
import SearchCell from '@/components/table/cells/SearchCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';

import ClassRoomModal from '@/components/ClassRoomModal';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import apiClient from '@/api/apiClient';

import {
  minutesToSlotLabel,
  SLOT_INTERVAL_MINUTES,
  WEEKDAYS,
  buildTimeTableEntries,
} from './parsingTime';

dayjs.extend(isoWeek);

const timetableStart = '08:00';
const timetableEnd = '20:00';
const timetableDays = ['월', '화', '수', '목', '금', '토'];

const semesterOptions = [
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
];

const buildExamEntryLabel = (exam) => {
  const code = exam.courseCode ?? '';
  const name = exam.courseName ?? '';
  return `${code}\n${name}`;
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

function ExamStatusPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { name: userNameFromStore, departmentName } = useAuthStore();

  useEffect(() => {
    if (!accessToken) navigate('/login');
  }, [accessToken, navigate]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.warn('logout failed', err);
    }
    logout();
    navigate('/login');
  };

  const [courseRows, setCourseRows] = useState([]);
  const [examRows, setExamRows] = useState([]);

  const [date, setDate] = useState(dayjs());
  const [selected, setSelected] = useState(true); // true: 수업, false: 시험

  const [filters, setFilters] = useState({
    year: String(dayjs().year()),
    semester: '1',
    roomId: '',
    buildingName: '',
    roomNumber: '',
  });

  const [searchFilters, setSearchFilters] = useState(null);
  const [isClassRoomModalOpen, setIsClassRoomModalOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateFilters = (rowId, columnKey, value) => {
    handleFilterChange(columnKey, value);
  };

  const handleOpenClassRoomModal = () => {
    setIsClassRoomModalOpen(true);
  };

  const handleClassRoomSelect = (rooms) => {
    if (!rooms || rooms.length === 0) return;
    const room = rooms[0];

    setFilters((prev) => ({
      ...prev,
      roomId: room.roomId,
      buildingName: room.buildingName,
      roomNumber: room.roomNo ?? room.roomNumber ?? '',
    }));
  };

  const handleSearch = () => {
    const { year, semester, roomId } = filters;
    if (!year || !semester || !roomId) {
      alert('연도, 학기, 강의실을 모두 선택해주세요.');
      return;
    }
    setSearchFilters({ year, semester, roomId });
  };

  const filterItems = [
    {
      id: 'year',
      label: '개설연도',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <YearPickerCell
          rowId='filters'
          columnKey='year'
          initialValue={Number(filters.year)}
          updateData={updateFilters}
        />
      ),
    },
    {
      id: 'semester',
      label: '개설학기',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <DropdownCell
          initialValue={filters.semester}
          options={semesterOptions}
          rowId='filters'
          columnKey='semester'
          updateData={updateFilters}
          height={32}
        />
      ),
    },
    {
      id: 'classroom',
      label: '건물상세검색',
      labelWidth: '130px',
      contentWidth: '200px',
      content: (
        <SearchCell
          initialValue={
            filters.roomId
              ? `${filters.buildingName ?? ''} ${filters.roomNumber ?? ''}`
              : ''
          }
          height={32}
          disabled={true}
          onSearch={() => {
            handleOpenClassRoomModal();
          }}
        />
      ),
    },

    {
      id: 'searchButton',
      contentWidth: '200px',
      content: (
        <Button
          text='조회'
          color='lightgray'
          textSize='text-sm'
          Icon={SearchIcon}
          onClick={handleSearch}
        />
      ),
    },
  ];

  useEffect(() => {
    if (!searchFilters) return;
    const { year, semester, roomId } = searchFilters;
    if (!year || !semester || !roomId) {
      setExamRows([]);
      setCourseRows([]);
      return;
    }

    const fetchData = async () => {
      try {
        const examRes = await apiClient.get('/api/exam/search', {
          params: {
            year: String(year),
            semester: String(semester),
            roomId: String(roomId),
          },
        });

        const courseRes = await apiClient.get('/api/course/search', {
          params: {
            year: String(year),
            semester: String(semester),
            roomId: String(roomId),
          },
        });

        const examList = Array.isArray(examRes.data) ? examRes.data : [];
        const courseList = Array.isArray(courseRes.data) ? courseRes.data : [];

        setExamRows(examList);
        setCourseRows(courseList);
      } catch (error) {
        console.error('시험/강의 일정 조회 실패:', error);
        setExamRows([]);
        setCourseRows([]);
      }
    };

    fetchData();
  }, [searchFilters]);

  const weekEntries = useMemo(() => {
    if (selected) {
      return buildTimeTableEntries(courseRows);
    }
    return buildWeekEntriesFromExams(examRows, date);
  }, [selected, courseRows, examRows, date]);

  return (
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle={`${departmentName ?? ''} 메뉴`}
      onLogout={handleLogout}
      menus={[
        {
          title: '강의 조회',
          subItems: [{ label: '시간표 조회', path: '/professor/schedule' }],
        },
        {
          title: '시험 신청',
          subItems: [
            { label: '1차 시험 신청', path: '/professor/first' },
            { label: '2차 시험 신청', path: '/professor/second' },
            {
              label: '신청 현황 조회',
              path: '/professor/status',
              isSelected: true,
            },
          ],
        },
      ]}
    >
      <div>
        <PageHeader
          title='신청 현황 조회(강의실)'
          helperText='※해당 시간표는 시스템 선정 기준 유력 후보 1순위만 표기하고 있습니다.'
        />
        <HorizontalTable items={filterItems} />
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
          maxHeight='550px'
        />
      </div>

      {isClassRoomModalOpen && (
        <ClassRoomModal
          setIsOpen={setIsClassRoomModalOpen}
          onSelect={handleClassRoomSelect}
        />
      )}
    </Layout>
  );
}

export default ExamStatusPage;
