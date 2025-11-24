// src/pages/professor/SecondApplicationPage.jsx
import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';
import { SearchIcon } from '@/assets/icons';

import InputCell from '@/components/table/cells/InputCell';
import SearchCell from '@/components/table/cells/SearchCell';
import DateTimePickerCell from '@/components/table/cells/DateTimePickerCell.jsx';

import ClassRoomModal from '@/components/ClassRoomModal.jsx';
import ConfirmModal from './ConfirmModal.jsx';

import { useState, useCallback, useMemo } from 'react';
import apiClient from '@/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { formatExamDateTimeRange } from './parsingTime';

const mapExamAssignedToLabel = (status) => {
  switch (status) {
    case 'NOT_YET':
      return '미신청';
    case 'WAITING_HIGH_PRIORITY':
      return '대기(유력)';
    case 'WAITING_LOW_PRIORITY':
      return '대기(후순위)';
    case 'COMPLETED_FIRST':
      return 'Y(1차)';
    case 'COMPLETED_SECOND':
      return 'Y(2차)';
    default:
      return '';
  }
};

const unconfirmedTableColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '과목명', accessorKey: 'subjectName', size: 120 },
  { header: '과목코드', accessorKey: 'subjectCode', size: 100 },
  { header: '분반', accessorKey: 'classSection', size: 50 },
  { header: '강의시간', accessorKey: 'classTime', size: 200 },
  { header: '수강인원', accessorKey: 'studentCount', size: 64 },
  {
    header: '신청시간',
    accessorKey: 'secondRange',
    size: 300,
    cell: (info) => {
      const row = info.row.original;
      return (
        <DateTimePickerCell
          range={row.secondRange}
          onChange={(range) => {
            if (row.updateSecondRange) {
              row.updateSecondRange(row.examId, range);
            }
          }}
        />
      );
    },
  },
  {
    header: '강의실',
    accessorKey: 'classRoom',
    size: 150,
    cell: (info) => {
      const row = info.row.original;
      return (
        <SearchCell
          initialValue={info.getValue() ?? ''}
          disabled
          onSearch={() => {
            if (row.onClickRoomSearch) {
              row.onClickRoomSearch(row.examId);
            }
          }}
        />
      );
    },
  },
  { header: '확정여부', accessorKey: 'confirmationStatus', size: 100 },
];

const confirmedTableColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '과목명', accessorKey: 'subjectName', size: 120 },
  { header: '과목코드', accessorKey: 'subjectCode', size: 100 },
  { header: '분반', accessorKey: 'classSection', size: 50 },
  { header: '강의시간', accessorKey: 'classTime', size: 200 },
  { header: '확정 시간', accessorKey: 'confirmedTime', size: 300 },
  { header: '강의실', accessorKey: 'classRoom', size: 150 },
  { header: '수강인원', accessorKey: 'studentCount', size: 64 },
  { header: '확정여부', accessorKey: 'confirmationStatus', size: 100 },
];

const categorizeExamsByStatus = (list) => ({
  unapplied: list.filter((e) => e.examAssigned === 'NOT_YET'),
  waiting: list.filter(
    (e) =>
      e.examAssigned === 'WAITING_HIGH_PRIORITY' ||
      e.examAssigned === 'WAITING_LOW_PRIORITY'
  ),
  confirmed: list.filter(
    (e) =>
      e.examAssigned === 'COMPLETED_FIRST' ||
      e.examAssigned === 'COMPLETED_SECOND'
  ),
});
const formatClassRoomLabel = (buildingName, roomNumber) => {
  const label = `${buildingName ?? ''} ${roomNumber ?? ''}`.trim();
  return label || '-';
};
const createCommonRowFields = (exam, indexOverride) => {
  const [code, section] = exam.courseCode?.split('-') ?? ['', ''];
  return {
    id: String(exam.examId),
    examId: exam.examId,
    number: typeof indexOverride === 'number' ? indexOverride + 1 : undefined,
    subjectName: exam.courseName,
    subjectCode: code,
    classSection: section,
    classTime: exam.courseTime,
    classRoom: formatClassRoomLabel(exam.buildingName, exam.roomNumber),
    examRoomId: exam.examRoomId ?? exam.roomId ?? null,
    studentCount: exam.enrolledCount,
    confirmationStatus: mapExamAssignedToLabel(exam.examAssigned),
  };
};
const toDateRange = (exam) =>
  exam.startTime && exam.endTime
    ? { from: new Date(exam.startTime), to: new Date(exam.endTime) }
    : null;
const createUnappliedRow = ({ exam, idx, onRangeChange, openRoomModal }) => ({
  ...createCommonRowFields(exam, idx),
  secondRange: null,
  updateSecondRange: onRangeChange,
  onClickRoomSearch: () => openRoomModal('unapplied', exam.examId),
});
const createUnconfirmedRow = ({ exam, idx, onRangeChange, openRoomModal }) => ({
  ...createCommonRowFields(exam, idx),
  secondRange: toDateRange(exam),
  updateSecondRange: onRangeChange,
  onClickRoomSearch: () => openRoomModal('unconfirmed', exam.examId),
});
const createConfirmedRow = (exam, idx) => ({
  ...createCommonRowFields(exam, idx),
  confirmedTime: formatExamDateTimeRange(exam.startTime, exam.endTime),
});
const patchRowByExamId = (setRows, rowId, partial) => {
  setRows((prev) =>
    prev.map((row) =>
      String(row.examId) === String(rowId) ? { ...row, ...partial } : row
    )
  );
};
const getRowsBySelectedIds = (selectedIds, rows) => {
  if (!selectedIds?.length || !rows.length) return [];

  const lookup = new Map();
  rows.forEach((row, idx) => {
    const candidates = [
      row.id,
      row.examId,
      String(row.examId),
      idx,
      String(idx),
    ];
    candidates.forEach((key) => {
      if (key === undefined || key === null) return;
      lookup.set(String(key), row);
    });
  });

  const unique = new Map();
  selectedIds.forEach((id) => {
    const matched = lookup.get(String(id));
    if (matched) unique.set(String(matched.examId), matched);
  });

  return Array.from(unique.values());
};

function SecondApplicationPage() {
  const [openYear] = useState(2025);
  const [openSemester] = useState('2학기');

  const departmentName = useAuthStore((state) => state.departmentName);
  const professorName = useAuthStore((state) => state.name);
  const professorId = useAuthStore((state) => String(state.idNumber));
  const memberId = useAuthStore((state) => state.memberId);

  const [unappliedRows, setUnappliedRows] = useState([]);
  const [unconfirmedRows, setUnconfirmedRows] = useState([]);
  const [confirmedRows, setConfirmedRows] = useState([]);

  const [selectedUnappliedIds, setSelectedUnappliedIds] = useState([]);
  const [selectedUnconfirmedIds, setSelectedUnconfirmedIds] = useState([]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState('apply'); // 'apply' | 'update'

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [currentRoomRowId, setCurrentRoomRowId] = useState(null);
  const [currentRoomTableType, setCurrentRoomTableType] = useState(''); // 'unapplied' | 'unconfirmed'

  const updateUnappliedRange = useCallback((rowId, range) => {
    patchRowByExamId(setUnappliedRows, rowId, { secondRange: range });
  }, []);

  const updateUnconfirmedRange = useCallback((rowId, range) => {
    patchRowByExamId(setUnconfirmedRows, rowId, { secondRange: range });
  }, []);

  const openRoomModal = useCallback((tableType, examId) => {
    setCurrentRoomRowId(examId);
    setCurrentRoomTableType(tableType);
    setIsRoomModalOpen(true);
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      const semester = openSemester.replace('학기', '');
      const res = await apiClient.get('/api/exam/search', {
        params: { year: String(openYear), semester, professorId: memberId },
      });

      const list = Array.isArray(res.data) ? res.data : [];
      const { unapplied, waiting, confirmed } = categorizeExamsByStatus(list);
      setUnappliedRows(
        unapplied.map((exam, idx) =>
          createUnappliedRow({
            exam,
            idx,
            onRangeChange: updateUnappliedRange,
            openRoomModal,
          })
        )
      );
      setUnconfirmedRows(
        waiting.map((exam, idx) =>
          createUnconfirmedRow({
            exam,
            idx,
            onRangeChange: updateUnconfirmedRange,
            openRoomModal,
          })
        )
      );
      setConfirmedRows(
        confirmed.map((exam, idx) => createConfirmedRow(exam, idx))
      );

      setSelectedUnappliedIds([]);
      setSelectedUnconfirmedIds([]);
    } catch (error) {
      console.error('2차 시험 목록 조회 실패:', error);
      setUnappliedRows([]);
      setUnconfirmedRows([]);
      setConfirmedRows([]);
      setSelectedUnappliedIds([]);
      setSelectedUnconfirmedIds([]);
    }
  }, [
    memberId,
    openSemester,
    openYear,
    openRoomModal,
    updateUnappliedRange,
    updateUnconfirmedRange,
  ]);

  const applySecondForRows = async (rows) => {
    if (!rows.length) {
      alert('신청/수정할 과목을 선택해주세요.');
      return;
    }

    try {
      for (const row of rows) {
        const range = row.secondRange;
        if (!range?.from || !range?.to) {
          alert(`${row.subjectName}의 시험 시간을 선택해주세요.`);
          return;
        }
        if (!row.examRoomId) {
          alert(`${row.subjectName}의 강의실을 선택해주세요.`);
          return;
        }

        await apiClient.post('/api/exam/apply/second', {
          examId: row.examId,
          examType: 'MID',
          startTime: range.from.toISOString(),
          endTime: range.to.toISOString(),
          examRoomId: row.examRoomId,
          isApply: true,
        });
      }

      alert('2차 시험 신청/수정이 완료되었습니다.');
      await handleSearch();
    } catch (error) {
      console.error('2차 시험 신청/수정 실패:', error);
      alert('2차 시험 신청/수정 중 오류가 발생했습니다.');
    }
  };

  const handleOpenApplyModal = () => {
    if (!selectedUnappliedIds.length) {
      alert('신청할 과목을 선택해주세요.');
      return;
    }
    const targetRows = getRowsBySelectedIds(
      selectedUnappliedIds,
      unappliedRows
    );
    if (!targetRows.length) {
      alert('신청할 과목을 선택해주세요.');
      return;
    }
    console.log('[2차 신청 대상 rows]', targetRows);
    setConfirmMode('apply');
    setIsConfirmModalOpen(true);
  };

  const handleOpenUpdateModal = () => {
    const targetRows = getRowsBySelectedIds(
      selectedUnconfirmedIds,
      unconfirmedRows
    );
    if (!targetRows.length) {
      alert('수정할 과목을 선택해주세요.');
      return;
    }
    console.log('[2차 수정 대상 rows]', targetRows);
    setConfirmMode('update');
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSecond = async () => {
    const targetRows =
      confirmMode === 'apply'
        ? getRowsBySelectedIds(selectedUnappliedIds, unappliedRows)
        : getRowsBySelectedIds(selectedUnconfirmedIds, unconfirmedRows);

    await applySecondForRows(targetRows);
    setIsConfirmModalOpen(false);
  };

  const handleSelectRoom = (rooms) => {
    const room = Array.isArray(rooms) ? rooms[0] : rooms;
    if (!room) {
      setIsRoomModalOpen(false);
      return;
    }

    const roomName = formatClassRoomLabel(room.buildingName, room.roomNo);

    const roomId = room.roomId ?? room.id ?? null;

    if (currentRoomTableType === 'unapplied') {
      patchRowByExamId(setUnappliedRows, currentRoomRowId, {
        classRoom: roomName,
        examRoomId: roomId,
      });
    } else if (currentRoomTableType === 'unconfirmed') {
      patchRowByExamId(setUnconfirmedRows, currentRoomRowId, {
        classRoom: roomName,
        examRoomId: roomId,
      });
    }

    setIsRoomModalOpen(false);
  };

  const filterItems = useMemo(
    () => [
      {
        id: 'openYear',
        label: '개설연도',
        required: true,
        labelWidth: '80px',
        contentWidth: '80px',
        content: (
          <InputCell value={String(openYear)} height={32} disabled={true} />
        ),
      },
      {
        id: 'openSemester',
        label: '개설학기',
        required: true,
        labelWidth: '80px',
        contentWidth: '80px',
        content: (
          <InputCell value={String(openSemester)} height={32} disabled={true} />
        ),
      },
      {
        id: 'department',
        label: '소속학과',
        required: true,
        labelWidth: '80px',
        contentWidth: '220px',
        content: (
          <InputCell value={departmentName} height={32} disabled={true} />
        ),
      },
      {
        id: 'professorId',
        label: '학번',
        required: true,
        labelWidth: '60px',
        contentWidth: '120px',
        content: <InputCell value={professorId} height={32} disabled={true} />,
      },
      {
        id: 'professorName',
        label: '이름',
        required: true,
        labelWidth: '60px',
        contentWidth: '80px',
        content: (
          <InputCell value={professorName} height={32} disabled={true} />
        ),
      },
    ],
    [departmentName, openSemester, openYear, professorId, professorName]
  );

  return (
    <Section>
      <div className='flex flex-col'>
        <PageHeader
          title='2차 시험 신청'
          helperText='※ 2차 시험 신청은 지정된 기간 내에만 가능하며, 기타 문의사항은 학과 사무실로 연락 바랍니다.'
          buttonsData={[
            {
              text: '조회',
              color: 'lightgray',
              Icon: SearchIcon,
              onClick: handleSearch,
            },
          ]}
        />
        <HorizontalTable items={filterItems} />
      </div>

      {/* 미신청 과목 목록 */}
      <div className='flex h-[200px] flex-col'>
        <SectionHeader
          title='미신청 과목 목록'
          subtitle={`${unappliedRows.length}건`}
          controlGroup='buttonGroup'
          buttonsData={[
            { text: '신청', color: 'red', onClick: handleOpenApplyModal },
          ]}
        />
        <VerticalTable
          columns={unconfirmedTableColumns}
          data={unappliedRows}
          headerHeight={40}
          maxHeight={240}
          selectable
          updateSelection={setSelectedUnappliedIds}
        />
      </div>

      {/* 미확정 과목 목록 */}
      <div className='flex h-[200px] flex-col'>
        <SectionHeader
          title='미확정 과목 목록'
          subtitle={`${unconfirmedRows.length}건`}
          controlGroup='buttonGroup'
          buttonsData={[
            { text: '수정', color: 'red', onClick: handleOpenUpdateModal },
          ]}
        />
        <VerticalTable
          columns={unconfirmedTableColumns}
          data={unconfirmedRows}
          headerHeight={40}
          maxHeight={240}
          selectable
          updateSelection={setSelectedUnconfirmedIds}
        />
      </div>

      {/* 확정 과목 목록 */}
      <div className='flex h-[200px] flex-col'>
        <SectionHeader
          title='확정 과목 목록'
          subtitle={`${confirmedRows.length}건`}
        />
        <VerticalTable
          columns={confirmedTableColumns}
          data={confirmedRows}
          headerHeight={40}
          maxHeight={240}
          selectable={false}
        />
      </div>

      {/* 신청/수정 확인 모달 */}
      {isConfirmModalOpen && (
        <ConfirmModal
          title='2차 시험 신청'
          body={
            confirmMode === 'apply'
              ? '선택한 과목을 2차 시험으로 신청하시겠습니까?'
              : '선택한 과목을 다시 신청하시겠습니까?'
          }
          setIsOpen={setIsConfirmModalOpen}
          onConfirm={handleConfirmSecond}
        />
      )}

      {/* 강의실 검색 모달 */}
      {isRoomModalOpen && (
        <ClassRoomModal
          setIsOpen={setIsRoomModalOpen}
          onSelect={handleSelectRoom}
        />
      )}
    </Section>
  );
}

export default SecondApplicationPage;
