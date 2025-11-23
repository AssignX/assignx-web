// src/pages/ApproveExamPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/pages/office/Layout';
import PageHeader from '@/components/headers/PageHeader';
import apiClient from '@/api/apiClient';
import dayjs from 'dayjs';
import { useAuthStore } from '@/store/useAuthStore';
import HorizontalTable from '@/components/table/HorizontalTable';
import DropdownCell from '@/components/table/cells/DropdownCell';
import DateTimePicker from '@/components/pickers/DateTimePicker';
import ExamTimeTable from '@/pages/office/ExamTimeTable';
import WeekPicker from '@/components/pickers/WeekPicker';
import Button from '@/components/buttons/Button';
import Modal from '@/components/modal/Modal';
import BuildingSearchModal from '@/components/BuildingSearchModal';
import RoomSearchModal from '@/components/RoomSearchModal';

export default function ApproveExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { name: userNameFromStore, departmentName } = useAuthStore();

  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { departmentId } = useAuthStore();

  const [exam, setExam] = useState(null);
  const [weekDate, setWeekDate] = useState(dayjs());

  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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
          params: { year: '2025', semester: '2', departmentId },
        });

        const found = res.data.find((e) => e.examId === Number(id));

        if (!found) {
          console.error('⚠️ 지정한 examId로 데이터를 찾을 수 없습니다:', id);
          return;
        }

        setExam(found);
      } catch (err) {
        console.error('시험 정보 로드 실패:', err);
      }
    };

    loadExam();
  }, [id, departmentId]);

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
    {
      id: '1',
      label: '과목명',
      labelWidth: '84px',
      contentWidth: '150px',
      content: exam.courseName,
    },
    {
      id: '2',
      label: '구분',
      labelWidth: '72px',
      contentWidth: '106px',
      content: (
        <DropdownCell
          initialValue={updated.examType}
          rowId='examType'
          columnKey='examType'
          height={32} // HorizontalTable 행 높이(41px)에 맞춘 값
          updateData={(rowId, columnKey, newValue) => {
            setUpdated((prev) => ({ ...prev, [columnKey]: newValue }));
          }}
          options={[
            { value: 'MID', label: '중간' },
            { value: 'FINAL', label: '기말' },
            { value: 'ETC', label: '기타' },
          ]}
        />
      ),
    },

    {
      id: '3',
      label: '일정',
      labelWidth: '72px',
      contentWidth: '308px',
      content: (
        <div className='flex h-[32px] items-center'>
          <DateTimePicker
            initialDate={exam.startTime}
            initialStart={dayjs(exam.startTime).format('HH:mm')}
            initialEnd={dayjs(exam.endTime).format('HH:mm')}
            onUpdate={({ range }) => {
              const baseDate = dayjs(exam.startTime).format('YYYY-MM-DD');

              const start = dayjs(`${baseDate} ${range.from}`);
              const end = dayjs(`${baseDate} ${range.to}`);

              setUpdated({
                ...updated,
                startTime: start.toDate(),
                endTime: end.toDate(),
              });
            }}
          />
        </div>
      ),
    },
    {
      id: '4',
      label: '장소',
      labelWidth: '100px',
      contentWidth: '200px',
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

  const formatToLocalISO = (dateObj) => {
    const pad = (n) => String(n).padStart(2, '0');
    return (
      dateObj.getFullYear() +
      '-' +
      pad(dateObj.getMonth() + 1) +
      '-' +
      pad(dateObj.getDate()) +
      'T' +
      pad(dateObj.getHours()) +
      ':' +
      pad(dateObj.getMinutes()) +
      ':00'
    );
  };

  const handleApprove = async () => {
    const roomIdToSend = updated.examRoomId ?? exam.roomId;

    if (!roomIdToSend) {
      alert('시험 장소가 선택되지 않았습니다.');
      return;
    }

    const startLocal = formatToLocalISO(updated.startTime);
    const endLocal = formatToLocalISO(updated.endTime);

    try {
      const res = await apiClient.post('/api/exam/confirm', {
        examId: exam.examId,
        examType: updated.examType,
        startTime: startLocal,
        endTime: endLocal,
        examRoomId: roomIdToSend,
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error('confirm error:', err);
      setShowErrorModal(true);
    }
  };

  if (!exam) return <div>Loading...</div>;

  const approveButtonText = exam.examAssigned === 'NOT_YET' ? '승인' : '수정';

  const buttons = [
    { text: approveButtonText, color: 'gold', onClick: handleApprove },
  ];
  const finalRoomId = updated.examRoomId ?? exam.roomId;

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
      <PageHeader title='일정 수정' buttonsData={buttons} />

      {/* 시험 기본 정보 영역 */}
      <div className='w-full'>
        <HorizontalTable items={infoItems} />
      </div>

      <div className='mt-[10px] flex justify-end'>
        <WeekPicker date={weekDate} setDate={setWeekDate} />
      </div>

      {/* 강의실 시간표 (buildingName + roomNumber 기준 표시됨) */}
      <div className='mt-[10px]'>
        {finalRoomId && (
          <ExamTimeTable
            selectedRoom={{
              year: exam.year,
              semester: exam.semester,
              departmentId,
              roomId: finalRoomId,
              buildingName: exam.buildingName,
              roomNumber: exam.roomNumber,
            }}
            weekDate={weekDate}
          />
        )}
      </div>
      {showBuildingModal && (
        <BuildingSearchModal
          isOpen={showBuildingModal}
          onClose={() => setShowBuildingModal(false)}
          onSelect={(building) => {
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
      {showSuccessModal && (
        <Modal
          title='확정 완료'
          content={
            <div className='p-3'>시험 일정이 성공적으로 확정되었습니다.</div>
          }
          confirmText='확인'
          onConfirm={() => {
            setShowSuccessModal(false);
            navigate('/office/exam');
          }}
          width='400px'
          height='200px'
        />
      )}
      {showErrorModal && (
        <Modal
          title='오류 발생'
          content={
            <div className='p-3'>
              시험 일정 확정에 실패했습니다.
              <br />
              다시 시도해주세요.
            </div>
          }
          confirmText='확인'
          onConfirm={() => setShowErrorModal(false)}
          width='400px'
          height='200px'
        />
      )}
    </Layout>
  );
}
