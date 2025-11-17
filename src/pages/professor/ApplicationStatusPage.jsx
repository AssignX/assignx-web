import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import VerticalTable from '@/components/table/VerticalTable';
import TimeTable from '@/components/TimeTable';
import ClassRoomSearchTable from '@/components/table/ClassRoomSearchTable';

import apiClient from '@/api/apiClient';
import { useEffect, useState } from 'react';

const courseTableColumns = [
  {
    id: 'no',
    accessorKey: 'no',
    header: 'No',
    size: 50,
    cell: (info) => info.getValue(),
  },
  {
    id: 'courseName',
    accessorKey: 'courseName',
    header: '과목명',
    size: 180,
    cell: (info) => info.getValue(),
  },
  {
    id: 'courseCode',
    accessorKey: 'courseCode',
    header: '과목코드',
    size: 120,
    cell: (info) => info.getValue(),
  },
  {
    id: 'courseTime',
    accessorKey: 'courseTime',
    header: '강의시간',
    size: 220,
    cell: (info) => info.getValue(),
  },
  {
    id: 'classroom',
    accessorKey: 'classroom',
    header: '강의실',
    size: 120,
    cell: (info) => info.getValue(),
  },
  {
    id: 'enrolledCount',
    accessorKey: 'enrolledCount',
    header: '수강인원',
    size: 80,
    cell: (info) => info.getValue(),
  },
];

const timetableStart = '08:00';
const timetableEnd = '20:00';
const timetableDays = ['월', '화', '수', '목', '금', '토'];

// dummy data
const DUMMY_PROFESSOR = {
  departmentId: 1,
  professorName: '홍길동',
  professorId: 1,
};

function ApplicationStatusPage() {
  const [courseTableRows, setCourseTableRows] = useState([]);
  const [timeTableEntries, setTimeTableEntries] = useState({});
  const [searchFilters, setSearchFilters] = useState(null);

  const handleSearchCondition = (filters) => {
    setSearchFilters(filters);
  };

  useEffect(() => {
    if (!searchFilters) return;

    const fetchCourse = async () => {
      // setIsLoading(true);
      try {
        const res = await apiClient.get('/api/course/search', {
          params: {
            year: searchFilters.year,
            semester: searchFilters.semester,
            roomId: searchFilters.buildingId || undefined, // buildingId → roomId로 매핑
            departmentId: DUMMY_PROFESSOR.departmentId,
            professorName: DUMMY_PROFESSOR.professorName,
            professorId: DUMMY_PROFESSOR.professorId,
            // professor 정보는 수정 필요
          },
        });

        const data = Array.isArray(res.data) ? res.data : [];

        // 1) 테이블 rows 변환
        const rows = data.map((item, index) => ({
          id: item.courseId,
          no: index + 1,
          courseName: item.courseName,
          courseCode: item.courseCode,
          courseTime: item.courseTime,
          classroom:
            [item.buildingName, item.roomNumber].filter(Boolean).join(' ') ||
            '-', // "IT대학5호관 415" 같은 형태
          enrolledCount: item.enrolledCount,
        }));
        setCourseTableRows(rows);

        // 2) 시간표 entries 변환
        //    courseTime 포맷이 "월 8B,9A,9B, 목 8B,9A,9B" 같은 형태라고 가정
        const entries = data.reduce((acc, course) => {
          if (!course.courseTime) return acc;

          const slots = course.courseTime.split(',').map((s) => s.trim());

          slots.forEach((slot) => {
            if (!slot) return;
            const [day, period] = slot.split(' ');
            if (!day || !period) return;

            acc[`${day}-${period}`] =
              `${course.courseName}\n${course.courseCode}`;
          });

          return acc;
        }, {});
        setTimeTableEntries(entries);
      } catch (err) {
        console.error('과목 조회 실패:', err);
        setCourseTableRows([]);
        setTimeTableEntries({});
      } finally {
        // setIsLoading(false);
      }
    };

    fetchCourse();

    console.log('실행 완료');
  }, [searchFilters]);

  const subtitle = `${courseTableRows.length}건`;

  return (
    <Section>
      <div>
        <PageHeader title='시간표 조회' />
        <ClassRoomSearchTable onSearch={handleSearchCondition} />
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
