// src/pages/ApproveExamPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
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
  const [showOverlapModal, setShowOverlapModal] = useState(false);
  const [showInvalidTimeModal, setShowInvalidTimeModal] = useState(false);
  const [showNoRoomModal, setShowNoRoomModal] = useState(false);
  const closeNoRoomModal = () => setShowNoRoomModal(false);

  const [updated, setUpdated] = useState({
    examType: '',
    startTime: null,
    endTime: null,
  });

  const [roomSchedules, setRoomSchedules] = useState([]);
  const isOverlapping = (startA, endA, startB, endB) => {
    return startA < endB && endA > startB;
  };

  // 로그인 체크
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

    setUpdated((prev) => ({
      examType: prev.examType || exam.examType,
      startTime:
        prev.startTime !== null ? prev.startTime : new Date(exam.startTime),
      endTime: prev.endTime !== null ? prev.endTime : new Date(exam.endTime),
    }));
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
      content: (() => {
        const labelMap = { MID: '중간', FINAL: '기말', ETC: '기타' };

        return (
          <div className='text-[13px]'>
            {labelMap[exam.examType] ?? exam.examType}
          </div>
        );
      })(),
    },

    {
      id: '3',
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

    {
      id: '4',
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
              if (!range?.from || !range?.to) {
                console.warn('⛔ DateTimePicker returned invalid data');
                return;
              }

              setUpdated((prev) => ({
                ...prev,
                startTime: range.from, // 그대로 Date 객체
                endTime: range.to,
              }));
            }}
          />
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

  const finalRoomId = updated.examRoomId ?? exam.roomId;

  const isValidExamDate = (date) => {
    if (!(date instanceof Date)) return false;
    if (Number.isNaN(date.getTime())) return false;

    // 말도 안 되게 과거인 값(예: epoch) 방지용
    if (date.getFullYear() < 2000) return false;

    return true;
  };

  const handleApprove = async () => {
    const roomIdToSend = updated.examRoomId ?? exam.roomId;

    if (
      isNaN(updated.startTime?.getTime()) ||
      isNaN(updated.endTime?.getTime())
    ) {
      setShowInvalidTimeModal(true);
      return;
    }

    if (!roomIdToSend) {
      setShowNoRoomModal(true);
      return;
    }

    if (
      !isValidExamDate(updated.startTime) ||
      !isValidExamDate(updated.endTime)
    ) {
      setShowInvalidTimeModal(true);
      return;
    }
    const hasOverlap = roomSchedules.some((item) => {
      if (!item.roomId) return false;
      if (Number(item.examId) === Number(exam.examId)) return false; // 자기 자신 제외
      if (Number(item.roomId) !== Number(finalRoomId)) return false;

      const existingStart = new Date(item.startTime);
      const existingEnd = new Date(item.endTime);

      return isOverlapping(
        updated.startTime,
        updated.endTime,
        existingStart,
        existingEnd
      );
    });

    if (hasOverlap) {
      setShowOverlapModal(true); // 중복 모달 따로 관리
      return;
    }
    const startLocal = formatToLocalISO(updated.startTime);
    const endLocal = formatToLocalISO(updated.endTime);

    try {
      await apiClient.post('/api/exam/confirm', {
        examId: exam.examId,
        examType: updated.examType,
        startTime: startLocal,
        endTime: endLocal,
        examRoomId: roomIdToSend,
      });
      setShowSuccessModal(true);
    } catch (err) {
      if (err.response?.status === 400) {
        // 서버 측에서 일정 겹침 반환
        setShowOverlapModal(true);
      } else {
        // 기타 오류
        setShowErrorModal(true);
      }
    }
  };

  if (!exam) return <div>Loading...</div>;

  const approveButtonText = exam.examAssigned === 'NOT_YET' ? '승인' : '수정';

  const buttons = [
    { text: approveButtonText, color: 'gold', onClick: handleApprove },
  ];

  return (
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle={`${departmentName ?? ''} 메뉴`}
      onLogout={handleLogout}
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
            onFetchSchedule={(scheduleList) => {
              setRoomSchedules(scheduleList);
            }}
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

            setUpdated((prev) => ({ ...prev, examRoomId: room.id }));
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
          cancelText='취소'
          onConfirm={() => {
            setShowSuccessModal(false);
            navigate('/office/exam');
          }}
          onCancel={() => setShowSuccessModal(false)}
          onClose={() => setShowSuccessModal(false)}
          width='400px'
          height='200px'
        />
      )}
      {showOverlapModal && (
        <Modal
          title='일정 중복'
          content={
            <div className='p-3'>
              이미 해당 시간대에 시험이 존재합니다.
              <br />
              다른 시간대를 선택해 주세요.
            </div>
          }
          confirmText='확인'
          cancelText='취소'
          onConfirm={() => setShowOverlapModal(false)}
          onCancel={() => setShowOverlapModal(false)}
          onClose={() => setShowOverlapModal(false)}
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
          cancelText='취소'
          onConfirm={() => setShowErrorModal(false)}
          onCancel={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
          width='400px'
          height='200px'
        />
      )}

      {showInvalidTimeModal && (
        <Modal
          title='시간 오류'
          content={
            <div className='p-3'>
              시간이 올바르게 설정되지 않았습니다.
              <br />
              다시 선택해 주세요.
            </div>
          }
          confirmText='확인'
          cancelText='취소'
          onConfirm={() => setShowInvalidTimeModal(false)}
          onCancel={() => setShowInvalidTimeModal(false)}
          onClose={() => setShowInvalidTimeModal(false)}
          width='400px'
          height='200px'
        />
      )}

      {showNoRoomModal && (
        <Modal
          title='장소 선택 필요'
          content={<div className='p-3'>시험 장소가 선택되지 않았습니다.</div>}
          confirmText='확인'
          cancelText='취소'
          onConfirm={closeNoRoomModal}
          onCancel={closeNoRoomModal}
          onClose={closeNoRoomModal}
          width='400px'
          height='200px'
        />
      )}
    </Layout>
  );
}
