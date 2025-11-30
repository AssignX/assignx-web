import Layout from '@/components/Layout';
import TableWrapper from '@/components/layout/TableWrapper';
import PageHeader from '@/components/headers/PageHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import YearPickerCell from '@/components/table/cells/YearPickerCell';
import DropdownCell from '@/components/table/cells/DropdownCell';

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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const updateFilters = (rowId, columnKey, value) => {
    handleFilterChange(columnKey, value);
  };

  const [midFirstStartDateTime, setMidFirstStartDateTime] = useState('');
  const [midFirstEndDateTime, setMidFirstEndDateTime] = useState('');
  const [midSecondStartDateTime, setMidSecondStartDateTime] = useState('');
  const [midSecondEndDateTime, setMidSecondEndDateTime] = useState('');
  const [finalFirstStartDateTime, setFinalFirstStartDateTime] = useState('');
  const [finalFirstEndDateTime, setFinalFirstEndDateTime] = useState('');
  const [finalSecondStartDateTime, setFinalSecondStartDateTime] = useState('');
  const [finalSecondEndDateTime, setFinalSecondEndDateTime] = useState('');

  useEffect(() => {
    setMidFirstStartDateTime('');
    setMidFirstEndDateTime('');
    setMidSecondStartDateTime('');
    setMidSecondEndDateTime('');
    setFinalFirstStartDateTime('');
    setFinalFirstEndDateTime('');
    setFinalSecondStartDateTime('');
    setFinalSecondEndDateTime('');
  }, [filters.year, filters.semester]);

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

  const fetchExamPeriod = async () => {
    try {
      //   const payload = { year: year, semester: semester };
      //   const res = await apiClient.get('/api/exam-period', payload);
      //   console.log('Exam Period Data:', res.data);
    } catch (err) {
      console.error('Failed to fetch exam period', err);
      alert('시험 기간 정보를 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchExamPeriod();
  }, []);

  const handleOpenSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      if (!filters.year || !filters.semester) {
        alert('연도와 학기를 모두 선택해주세요.');
        return;
      }
      const payload = {
        year: filters.year,
        semester: filters.semester,
        midFirstStartDateTime: midFirstStartDateTime,
        midFirstEndDateTime: midFirstEndDateTime,
        midSecondStartDateTime: midSecondStartDateTime,
        midSecondEndDateTime: midSecondEndDateTime,
        finalFirstStartDateTime: finalFirstStartDateTime,
        finalFirstEndDateTime: finalFirstEndDateTime,
        finalSecondStartDateTime: finalSecondStartDateTime,
        finalSecondEndDateTime: finalSecondEndDateTime,
      };

      await apiClient.post('/api/exam-period', payload);
      setIsSaveModalOpen(false);
      fetchExamPeriod();
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
          columns={[]}
          data={[]}
          headerHeight={40}
          selectable={false}
        />
      </TableWrapper>

      {isSaveModalOpen && (
        <ConfirmModal
          title='저장 확인'
          message='변경사항을 저장하시겠습니까?'
          setIsOpen={setIsSaveModalOpen}
          onConfirm={handleConfirmSave}
        />
      )}
    </Layout>
  );
}

export default ExamPeriodPage;
