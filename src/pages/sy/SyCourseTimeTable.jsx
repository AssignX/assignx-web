import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import apiClient from '@/api/apiClient';
import TimeTable from '@/components/TimeTable';

export default function CourseTimeTable({ selectedRoom }) {
  const [entries, setEntries] = useState({});

  useEffect(() => {
    if (!selectedRoom) return;

    const fetchCourses = async () => {
      try {
        const res = await apiClient.get(`/api/course/search`, {
          params: {
            year: selectedRoom.year,
            semester: selectedRoom.semester,
            roomId: selectedRoom.id,
          },
        });

        console.log('검색 파라미터:', {
          year: selectedRoom.year,
          semester: selectedRoom.semester,
          roomNumber: selectedRoom.roomNumber,
        });

        console.log('서버 응답:', res.data);

        const courses = res.data || [];

        const newEntries = {};
        courses.forEach((course) => {
          const { courseName, courseCode, courseTime } = course;

          // 예: "화 8B,9A,9B,목 8B,9A,9B"
          const parts = courseTime.split(',');

          // parts 예:
          // ["화 8B", "9A", "9B", "목 8B", "9A", "9B"]

          let currentDay = null;

          parts.forEach((p) => {
            p = p.trim(); // "화 8B" 또는 "9A"

            // 요일이 포함된 경우
            const dayMatch = p.match(/^([월화수목금토일])\s*(\w+)$/);
            if (dayMatch) {
              currentDay = dayMatch[1];
              const slot = dayMatch[2]; // 8B

              const key = `${currentDay}-${slot}`;
              newEntries[key] = `${courseName}\n${courseCode}`;
              return;
            }

            // 요일이 생략된 경우(이전 요일과 연속)
            if (currentDay !== null) {
              const slot = p; // 9A 등
              const key = `${currentDay}-${slot}`;
              newEntries[key] = `${courseName}\n${courseCode}`;
            }
          });
        });

        setEntries(newEntries);
      } catch (err) {
        console.error('과목 목록 조회 실패:', err);
        setEntries({});
      }
    };

    fetchCourses();
  }, [selectedRoom]);

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

CourseTimeTable.propTypes = { selectedRoom: PropTypes.object };
