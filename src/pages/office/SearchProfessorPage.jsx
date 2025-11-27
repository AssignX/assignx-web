// src/pages/SearchProfessorPage.jsx
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import HorizontalTable from '@/components/table/HorizontalTable';
import InputCell from '@/components/table/cells/InputCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';
import PageHeader from '@/components/headers/PageHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import TableWrapper from '@/components/layout/TableWrapper';

export default function SearchProfessorPage() {
  const [professors, setProfessors] = useState([]);
  const [name, setName] = useState('');
  const {
    name: userNameFromStore,
    departmentName,
    departmentId,
  } = useAuthStore();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const [allProfessors, setAllProfessors] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.warn('서버 로그아웃 실패 (클라이언트만 처리)');
      console.error(err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const columns = [
    {
      accessorKey: 'no',
      header: 'No',
      size: 50,
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: 'name', header: '교수명', size: 200 },
    { accessorKey: 'departmentName', header: '소속 학과', size: 400 },
  ];

  useEffect(() => {
    const fetchProfessors = async () => {
      if (!departmentId) return;

      try {
        const { data } = await apiClient.get('/api/member/search/professor', {
          params: { departmentId },
        });
        setProfessors(data); // 화면에 보여줄 목록
        setAllProfessors(data); // 전체 목록 저장
      } catch (err) {
        console.error('교수 목록 불러오기 실패:', err);
      }
    };

    fetchProfessors();
  }, [departmentId]);

  const handleSearch = async () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setProfessors(allProfessors); // 전체 교수 목록 다시 표시
      return;
    }

    try {
      // 이미 fetchProfessors()에서 전체 목록을 로드했다고 가정
      const filtered = allProfessors.filter((p) =>
        p.name.toLowerCase().includes(trimmed.toLowerCase())
      );

      setProfessors(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const searchFormItems = [
    {
      id: 'professor-search',
      label: '교수명',
      labelWidth: '130px',
      content: (
        <div className='flex items-center gap-1'>
          <div className='w-[200px]'>
            <InputCell
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              height={32}
            />
          </div>
          <div className='w-[70px]'>
            <Button
              text='조회'
              Icon={SearchIcon}
              color='lightgray'
              onClick={handleSearch}
            />
          </div>
        </div>
      ),
    },
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
          isOpen: true,
          subItems: [
            {
              label: '교수 목록',
              path: '/office/professors',
              isSelected: true,
            },
          ],
        },
        {
          title: '강의실',
          subItems: [{ label: '강의실 목록', path: '/office/classrooms' }],
        },
        {
          title: '시험',
          isOpen: true,
          subItems: [{ label: '시험 일정', path: '/office/exam' }],
        },
      ]}
    >
      <PageHeader title='교수 목록' />

      <div className='h-full w-full space-y-[10px]'>
        <HorizontalTable items={searchFormItems} />
        <TableWrapper height='470px'>
          <VerticalTable
            columns={columns}
            data={professors}
            selectable={false}
            headerHeight={32}
            maxHeight={470}
          />
        </TableWrapper>
      </div>
    </Layout>
  );
}
