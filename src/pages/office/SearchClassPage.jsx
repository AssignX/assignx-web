// src/pages/SearchClassPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/pages/office/Layout';
import HorizontalTable from '@/components/table/HorizontalTable';
import InputCell from '@/components/table/cells/InputCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';

/**
 * SearchClassPage (강의실 조회 페이지)
 * - 기존 구조 유지, 더미 대신 API 연결
 */
export default function SearchClassPage() {
  /* ------------------ 🧩 State ------------------ */
  const [rooms, setRooms] = useState([]); // API로 불러온 전체 강의실
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]); // 검색 결과 표시용
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ------------------ ⚙️ Columns ------------------ */
  const columns = useMemo(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        size: 50,
        cell: ({ row }) => row.index + 1,
      },
      { accessorKey: 'collage', header: '단과대학', size: 110 },
      { accessorKey: 'department', header: '학과', size: 110 },
      { accessorKey: 'buildingName', header: '건물명', size: 500 },
      { accessorKey: 'buildingNumber', header: '건물번호', size: 77 },
      { accessorKey: 'roomNumber', header: '호실번호', size: 77 },
      { accessorKey: 'roomCapacity', header: '수용인원', size: 77 },
    ],
    []
  );

  /* ------------------ 📡 API 호출 ------------------ */
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        // 1️⃣ 건물 목록 조회
        const { data: buildings } = await apiClient.get('/api/building');

        // 2️⃣ 각 건물 상세 조회 (병렬)
        const detailResponses = await Promise.all(
          buildings.map((b) => apiClient.get(`/api/building/${b.buildingId}`))
        );

        // 3️⃣ 데이터 병합
        const merged = detailResponses.flatMap((res) =>
          res.data.rooms.map((room) => ({
            collage: 'IT대학', // 우선 더미
            department: '컴퓨터학부', // 우선 더미
            buildingName: res.data.buildingName,
            buildingNumber: res.data.buildingNumber,
            roomNumber: room.roomNumber,
            roomCapacity: room.roomCapacity,
          }))
        );

        setRooms(merged);
        setFilteredRooms(merged);
      } catch (err) {
        console.error('강의실 불러오기 실패:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

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
        r.collage.toLowerCase().includes(lower) ||
        r.department.toLowerCase().includes(lower) ||
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
      username='사무실 님'
      headerTitle='사무실 메뉴'
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
      <h1 className='mb-5 text-2xl font-bold text-[var(--color-text-main)]'>
        강의실 목록
      </h1>

      <div className='h-[764px] w-[1100px] bg-white'>
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
