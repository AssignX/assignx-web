import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import apiClient from '@/api/apiClient';
import TimeTable from '@/components/TimeTable';

export default function CourseTimeTable({ selectedRoom }) {
  const [entries, setEntries] = useState({});

  useEffect(() => {
    if (!selectedRoom) {
      setEntries({});
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await apiClient.get(`/api/course/search`, {
          params: {
            year: selectedRoom.year,
            semester: selectedRoom.semester,
            roomId: selectedRoom.id,
          },
        });

        const courses = res.data || [];

        const newEntries = {};
        courses.forEach((course) => {
          const { courseName, courseCode, courseTime } = course;

          const parts = courseTime.split(',');

          let currentDay = null;

          parts.forEach((p) => {
            p = p.trim();

            const dayMatch = p.match(/^([월화수목금토일])\s*(\w+)$/);
            if (dayMatch) {
              currentDay = dayMatch[1];
              const slot = dayMatch[2]; // 8B

              const key = `${currentDay}-${slot}`;
              newEntries[key] = `${courseName}\n${courseCode}`;
              return;
            }

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
      maxHeight='560px'
    />
  );
}

CourseTimeTable.propTypes = { selectedRoom: PropTypes.object };
