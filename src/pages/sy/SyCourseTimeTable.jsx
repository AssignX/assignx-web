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
        const res = await apiClient.get('/api/course/search', {
          params: {
            year: selectedRoom.year,
            semester: selectedRoom.semester,
            roomNumber: selectedRoom.roomNumber,
            // major: '',
            // professorName: '',
            // professorId: '',
          },
        });

        const courses = res.data || [];

        const newEntries = {};
        courses.forEach((course) => {
          const { courseName, courseCode, courseTime } = course;

          const formattedTime = courseTime.replace(
            /([월화수목금토일])(\d)/,
            '$1-$2'
          );

          newEntries[formattedTime] = `${courseName}\n${courseCode}`;
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
      startTime='08:00'
      endTime='22:30'
      dayRange={['월', '화', '수', '목', '금', '토']}
      entries={entries}
      maxHeight='740px'
    />
  );
}

CourseTimeTable.propTypes = { selectedRoom: PropTypes.object };
