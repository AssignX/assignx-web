// src/pages/SearchProfessorPage.jsx
import React, { useState } from 'react';
import Layout from '@/pages/office/Layout';
import HorizontalTable from '@/components/table/HorizontalTable';
import InputCell from '@/components/table/cells/InputCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';

export default function SearchProfessorPage() {
  const [professors, setProfessors] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSearch = async () => {
    const keyword = searchKeyword.trim();
    if (!keyword) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get('/api/member/search/professor', {
        params: { name: keyword },
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

  return (
    <Layout
      username='사무실 님'
      headerTitle='사무실 메뉴'
      menus={[
        { title: '과목', subItems: [{ label: '과목 목록', path: '/classes' }] },
        {
          title: '교수',
          isOpen: true,
          subItems: [
            { label: '교수 목록', path: '/professors', isSelected: true },
          ],
        },
        {
          title: '강의실',
          subItems: [{ label: '강의실 목록', path: '/classrooms' }],
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
        교수 목록
      </h1>

      <div className='h-[764px] w-full bg-white'>
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
