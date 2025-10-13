// src/pages/SearchClassPage.jsx
import React, { useState, useMemo } from 'react';
import Layout from '@/pages/office/Layout';
import HorizontalTable from '@/components/table/HorizontalTable';
import SearchCell from '@/components/table/cells/SearchCell';
import InputCell from '@/components/table/cells/InputCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';
import VerticalTable from '../../components/table/VerticalTable';

/**
 * SearchClassPage (강의실 조회 페이지)
 * - 나중에 API 연결 시 로직만 교체할 수 있도록 구조화됨
 */
export default function SearchClassPage() {
  /* ------------------ 🧩 임시 데이터 ------------------ */
  const dummyBuildings = useMemo(
    () => [
      { buildingId: 1, buildingNumber: 401, buildingName: 'IT관' },
      { buildingId: 2, buildingNumber: 402, buildingName: '공학관' },
      { buildingId: 3, buildingNumber: 403, buildingName: '본관' },
    ],
    []
  );
  const dummyRooms = useMemo(
    () => ({
      1: [
        {
          roomId: 1,
          collage: 'IT대학',
          department: '컴퓨터학부',
          buildingName: 'IT관',
          buildingNumber: 401,
          roomNumber: '101',
          roomCapacity: 60,
        },
        {
          roomId: 2,
          collage: 'IT대학',
          department: '컴퓨터학부',
          buildingName: 'IT관',
          buildingNumber: 401,
          roomNumber: '102',
          roomCapacity: 100,
        },
      ],
      2: [
        {
          roomId: 3,
          collage: '공과대학',
          department: '기계공학과',
          buildingName: '공학관',
          buildingNumber: 402,
          roomNumber: '201',
          roomCapacity: 80,
        },
        {
          roomId: 4,
          collage: '공과대학',
          department: '화학공학과',
          buildingName: '공학관',
          buildingNumber: 402,
          roomNumber: '202',
          roomCapacity: 60,
        },
      ],
      3: [
        {
          roomId: 5,
          collage: '인문대학',
          department: '국어국문학과',
          buildingName: '본관',
          buildingNumber: 403,
          roomNumber: '301',
          roomCapacity: 120,
        },
      ],
    }),
    []
  );

  // 🔹 컬럼 정의만 따로 분리
  const columns = [
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
  ];

  /* ------------------ 🧩 State ------------------ */
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [rooms, setRooms] = useState(dummyRooms[1]);

  /* ------------------ ⚙️ Handlers ------------------ */
  // 건물 선택 핸들러
  const handleBuildingChange = (e) => {
    const buildingId = e.target.value;
    setSelectedBuilding(buildingId);

    // ✅ 나중에 여기서 API 연결 (예: GET /api/building/{buildingId})
    const data = dummyRooms[buildingId] || [];
    setRooms(data);
  };

  // 검색 핸들러
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);

    // ✅ 나중에 API 연결 예정 (예: POST /api/building/search)
    console.log('검색 요청:', keyword);

    // 현재는 더미 필터
    const filtered = dummyBuildings.filter(
      (b) =>
        b.buildingName.includes(keyword) ||
        String(b.buildingNumber).includes(keyword)
    );
    console.log('검색 결과:', filtered);
  };

  /* ------------------ 🎨 UI 구성요소 ------------------ */
  // HorizontalTable 항목 정의
  const searchFormItems = [
    {
      id: 'classroom-search',
      label: '건물코드/명',
      labelWidth: '130px',
      content: (
        <div className='flex items-center gap-1'>
          {/* Input은 고정 폭 */}
          <div className='w-[200px]'>
            <InputCell
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              height={32}
            />
          </div>
          {/* 버튼도 고정 폭 */}
          <div className='w-[70px]'>
            <Button text='조회' Icon={SearchIcon} color='lightgray' />
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
        {
          title: '강의실',
          subItems: [
            { label: '강의실 목록', path: '/classrooms', isSelected: true },
          ],
        },
      ]}
    >
      <h1 className='mb-5 text-2xl font-bold text-[var(--color-text-main)]'>
        강의실 목록
      </h1>

      {/* 🔍 검색 영역 */}
      <div className='h-[764px] w-[1100px] bg-white'>
        <div className='w-full' style={{ tableLayout: 'fixed' }}>
          <HorizontalTable items={searchFormItems} />
        </div>
        <div className='mt-[10px] w-full bg-white'>
          <VerticalTable
            columns={columns} // ✅ 선언된 컬럼 전달
            data={rooms} // ✅ rooms 상태 전달
            selectable={true}
            headerHeight={32}
            maxHeight={600}
          />
        </div>
      </div>
    </Layout>
  );
}
