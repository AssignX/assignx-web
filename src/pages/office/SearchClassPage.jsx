// src/pages/SearchClassPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/pages/office/Layout';
import HorizontalTable from '@/components/table/HorizontalTable';
import InputCell from '@/components/table/cells/InputCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';
import PageHeader from '@/components/headers/PageHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

/**
 * SearchClassPage (강의실 조회 페이지)
 * - 로그인한 유저의 departmentId 기반으로 강의실 목록 조회
 */
export default function SearchClassPage() {
  /* ------------------ 🧩 State ------------------ */
  const [rooms, setRooms] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { name, departmentName, departmentId } = useAuthStore();
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

  /* ------------------ ⚙️ Columns ------------------ */
  const columns = useMemo(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        size: 50,
        cell: ({ row }) => row.index + 1,
      },
      { accessorKey: 'buildingName', header: '건물명', size: 300 },
      { accessorKey: 'buildingNumber', header: '건물번호', size: 100 },
      { accessorKey: 'roomNumber', header: '호실번호', size: 100 },
      { accessorKey: 'roomCapacity', header: '수용인원', size: 100 },
    ],
    []
  );

  /* ------------------ 📡 API 호출 ------------------ */
  //onsole.log('[DEBUG] user.departmentId:', departmentId);
  useEffect(() => {
    const fetchRooms = async () => {
      if (!departmentId) return; // 로그인 전에는 실행하지 않음
      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/building/department', {
          params: { departmentId },
        });
        //console.log('[DEBUG] fetched rooms:', data);
        setRooms(data);
        setFilteredRooms(data);
      } catch (err) {
        console.error('강의실 불러오기 실패:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [departmentId]);

  /* ------------------ 🔍 검색 기능 ------------------ */
  const handleSearch = () => {
    const keyword = searchKeyword.trim();
    if (!keyword) {
      setFilteredRooms(rooms);
      return;
    }

    const lower = keyword.toLowerCase();
    const result = rooms.filter(
      (r) =>
        r.buildingName.toLowerCase().includes(lower) ||
        String(r.buildingNumber).includes(keyword) ||
        r.roomNumber.includes(keyword)
    );
    setFilteredRooms(result);
  };

  /* ------------------ 🎨 검색 폼 ------------------ */
  const searchFormItems = [
    {
      id: 'classroom-search',
      label: '건물코드/명',
      labelWidth: '130px',
      content: (
        <div className='flex items-center gap-1'>
          <div className='w-[200px]'>
            <InputCell
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

  /* ------------------ 🧱 Render ------------------ */
  return (
    <Layout
      username={`${name ?? '사용자'} 님`}
      headerTitle={`${departmentName ?? ''} 메뉴`}
      onLogout={handleLogout}
      menus={[
        { title: '과목', subItems: [{ label: '과목 목록', path: '/classes' }] },
        {
          title: '교수',
          subItems: [{ label: '교수 목록', path: '/professors' }],
        },
        {
          title: '강의실',
          isOpen: true,
          subItems: [
            { label: '강의실 목록', path: '/classrooms', isSelected: true },
          ],
        },
        {
          title: '일정',
          subItems: [
            { label: '확정 목록', path: '/confirmed' },
            { label: '미확정 목록', path: '/unconfirmed' },
          ],
        },
      ]}
    >
      <PageHeader title='강의실 목록' />
      <div className='h-[764px] w-full bg-white pt-[20px]'>
        <HorizontalTable items={searchFormItems} />
        {loading && <p className='mt-3 text-gray-500'>불러오는 중...</p>}
        {error && <p className='mt-3 text-red-500'>데이터 불러오기 실패</p>}
        {!loading && !error && (
          <div className='mt-[10px] w-full bg-white'>
            <VerticalTable
              columns={columns}
              data={filteredRooms}
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
