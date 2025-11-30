import Layout from '@/components/Layout';
import TableWrapper from '@/components/layout/TableWrapper';
import PageHeader from '@/components/headers/PageHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import YearPickerCell from '@/components/table/cells/YearPickerCell';
import DropdownCell from '@/components/table/cells/DropdownCell';
import InputCell from '@/components/table/cells/InputCell';

import { SaveIcon, SearchIcon } from '@/assets/icons';

import ConfirmModal from '@/components/ConfirmModal';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/api/apiClient';

const semesterOptions = [
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
];

const formatDisplayDate = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    `${d.getFullYear()}/` +
    `${pad(d.getMonth() + 1)}/` +
    `${pad(d.getDate())} ` +
    `${pad(d.getHours())}:` +
    `${pad(d.getMinutes())}:` +
    `${pad(d.getSeconds())}`
  );
};

const formatToISO = (displayStr) => {
  if (!displayStr) return null;

  const regex = /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = displayStr.match(regex);
  if (!match) return null;
  const [_, y, m, d, hh, mm, ss] = match;
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}.000`;
};

const isValidDisplayDate = (displayStr) => {
  if (!displayStr) return false;
  const regex = /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = displayStr.match(regex);
  if (!match) return false;
  const [_, yStr, mStr, dStr, hhStr, mmStr, ssStr] = match;
  const y = Number(yStr);
  const m = Number(mStr);
  const d = Number(dStr);
  const hh = Number(hhStr);
  const mm = Number(mmStr);
  const ss = Number(ssStr);

  const date = new Date(`${yStr}-${mStr}-${dStr}T${hhStr}:${mmStr}:${ssStr}`);
  if (isNaN(date.getTime())) return false;

  if (
    date.getFullYear() !== y ||
    date.getMonth() + 1 !== m ||
    date.getDate() !== d ||
    date.getHours() !== hh ||
    date.getMinutes() !== mm ||
    date.getSeconds() !== ss
  ) {
    return false;
  }

  return true;
};

function ExamPeriodPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { name: userNameFromStore } = useAuthStore();

  useEffect(() => {
    if (!accessToken) navigate('/login');
  }, [accessToken, navigate]);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.warn('logout failed', err);
    }
    logout();
    navigate('/login');
  };

  const getDefaultSemester = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 6) return '1';
    if (month >= 9) return '2';
    return '1';
  };

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    semester: getDefaultSemester(),
  });

  const [periodData, setPeriodData] = useState([]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateFilters = (rowId, columnKey, value) => {
    handleFilterChange(columnKey, value);
  };

  const updatePeriodData = (rowId, columnKey, value) => {
    setPeriodData((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [columnKey]: value } : row
      )
    );
  };

  useEffect(() => {
    setPeriodData([]);
  }, [filters.year, filters.semester]);

  const periodColumn = [
    {
      header: 'No',
      accessorKey: 'number',
      size: 50,
      cell: ({ row }) => row.index + 1,
    },
    { header: '구분', accessorKey: 'type', size: 150 },
    { header: '차수', accessorKey: 'sequence', size: 100 },
    {
      header: '시작 일시',
      accessorKey: 'startDateTime',
      size: 200,
      cell: ({ row }) => (
        <InputCell
          value={row.original.startDateTime || ''}
          onChange={(e) =>
            updatePeriodData(row.original.id, 'startDateTime', e.target.value)
          }
          height={26}
        />
      ),
    },
    {
      header: '종료 일시',
      accessorKey: 'endDateTime',
      size: 200,
      cell: ({ row }) => (
        <InputCell
          value={row.original.endDateTime || ''}
          onChange={(e) =>
            updatePeriodData(row.original.id, 'endDateTime', e.target.value)
          }
          height={26}
        />
      ),
    },
  ];

  const filterItems = [
    {
      id: 'year',
      label: '개설연도',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <YearPickerCell
          rowId='filters'
          columnKey='year'
          initialValue={Number(filters.year)}
          updateData={updateFilters}
        />
      ),
    },
    {
      id: 'semester',
      label: '개설학기',
      labelWidth: '130px',
      contentWidth: '150px',
      content: (
        <DropdownCell
          initialValue={filters.semester}
          options={semesterOptions}
          rowId='filters'
          columnKey='semester'
          updateData={updateFilters}
          height={32}
        />
      ),
    },
  ];

  const createEmptyRows = () => [
    {
      id: 'mid_first',
      type: '중간고사',
      sequence: '1차',
      startDateTime: '',
      endDateTime: '',
    },
    {
      id: 'mid_second',
      type: '중간고사',
      sequence: '2차',
      startDateTime: '',
      endDateTime: '',
    },
    {
      id: 'final_first',
      type: '기말고사',
      sequence: '1차',
      startDateTime: '',
      endDateTime: '',
    },
    {
      id: 'final_second',
      type: '기말고사',
      sequence: '2차',
      startDateTime: '',
      endDateTime: '',
    },
  ];

  const fetchExamPeriod = async () => {
    try {
      const res = await apiClient.get('/api/exam-period', {
        params: { year: filters.year, semester: filters.semester },
      });
      const data = res.data;
      if (!data) {
        setPeriodData(createEmptyRows());
        return;
      }
      const rows = [
        {
          id: 'mid_first',
          type: '중간고사',
          sequence: '1차',
          startDateTime: formatDisplayDate(data.midFirstStartDateTime),
          endDateTime: formatDisplayDate(data.midFirstEndDateTime),
        },
        {
          id: 'mid_second',
          type: '중간고사',
          sequence: '2차',
          startDateTime: formatDisplayDate(data.midSecondStartDateTime),
          endDateTime: formatDisplayDate(data.midSecondEndDateTime),
        },
        {
          id: 'final_first',
          type: '기말고사',
          sequence: '1차',
          startDateTime: formatDisplayDate(data.finalFirstStartDateTime),
          endDateTime: formatDisplayDate(data.finalFirstEndDateTime),
        },
        {
          id: 'final_second',
          type: '기말고사',
          sequence: '2차',
          startDateTime: formatDisplayDate(data.finalSecondStartDateTime),
          endDateTime: formatDisplayDate(data.finalSecondEndDateTime),
        },
      ];

      setPeriodData(rows);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setPeriodData(createEmptyRows());
        alert('시험 기간이 존재하지 않습니다. 시험 기간을 작성해주세요.');
      } else {
        console.error('Failed to fetch exam period', err);
        alert('시험 기간 정보를 불러오는데 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    fetchExamPeriod();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      if (!filters.year || !filters.semester) {
        alert('연도와 학기를 모두 선택해주세요.');
        return;
      }

      const ids = ['mid_first', 'mid_second', 'final_first', 'final_second'];
      const labels = {
        mid_first: { type: '중간고사', seq: '1차' },
        mid_second: { type: '중간고사', seq: '2차' },
        final_first: { type: '기말고사', seq: '1차' },
        final_second: { type: '기말고사', seq: '2차' },
      };

      for (const id of ids) {
        const row = periodData.find((r) => r.id === id);
        if (!row) {
          alert('모든 시험 일정 값을 입력해주세요.');
          return;
        }

        const { startDateTime, endDateTime } = row;

        if (!startDateTime || !endDateTime) {
          alert(
            `${labels[id].type} ${labels[id].seq}의 시작/종료 시간을 모두 입력해주세요.`
          );
          return;
        }

        if (!isValidDisplayDate(startDateTime)) {
          alert(
            `${labels[id].type} ${labels[id].seq} 시작 일시의 형식이 올바르지 않습니다. (예: 2025/11/24 02:08:00)`
          );
          return;
        }

        if (!isValidDisplayDate(endDateTime)) {
          alert(
            `${labels[id].type} ${labels[id].seq} 종료 일시의 형식이 올바르지 않습니다. (예: 2025/11/24 02:08:00)`
          );
          return;
        }
      }

      const findRow = (id) => periodData.find((row) => row.id === id) || {};
      const payload = {
        year: filters.year,
        semester: filters.semester,
        midFirstStartDateTime: formatToISO(findRow('mid_first').startDateTime),
        midFirstEndDateTime: formatToISO(findRow('mid_first').endDateTime),
        midSecondStartDateTime: formatToISO(
          findRow('mid_second').startDateTime
        ),
        midSecondEndDateTime: formatToISO(findRow('mid_second').endDateTime),
        finalFirstStartDateTime: formatToISO(
          findRow('final_first').startDateTime
        ),
        finalFirstEndDateTime: formatToISO(findRow('final_first').endDateTime),
        finalSecondStartDateTime: formatToISO(
          findRow('final_second').startDateTime
        ),
        finalSecondEndDateTime: formatToISO(
          findRow('final_second').endDateTime
        ),
      };

      await apiClient.post('/api/exam-period', payload);
      setIsSaveModalOpen(false);
      fetchExamPeriod();

      alert('시험 기간이 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error('Failed to save exam period', err);
    }
  };

  return (
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle='관리자 메뉴'
      onLogout={handleLogout}
      menus={[
        {
          title: '학과 관리',
          subItems: [{ label: '학과 목록', path: '/admin/department' }],
        },
        {
          title: '건물 관리',
          subItems: [{ label: '건물 목록', path: '/admin/building' }],
        },
        {
          title: '일정 관리',
          subItems: [
            { label: '일정 수정', path: '/admin/period', isSelected: true },
          ],
        },
      ]}
    >
      <div className='flex flex-col'>
        <PageHeader
          title='일정 수정'
          buttonsData={[
            {
              text: '조회',
              color: 'whitegray',
              Icon: SearchIcon,
              onClick: fetchExamPeriod,
            },
            {
              text: '저장',
              color: 'gold',
              Icon: SaveIcon,
              onClick: handleOpenSaveModal,
            },
          ]}
        />
        <HorizontalTable items={filterItems} />
      </div>

      <TableWrapper height='400px'>
        <VerticalTable
          columns={periodColumn}
          data={periodData}
          headerHeight={40}
          selectable={false}
        />
      </TableWrapper>

      {isSaveModalOpen && (
        <ConfirmModal
          title='저장 확인'
          body='변경사항을 저장하시겠습니까?'
          setIsOpen={setIsSaveModalOpen}
          onConfirm={handleConfirmSave}
        />
      )}
    </Layout>
  );
}

export default ExamPeriodPage;
