import Layout from '@/components/Layout';
import TableWrapper from '@/components/layout/TableWrapper';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import ConfirmModal from '@/components/ConfirmModal.jsx';

import InputCell from '@/components/table/cells/InputCell';
import DropdownCell from '@/components/table/cells/DropdownCell';
import { SearchIcon } from '@/assets/icons';

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/api/apiClient';
import { useState, useMemo, useEffect } from 'react';

import {
  buildApplicationOptions,
  parseApplicationTimeToISO,
  formatExamDateTimeRange,
  getFirstExamTypeForNow,
} from './parsingTime';

const unconfirmedTableColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 40,
    cell: ({ row }) => row.index + 1,
  },
  { header: '과목명', accessorKey: 'courseName', size: 140 },
  { header: '과목코드', accessorKey: 'courseCode', size: 100 },
  { header: '분반', accessorKey: 'courseSection', size: 60 },
  { header: '강의시간', accessorKey: 'courseTime', size: 200 },
  { header: '수강인원', accessorKey: 'enrolledCount', size: 60 },
  {
    header: '신청시간',
    accessorKey: 'applicationTime',
    size: 260,
    cell: (info) => {
      const row = info.row.original;
      return (
        <DropdownCell
          initialValue={row.applicationTime ?? ''}
          options={row.applicationOptions ?? []}
          rowId={String(row.examId)}
          columnKey='applicationTime'
          updateData={row.updateApplicationTime}
        />
      );
    },
  },
  { header: '강의실', accessorKey: 'classRoom', size: 140 },
];

const confirmedTableColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 40,
    cell: ({ row }) => row.index + 1,
  },
  { header: '과목명', accessorKey: 'courseName', size: 140 },
  { header: '과목코드', accessorKey: 'courseCode', size: 100 },
  { header: '분반', accessorKey: 'courseSection', size: 60 },
  { header: '강의시간', accessorKey: 'courseTime', size: 200 },
  { header: '확정 시간', accessorKey: 'examTimeRange', size: 280 },
  { header: '강의실', accessorKey: 'classRoom', size: 120 },
  { header: '수강인원', accessorKey: 'enrolledCount', size: 60 },
  { header: '확정여부', accessorKey: 'confirmationStatus', size: 80 },
];

function FirstApplicationPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { name: userNameFromStore } = useAuthStore();

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

  const [openYear] = useState(2025);
  const [openSemester] = useState('2학기');

  const departmentName = useAuthStore((s) => s.departmentName);
  const professorName = useAuthStore((s) => s.name);
  const professorId = useAuthStore((s) => String(s.idNumber));
  const memberId = useAuthStore((s) => s.memberId);

  const [unconfirmedRows, setUnconfirmedRows] = useState([]);
  const [confirmedRows, setConfirmedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [examPeriod, setExamPeriod] = useState(null);

  const convertAssignedStatus = (status) =>
    status === 'COMPLETED_FIRST' || status === 'COMPLETED_SECOND'
      ? 'Y'
      : status === 'WAITING_HIGH_PRIORITY' || status === 'WAITING_LOW_PRIORITY'
        ? '대기(2차)'
        : 'N';

  const handleSearch = async () => {
    try {
      const semester = openSemester.replace('학기', '');

      const periodRes = await apiClient.get('/api/exam-period', {
        params: { year: openYear, semester },
      });

      if (!periodRes.data) {
        alert('시험 신청 기간이 설정되지 않았습니다.');
        return;
      }
      setExamPeriod(periodRes.data);

      const courseRes = await apiClient.get('/api/course/search', {
        params: { year: openYear, semester, professorId: memberId },
      });
      const courseList = Array.isArray(courseRes.data) ? courseRes.data : [];

      const courseById = new Map();
      const courseByCode = new Map();
      courseList.forEach((c) => {
        if (c.courseId !== null && c.courseId !== undefined) {
          courseById.set(String(c.courseId), c);
        }
        if (c.courseCode) {
          courseByCode.set(c.courseCode, c);
        }
      });

      const examRes = await apiClient.get('/api/exam/search', {
        params: { year: openYear, semester, professorId: memberId },
      });
      if (!examRes.data || examRes.data.length === 0) {
        alert('조회할 과목이 없습니다.');
        setUnconfirmedRows([]);
        setConfirmedRows([]);
        return;
      }

      const list = Array.isArray(examRes.data) ? examRes.data : [];
      const enrichedList = list.map((exam) => {
        const course =
          courseById.get(String(exam.courseId)) ||
          courseByCode.get(exam.courseCode);

        const buildingName = exam.buildingName || course?.buildingName || '';
        const roomNumber = exam.roomNumber || course?.roomNumber || '';
        const enrolledCount = exam.enrolledCount ?? course?.enrolledCount ?? 0;
        const courseTime = exam.courseTime || course?.courseTime || '';

        return { ...exam, buildingName, roomNumber, enrolledCount, courseTime };
      });

      const unconfirmed = enrichedList.filter(
        (e) => e.examAssigned === 'NOT_YET'
      );
      const confirmed = enrichedList.filter(
        (e) => e.examAssigned !== 'NOT_YET'
      );

      const mappedUnconfirmed = unconfirmed.map((exam) => {
        const [code, section] = exam.courseCode?.split('-') ?? ['', ''];
        const applicationOptions = buildApplicationOptions(
          exam.courseTime,
          periodRes.data
        );

        return {
          id: String(exam.examId),
          examId: exam.examId,
          courseName: exam.courseName,
          courseCode: code,
          courseSection: section,
          courseTime: exam.courseTime,
          studentCount: exam.enrolledCount,
          enrolledCount: exam.enrolledCount,
          classRoom:
            `${exam.buildingName ?? ''} ${exam.roomNumber ?? ''}`.trim() || '-',
          applicationOptions,
          applicationTime: applicationOptions[0]?.value ?? '',
          updateApplicationTime: (rowId, _columnKey, newValue) => {
            setUnconfirmedRows((prev) =>
              prev.map((r) =>
                String(r.examId) === String(rowId)
                  ? { ...r, applicationTime: newValue }
                  : r
              )
            );
          },
        };
      });

      const mappedConfirmed = confirmed.map((exam) => {
        const [code, section] = exam.courseCode?.split('-') ?? ['', ''];

        return {
          id: String(exam.examId),
          examId: exam.examId,
          courseName: exam.courseName,
          courseCode: code,
          courseSection: section,
          courseTime: exam.courseTime,
          enrolledCount: exam.enrolledCount,
          classRoom:
            `${exam.buildingName ?? ''} ${exam.roomNumber ?? ''}`.trim() || '-',
          examTimeRange: formatExamDateTimeRange(exam.startTime, exam.endTime),
          confirmationStatus: convertAssignedStatus(exam.examAssigned),
        };
      });

      setUnconfirmedRows(mappedUnconfirmed);
      setConfirmedRows(mappedConfirmed);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyFirstClick = () => {
    const selectedArray = Array.isArray(selectedIds)
      ? selectedIds
      : selectedIds
        ? [selectedIds]
        : [];

    if (!selectedArray.length) {
      alert('신청할 과목을 선택해주세요.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmApplyFirst = async () => {
    if (!examPeriod) {
      alert('시험 신청 기간 정보가 없습니다. 먼저 조회 버튼을 눌러주세요.');
      return;
    }

    const examType = getFirstExamTypeForNow(examPeriod);
    if (!examType) {
      alert('지금은 1차 시험 신청 기간이 아닙니다.');
      return;
    }

    const selectedArray = Array.isArray(selectedIds)
      ? selectedIds
      : selectedIds
        ? [selectedIds]
        : [];

    if (!selectedArray.length) {
      alert('신청할 과목을 선택해주세요.');
      return;
    }

    try {
      for (const id of selectedArray) {
        const row = unconfirmedRows.find(
          (r) => String(r.examId) === String(id)
        );
        console.log('applying for row', row);
        if (!row) continue;
        const { startTime, endTime } = parseApplicationTimeToISO(
          row.applicationTime
        );
        if (!startTime) continue;

        await apiClient.post('/api/exam/apply/first', {
          examId: row.examId,
          examType,
          startTime,
          endTime,
          isApply: true,
        });
      }
      alert('신청이 완료되었습니다.');
      setIsModalOpen(false);
      await handleSearch();
    } catch (err) {
      alert('신청 중 오류 발생');
      console.error(err);
    }
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
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle='교수 메뉴'
      onLogout={handleLogout}
      menus={[
        {
          title: '강의 조회',
          subItems: [{ label: '시간표 조회', path: '/professor/schedule' }],
        },
        {
          title: '시험 신청',
          subItems: [
            {
              label: '1차 시험 신청',
              path: '/professor/first',
              isSelected: true,
            },
            { label: '2차 시험 신청', path: '/professor/second' },
            { label: '신청 현황 조회', path: '/professor/status' },
          ],
        },
      ]}
    >
      <div className='flex flex-col'>
        <PageHeader
          title='1차 시험 신청'
          helperText='※ 1차 시험 신청은 지정된 기간 내에만 가능하며, 확정된 과목에 대해 취소하시려면 학과 사무실로 문의해주십시오.'
          buttonsData={[
            {
              text: '조회',
              Icon: SearchIcon,
              color: 'lightgray',
              onClick: handleSearch,
            },
          ]}
        />
        <HorizontalTable items={filterItems} />
      </div>

      <div className='flex flex-col'>
        <SectionHeader
          title='미확정 과목 목록'
          subtitle={`${unconfirmedRows.length}건`}
          controlGroup='buttonGroup'
          buttonsData={[
            { text: '신청', color: 'red', onClick: handleApplyFirstClick },
          ]}
        />
        <TableWrapper height='220px'>
          <VerticalTable
            columns={unconfirmedTableColumns}
            data={unconfirmedRows}
            selectable={true}
            singleSelect={true}
            updateSelection={setSelectedIds}
          />
        </TableWrapper>
      </div>

      <div className='flex flex-col'>
        <SectionHeader
          title='확정 과목 목록'
          subtitle={`${confirmedRows.length}건`}
        />
        <TableWrapper height='320px'>
          <VerticalTable
            columns={confirmedTableColumns}
            data={confirmedRows}
            selectable={false}
          />
        </TableWrapper>
      </div>

      {isModalOpen && (
        <ConfirmModal
          setIsOpen={setIsModalOpen}
          onConfirm={handleConfirmApplyFirst}
          title='1차 신청'
          body='선택한 과목을 신청하시겠습니까?'
        />
      )}
    </Layout>
  );
}

export default FirstApplicationPage;
