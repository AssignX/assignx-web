// src/pages/SearchProfessorPage.jsx
import React, { useState, useEffect } from 'react';
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

export default function SearchProfessorPage() {
  const [professors, setProfessors] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    name: userNameFromStore,
    departmentName,
    departmentId,
  } = useAuthStore();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

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

      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/member/search/professor', {
          params: { departmentId },
        });
        setProfessors(data);
      } catch (err) {
        console.error('교수 목록 불러오기 실패:', err);
        setError('조회 중 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, [departmentId]);

  const handleSearch = async () => {
    const trimmed = name.trim();
    if (!trimmed && !departmentId) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get('/api/member/search/professor', {
        params: {
          name: trimmed || undefined,
          departmentId: departmentId || undefined,
        },
      });
      setProfessors(data);
    } catch (err) {
      console.error('교수 조회 실패:', err);
      setError('조회 중 오류 발생');
    } finally {
      setLoading(false);
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
          subItems: [{ label: '과목 목록', path: '/office/subjects' }],
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

      <div className='h-[764px] w-full'>
        <HorizontalTable items={searchFormItems} />

        {loading && <p className='mt-3 text-gray-500'>불러오는 중...</p>}
        {error && <p className='mt-3 text-red-500'>{error}</p>}

        {!loading && !error && professors.length > 0 && (
          <div className='mt-[10px] w-full bg-white'>
            <VerticalTable
              columns={columns}
              data={professors}
              selectable={false}
              headerHeight={32}
              maxHeight={600}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
