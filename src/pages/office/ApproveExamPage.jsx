// src/pages/ApproveExamPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/pages/office/Layout';
import PageHeader from '@/components/headers/PageHeader';
import apiClient from '@/api/apiClient';
import dayjs from 'dayjs';
import { useAuthStore } from '@/store/useAuthStore';
import HorizontalTable from '@/components/table/HorizontalTable';
import DateTimePicker from '@/components/pickers/DateTimePicker';
import ExamTimeTable from '@/pages/office/ExamTimeTable';
import Button from '@/components/buttons/Button';
//import Modal from '@/components/modal/Modal';
import BuildingSearchModal from '@/components/BuildingSearchModal';
import RoomSearchModal from '@/components/RoomSearchModal';

export default function ApproveExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { name: userNameFromStore, departmentName } = useAuthStore();

  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const [exam, setExam] = useState(null);

  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const [updated, setUpdated] = useState({
    examType: '',
    startTime: null,
    endTime: null,
  });

  // 로그인 체크
  useEffect(() => {
    if (!accessToken) navigate('/login');
  }, [accessToken, navigate]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch {}
    logout();
    navigate('/login');
  };

  // 시험 상세 조회
  useEffect(() => {
    const loadExam = async () => {
      try {
        const res = await apiClient.get('/api/exam/search', {
          params: { year: '2025', semester: '2' },
        });

        const list = res.data;
        const found = list.find((e) => e.examId === Number(id));

        console.log('📌 /api/exam/search 응답:', list);
        console.log('📌 exam 객체 확인:', found);
        if (found) {
          console.log('🔎 startTime:', found.startTime);
          console.log('🔎 endTime:', found.endTime);
          console.log('🔎 buildingName:', found.buildingName);
          console.log('🔎 roomNumber:', found.roomNumber);
          console.log('🔎 roomId:', found.roomId);
        } else {
          console.warn('❗ examId에 해당하는 exam이 없음:', id);
        }

        setExam(found);
      } catch (err) {
        console.error('시험 정보 로드 실패:', err);
      }
    };

    loadExam();
  }, [id]);

  // exam 로드 후 updated값 설정
  useEffect(() => {
    if (!exam) return;

    setUpdated({
      examType: exam.examType,
      startTime: new Date(exam.startTime),
      endTime: new Date(exam.endTime),
    });
  }, [exam]);

  if (!exam) return <div>Loading...</div>;

  // HorizontalTable 용 데이터
  const infoItems = [
    { id: '1', label: '과목명', content: exam.courseName },
    {
      id: '2',
      label: '구분',
      content: (
        <select
          className='border p-2 text-sm'
          value={updated.examType}
          onChange={(e) => setUpdated({ ...updated, examType: e.target.value })}
        >
          <option value='MID'>중간</option>
          <option value='FINAL'>기말</option>
          <option value='ETC'>기타</option>
        </select>
      ),
    },
    {
      id: '3',
      label: '일정',
      content: (
        <DateTimePicker
          initialDate={exam.startTime}
          initialStart={dayjs(exam.startTime).format('HH:mm')}
          initialEnd={dayjs(exam.endTime).format('HH:mm')}
          onUpdate={({ range }) => {
            setUpdated({
              ...updated,
              startTime: range.from,
              endTime: range.to,
            });
          }}
        />
      ),
    },
    {
      id: '4',
      label: '장소',
      content: (
        <div
          className='cursor-pointer rounded p-1 hover:bg-yellow-50'
          onClick={() => setShowBuildingModal(true)}
        >
          {exam.buildingName && exam.roomNumber
            ? `${exam.buildingName} ${exam.roomNumber}`
            : '미배정'}
        </div>
      ),
    },
  ];

  // 승인/수정 처리
  const handleApprove = async () => {
    try {
      await apiClient.post('/api/exam/confirm', {
        examId: exam.examId,
        examType: updated.examType,
        startTime: updated.startTime.toISOString(),
        endTime: updated.endTime.toISOString(),
        examRoomId: exam.roomId, // backend confirm API는 roomId 필요 → 기존 유지
      });

      alert('시험 일정이 성공적으로 확정되었습니다.');
      navigate('/office/exam');
    } catch {
      alert('시험 확정에 실패했습니다.');
    }
  };

  return (
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle={`${departmentName ?? ''} 메뉴`}
      onLogout={handleLogout}
      menus={[
        {
          title: '과목',
          subItems: [{ label: '과목 목록', path: '/office/subjects' }],
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
          title: '시험',
          isOpen: true,
          subItems: [
            { label: '시험 일정', path: '/office/exam', isSelected: true },
          ],
        },
      ]}
    >
      <div className='p-6'>
        <PageHeader title='일정 수정' />

        {/* 시험 기본 정보 영역 */}
        <div className='mt-4'>
          <HorizontalTable items={infoItems} />
        </div>

        {/* 강의실 시간표 (buildingName + roomNumber 기준 표시됨) */}
        <div className='mt-6'>
          <ExamTimeTable
            selectedRoom={{
              year: exam.year,
              semester: exam.semester,
              buildingName: exam.buildingName,
              roomNumber: exam.roomNumber,
            }}
          />
        </div>

        {/* 버튼 */}
        <div className='mt-6 flex justify-end'>
          <Button
            text={exam.examAssigned === 'NOT_YET' ? '승인' : '수정'}
            color='gold'
            onClick={handleApprove}
          />
        </div>
      </div>
      {showBuildingModal && (
        <BuildingSearchModal
          isOpen={showBuildingModal}
          onClose={() => setShowBuildingModal(false)}
          onSelect={(building) => {
            // building = { buildingId, buildingNum, buildingName }
            setSelectedBuilding(building);
            setShowBuildingModal(false);
            setShowRoomModal(true); // 강의실 모달로 넘어감
          }}
        />
      )}
      {showRoomModal && (
        <RoomSearchModal
          isOpen={showRoomModal}
          buildingId={selectedBuilding?.buildingId}
          onClose={() => setShowRoomModal(false)}
          onSelect={(room) => {
            setExam({
              ...exam,
              buildingName: selectedBuilding.buildingName,
              roomNumber: room.roomNumber,
              roomId: room.id,
            });

            setUpdated({ ...updated, examRoomId: room.id });
            setShowRoomModal(false);
          }}
        />
      )}
    </Layout>
  );
}
