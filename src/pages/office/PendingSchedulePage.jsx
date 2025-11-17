// src/pages/PendingSchedulePage.jsx
import React, { useState, useEffect } from 'react';
import Layout from '@/pages/office/Layout';
import PageHeader from '@/components/headers/PageHeader';
import ScheduleSearchTable from '@/components/table/ScheduleSearchTable';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function PendingSchedulePage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { name: userNameFromStore } = useAuthStore();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isConfirmed, setIsConfirmed] = useState(true); // Header 확인/미확인 상태

  // 로그인 체크
  useEffect(() => {
    if (!accessToken) navigate('/login');
  }, [accessToken, navigate]);

  const handleSearch = async (filters) => {
    setLoading(true);

    try {
      const res = await apiClient.get('/api/exam/search', {
        params: {
          year: filters.year,
          semester: filters.semester,
          departmentId: filters.departmentId || undefined,
          professorId: filters.professorId || undefined,
          roomId: filters.roomId || undefined,
        },
      });

      const data = res.data;
      console.log('Pending API Response:', data);

      // 미확정 상태만 필터링
      const pendingStates = [
        'NOT_YET',
        'WAITING_HIGH_PRIORITY',
        'WAITING_LOW_PRIORITY',
      ];

      let filtered = data.filter((item) =>
        pendingStates.includes(item.examAssigned)
      );

      // 구분
      if (filters.division) {
        filtered = filtered.filter((item) => {
          if (filters.division === '중간') return item.examType === 'MID';
          if (filters.division === '기말') return item.examType === 'FINAL';
          if (filters.division === '기타') return item.examType === 'ETC';
          return true;
        });
      }

      // keyword
      if (filters.keyword.trim()) {
        const kw = filters.keyword.trim();
        filtered = filtered.filter(
          (item) =>
            item.courseName.includes(kw) ||
            item.courseCode.includes(kw) ||
            item.buildingName.includes(kw) ||
            item.roomNumber.includes(kw)
        );
      }

      setRows(filtered);
    } catch (err) {
      console.error('시험 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const buttons = [
    { text: '승인', color: 'lightgray', onClick: () => {} },
    { text: '수정', color: 'lightgray', onClick: () => {} },
    { text: '삭제', color: 'lightgray', onClick: () => {} },
  ];

  const columns = [
    {
      accessorKey: 'no',
      header: 'No',
      size: 50,
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: 'courseName', header: '강좌명', size: 160 },
    { accessorKey: 'courseCode', header: '코드', size: 100 },

    {
      accessorKey: 'examType',
      header: '구분',
      size: 80,
      cell: ({ row }) => {
        const t = row.original.examType;
        if (t === 'MID') return '중간';
        if (t === 'FINAL') return '기말';
        if (t === 'ETC') return '기타';
        return t;
      },
    },

    {
      accessorKey: 'place',
      header: '장소',
      size: 120,
      cell: ({ row }) => {
        const b = row.original.buildingName || '';
        const r = row.original.roomNumber || '';
        return b && r ? `${b} ${r}` : '-';
      },
    },

    {
      accessorKey: 'startTime',
      header: '시작',
      size: 160,
      cell: ({ row }) =>
        row.original.startTime?.replace('T', ' ').replace('Z', ''),
    },
    {
      accessorKey: 'endTime',
      header: '종료',
      size: 160,
      cell: ({ row }) =>
        row.original.endTime?.replace('T', ' ').replace('Z', ''),
    },

    {
      accessorKey: 'examAssigned',
      header: '배정상태',
      size: 100,
      cell: ({ row }) => {
        const v = row.original.examAssigned;
        if (v === 'NOT_YET') return '미확정';
        if (v === 'WAITING_HIGH_PRIORITY') return '대기-우선';
        if (v === 'WAITING_LOW_PRIORITY') return '대기-일반';
        return v;
      },
    },
  ];

  return (
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle='일정'
      menus={[
        {
          title: '과목',
          subItems: [{ label: '과목 목록', path: '/office/courses' }],
        },
        {
          title: '교수',
          subItems: [{ label: '교수 목록', path: '/office/professors' }],
        },
        {
          title: '강의실',
          subItems: [{ label: '강의실 목록', path: '/office/classrooms' }],
        },
        {
          title: '일정',
          isOpen: true,
          subItems: [
            { label: '확정 목록', path: '/office/confirmed' },
            { label: '미확정 목록', path: '/office/pending', isSelected: true },
          ],
        },
      ]}
    >
      <PageHeader
        title='일정 목록'
        hasConfirmSelection={true}
        disableConfirmToggle={true}
        selected={isConfirmed}
        setSelected={setIsConfirmed}
        buttonsData={buttons}
      />

      <div className='max-h-[600px] overflow-y-auto'>
        <ScheduleSearchTable onSearch={handleSearch} />
      </div>

      <div className='mt-4 bg-white'>
        {loading && <p className='mt-3 px-2 text-gray-500'>불러오는 중...</p>}

        {!loading && rows.length > 0 && (
          <VerticalTable
            columns={columns}
            data={rows}
            selectable={true}
            singleSelect={false}
            headerHeight={32}
            maxHeight={600}
          />
        )}
      </div>
    </Layout>
  );
}
