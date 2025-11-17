// src/pages/ConfirmedSchedulePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/pages/office/Layout';
import PageHeader from '@/components/headers/PageHeader';
import ScheduleSearchTable from '@/components/table/ScheduleSearchTable';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import ButtonGroup from '@/components/buttons/ButtonGroup';

export default function ConfirmedSchedulePage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { name: userNameFromStore } = useAuthStore();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isConfirmed, setIsConfirmed] = useState(true); // Header 확인/미확인 상태

  const handleToggle = (value) => {
    if (value === true) navigate('/office/confirmed');
    else navigate('/office/pending');
  };

  const handleApprove = () => {
    console.log('승인 요청');
    // TODO: 승인 API 연동
  };

  const handleEdit = () => {
    console.log('수정 요청');
    // TODO: 일정 수정 모달 열기
  };

  const handleDelete = () => {
    console.log('삭제 요청');
    // TODO: 삭제 확인 모달 → 삭제 API 호출
  };

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
      console.log('API Response:', res.data);

      // 확정 / 미확정 필터 적용
      const confirmedStates = ['COMPLETED_FIRST', 'COMPLETED_SECOND'];
      let filtered = data;

      // 확정 여부
      filtered = data.filter((item) =>
        confirmedStates.includes(item.examAssigned)
      );

      // 구분 필터
      if (filters.division) {
        filtered = filtered.filter((item) => {
          if (filters.division === '중간') return item.examType === 'MID';
          if (filters.division === '기말') return item.examType === 'FINAL';
          if (filters.division === '기타') return item.examType === 'ETC';
          return true;
        });
      }

      // keyword 필터
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

  // 상단 버튼 그룹
  const buttons = [
    { text: '승인', color: 'lightgray', onClick: handleApprove },
    { text: '수정', color: 'lightgray', onClick: handleEdit },
    { text: '삭제', color: 'lightgray', onClick: handleDelete },
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
        if (v === 'COMPLETED_FIRST') return '1순위';
        if (v === 'COMPLETED_SECOND') return '2순위';
        if (v === 'WAITING_HIGH_PRIORITY') return '대기–우선';
        if (v === 'WAITING_LOW_PRIORITY') return '대기–일반';
        if (v === 'NOT_YET') return '미확정';
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
            { label: '확정 목록', path: '/office/confirmed', isSelected: true },
            { label: '미확정 목록', path: '/office/pending' },
          ],
        },
      ]}
    >
      {/* ---------------------- Header ---------------------- */}
      <PageHeader
        title='일정 목록'
        hasConfirmSelection={true}
        selected={true} // 확정 페이지
        setSelected={handleToggle}
        buttonsData={buttons}
      />

      {/* ---------------------- Filters ---------------------- */}
      <div className='max-h-[600px] overflow-y-auto'>
        <ScheduleSearchTable onSearch={handleSearch} />
      </div>

      {/* ---------------------- Table ---------------------- */}
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
