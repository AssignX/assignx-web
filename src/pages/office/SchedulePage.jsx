// src/pages/SchedulePage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/pages/office/Layout';
import PageHeader from '@/components/headers/PageHeader';
import ScheduleSearchTable from '@/components/table/ScheduleSearchTable';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/buttons/Button';
import Modal from '@/components/modal/Modal';

export default function SchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = () => {
    if (!selectedExam) {
      setSelectExamMessage('수정할 시험을 선택하세요.');
      setShowSelectExamModal(true);
      return;
    }

    navigate(`/office/exam/approve/${selectedExam.examId}`);
  };

  // 교수 조회 페이지와 동일한 방식으로 스토어 사용
  const {
    name: userNameFromStore,
    departmentName,
    departmentId,
  } = useAuthStore();

  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const [selected, setSelected] = useState(true); // true=확정, false=미확정
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showSelectExamModal, setShowSelectExamModal] = useState(false);
  const [selectExamMessage, setSelectExamMessage] = useState('');

  const buttons = selected
    ? [{ text: '수정', color: 'lightgray', onClick: handleEdit }]
    : [
        {
          text: '승인',
          color: 'lightgray',
          onClick: () => {
            if (!selectedExam) {
              setSelectExamMessage('승인할 시험을 선택하세요.');
              setShowSelectExamModal(true);
              return;
            }

            navigate(`/office/exam/approve/${selectedExam.examId}`);
          },
        },
      ];

  // 기본 필터 (초기 진입 시 한 번 조회용)
  const defaultFilters = {
    year: '2025',
    semester: '2',
    division: '',
    keyword: '',
  };

  // 로그인 체크
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  // 로그아웃 처리 (교수 조회 페이지와 동일 패턴)
  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.warn('서버 로그아웃 실패 (클라이언트만 처리)');
    } finally {
      logout();
      navigate('/login');
    }
  };

  // 시험 조회 + 확정/미확정 + division + keyword 필터링
  const handleSearch = async (filters) => {
    // departmentId가 아직 없으면 굳이 호출하지 않음
    if (!departmentId) {
      setRows([]);
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.get('/api/exam/search', {
        params: {
          year: filters.year,
          semester: filters.semester,
          departmentId, // 로그인한 사용자의 학과 기준
          // professorId, roomId 등은 추후 필요 시 추가
        },
      });

      const data = res.data;
      console.log('🔍 GET /api/exam/search 결과:', data);
      const confirmedStates = ['COMPLETED_FIRST', 'COMPLETED_SECOND'];

      // 확정/미확정 필터
      let filtered = data.filter(
        (item) =>
          selected
            ? confirmedStates.includes(item.examAssigned) // 확정
            : item.examAssigned === 'NOT_YET' // 미확정
      );

      // 구분 필터 (중간/기말/기타)
      if (filters.division) {
        filtered = filtered.filter((item) => {
          if (filters.division === '중간') return item.examType === 'MID';
          if (filters.division === '기말') return item.examType === 'FINAL';
          if (filters.division === '기타') return item.examType === 'ETC';
          return true;
        });
      }

      // 강좌 검색(강좌명/코드/건물/강의실)
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

      setRows(
        filtered.map((item) => ({
          ...item,
          id: item.examId, // 체크박스 선택 기능이 동작하려면 반드시 필요
          roomId: item.roomId,
        }))
      );
    } catch (err) {
      console.error('시험 조회 실패:', err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 첫 진입 + 확정/미확정 토글 변경 시 기본 필터로 자동 조회
  useEffect(() => {
    handleSearch(defaultFilters);
  }, [location, selected, departmentId]);

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
      headerTitle={`${departmentName ?? ''} 메뉴`}
      onLogout={handleLogout} // 교수 페이지와 동일
      menus={[
        { title: '과목', subItems: [{ label: '과목 목록', path: '/classes' }] },
        {
          title: '교수',
          subItems: [{ label: '교수 목록', path: '/office/professors' }],
        },
        {
          title: '강의실',
          subItems: [{ label: '강의실 목록', path: '/office/classrooms' }],
        },
        {
          title: '시험',
          isOpen: true,
          subItems: [
            { label: '시험 일정', path: '/office/exam', isSelected: true },
          ],
        },
      ]}
    >
      <PageHeader
        title='일정 목록'
        hasConfirmSelection={true}
        selected={selected}
        setSelected={setSelected} // 토글로 확정/미확정 전환
        buttonsData={buttons}
      />

      <div className='h-[764px] overflow-y-auto'>
        <ScheduleSearchTable onSearch={handleSearch} />

        <div className='mt-[10px] bg-white'>
          {loading && <p className='mt-3 px-2 text-gray-500'>불러오는 중...</p>}
          {!loading && (
            <>
              <VerticalTable
                columns={columns}
                selectable={true}
                singleSelect={true}
                data={rows}
                maxHeight={600}
                updateSelection={(ids) => {
                  if (ids.length === 0) {
                    setSelectedExam(null);
                    return;
                  }
                  const examId = Number(ids[0]);
                  const exam = rows.find((item) => item.id === examId);
                  setSelectedExam(exam);
                }}
              />

              {rows.length === 0}
            </>
          )}
        </div>
      </div>

      {showSelectExamModal && (
        <Modal
          title='알림'
          content={<div className='p-3'>{selectExamMessage}</div>}
          confirmText='확인'
          onConfirm={() => setShowSelectExamModal(false)}
          width='360px'
          height='180px'
        />
      )}
    </Layout>
  );
}
