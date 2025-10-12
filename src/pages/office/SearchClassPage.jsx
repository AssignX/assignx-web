// src/pages/ClassroomPage.jsx
import React, { useState } from 'react';
import Layout from '@/pages/office/Layout';
import PageHeader from '@/components/headers/PageHeader';

export default function ClassroomPage() {
  // 🧩 임시 건물 목록
  const dummyBuildings = [
    { buildingId: 1, buildingNumber: 401, buildingName: 'IT관' },
    { buildingId: 2, buildingNumber: 402, buildingName: '공학관' },
    { buildingId: 3, buildingNumber: 403, buildingName: '본관' },
  ];

  // 🧩 임시 강의실 목록
  const dummyRooms = {
    1: [
      {
        roomId: 1,
        buildingName: 'IT관',
        buildingNumber: 401,
        roomNumber: '101',
        roomCapacity: 60,
      },
      {
        roomId: 2,
        buildingName: 'IT관',
        buildingNumber: 401,
        roomNumber: '102',
        roomCapacity: 100,
      },
    ],
    2: [
      {
        roomId: 3,
        buildingName: '공학관',
        buildingNumber: 402,
        roomNumber: '201',
        roomCapacity: 80,
      },
      {
        roomId: 4,
        buildingName: '공학관',
        buildingNumber: 402,
        roomNumber: '202',
        roomCapacity: 60,
      },
    ],
    3: [
      {
        roomId: 5,
        buildingName: '본관',
        buildingNumber: 403,
        roomNumber: '301',
        roomCapacity: 120,
      },
    ],
  };

  // 상태 관리
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [rooms, setRooms] = useState([]);

  // 선택 시 강의실 목록 표시
  const handleBuildingChange = (e) => {
    const id = e.target.value;
    setSelectedBuilding(id);
    setRooms(dummyRooms[id] || []);
  };

  // 검색용 임시 핸들러
  const handleSearch = (value) => {
    alert(`"${value}" 검색 기능은 추후 구현 예정`);
  };

  return (
    <Layout
      username='관리자 님'
      headerTitle='강의실 관리'
      menus={[
        {
          title: '강의실',
          subItems: [
            { label: '강의실 목록', path: '/classrooms', isSelected: true },
          ],
        },
      ]}
    >
      <PageHeader
        title='강의실 조회'
        helperText='강의실 정보를 조회합니다.'
        hasConfirmSelection={false}
      />

      {/* 검색 및 건물 선택 */}
      <div className='mb-5 flex items-center gap-3'>
        <select
          className='rounded-lg border px-3 py-2'
          value={selectedBuilding}
          onChange={handleBuildingChange}
        >
          <option value=''>건물 선택</option>
          {dummyBuildings.map((b) => (
            <option key={b.buildingId} value={b.buildingId}>
              {b.buildingName} ({b.buildingNumber})
            </option>
          ))}
        </select>

        <input
          type='text'
          placeholder='건물명 / 번호 검색'
          className='flex-1 rounded-lg border px-3 py-2'
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
        />

        <button
          onClick={() => handleSearch('직접입력')}
          className='rounded-lg bg-[var(--color-brand-500)] px-4 py-2 text-white'
        >
          조회
        </button>
      </div>

      {/* 강의실 테이블 */}
      <div className='overflow-hidden rounded-xl border bg-white shadow-sm'>
        <table className='w-full border-collapse text-sm'>
          <thead className='bg-[var(--color-table-header)] text-left'>
            <tr>
              <th className='w-12 border px-4 py-2 text-center'>No</th>
              <th className='border px-4 py-2 text-center'>건물명</th>
              <th className='border px-4 py-2 text-center'>건물번호</th>
              <th className='border px-4 py-2 text-center'>호실번호</th>
              <th className='border px-4 py-2 text-center'>수용인원</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={5} className='py-6 text-center text-gray-500'>
                  강의실 정보가 없습니다.
                </td>
              </tr>
            ) : (
              rooms.map((room, idx) => (
                <tr key={room.roomId} className='hover:bg-gray-50'>
                  <td className='border px-4 py-2 text-center'>{idx + 1}</td>
                  <td className='border px-4 py-2 text-center'>
                    {room.buildingName}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {room.buildingNumber}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {room.roomNumber}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {room.roomCapacity}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
