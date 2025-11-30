import Layout from '@/components/Layout';
import TableWrapper from '@/components/layout/TableWrapper';
import PageHeader from '@/components/headers/PageHeader';
import VerticalTable from '@/components/table/VerticalTable';

import ConfirmModal from '@/components/ConfirmModal';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/api/apiClient';

const buildingColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '건물 번호', accessorKey: 'buildingNumber', size: 200 },
  { header: '건물 이름', accessorKey: 'buildingName', size: 700 },
];

function BuildingListPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { name: userNameFromStore, departmentId } = useAuthStore();

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

  const [buildingData, setBuildingData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchBuildings = async () => {
    if (!departmentId) return;

    try {
      const res = await apiClient.get('/api/building');
      const list = Array.isArray(res.data) ? res.data : [];

      const mapped = list.map((item, idx) => ({
        id: String(item.buildingId ?? idx),
        buildingId: item.buildingId,
        buildingNumber: String(item.buildingNumber ?? ''),
        buildingName: item.buildingName ?? '',
      }));

      setBuildingData(mapped);
    } catch (err) {
      console.error('건물 목록 조회 실패:', err);
      setBuildingData([]);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [departmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirmDelete = async () => {
    if (!selectedRowIds.length) {
      alert('삭제할 건물을 선택해주세요.');
      return;
    }

    const targetRowId = selectedRowIds[0];
    const targetRow = buildingData.find(
      (row) => String(row.id) === String(targetRowId)
    );

    if (!targetRow || !targetRow.buildingId) {
      alert('선택한 건물 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      await apiClient.delete(`/api/building/${targetRow.buildingId}`);
      setSelectedRowIds([]);
      setIsDeleteModalOpen(false);

      await fetchBuildings();
      alert('삭제가 완료되었습니다.');
    } catch (err) {
      console.error('건물 삭제 실패:', err);
      alert('건물 삭제 중 오류가 발생했습니다.');
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
          subItems: [
            { label: '건물 목록', path: '/admin/building', isSelected: true },
          ],
        },
      ]}
    >
      <div className='flex flex-col'>
        <PageHeader
          title='건물 목록'
          buttonsData={[
            {
              text: '추가',
              color: 'lightgray',
              onClick: () => navigate('/admin/building/edit'),
            },
            {
              text: '수정',
              color: 'lightgray',
              onClick: () => {
                if (selectedRowIds.length > 0) {
                  navigate(`/admin/building/edit/${selectedRowIds[0]}`);
                } else {
                  alert('수정할 건물을 선택해주세요.');
                }
              },
            },
            {
              text: '삭제',
              color: 'lightgray',
              onClick: () => {
                if (selectedRowIds.length === 0) {
                  alert('삭제할 건물을 선택해주세요.');
                  return;
                }
                setIsDeleteModalOpen(true);
              },
            },
          ]}
        />
        <TableWrapper height='700px'>
          <VerticalTable
            columns={buildingColumns}
            data={buildingData}
            headerHeight={40}
            selectable={true}
            singleSelect={true}
            updateSelection={setSelectedRowIds}
          />
        </TableWrapper>
      </div>

      {isDeleteModalOpen && (
        <ConfirmModal
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          title='삭제하시겠습니까?'
          body='선택한 건물을 삭제하시겠습니까?'
        />
      )}
    </Layout>
  );
}

export default BuildingListPage;
