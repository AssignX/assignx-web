import Layout from '@/components/Layout';
import PageHeader from '@/components/headers/PageHeader';
import VerticalTable from '@/components/table/VerticalTable';

import DeleteConfirmModal from './DeleteConfirmModal';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/api/apiClient';

const buildingColumns = [
  { header: 'No', accessorKey: 'number', size: 50 },
  { header: '건물 번호', accessorKey: 'buildingNumber', size: 200 },
  {
    header: '건물 이름',
    accessorKey: 'buildingName',
    size: 700, // fill 수정 필요
  },
];

const dummyData = [
  {
    id: 1,
    buildingId: 1,
    number: 1,
    buildingNumber: '001',
    buildingName: 'IT대학5호관(IT융복합)',
  },
  {
    id: 2,
    buildingId: 2,
    number: 2,
    buildingNumber: '002',
    buildingName: 'Science Center',
  },
];

function BuildingListPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { name: userNameFromStore, departmentName } = useAuthStore();

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

  useEffect(() => {
    // Fetch building data from API
    setBuildingData(dummyData);
  }, []);

  const handleConfirmDelete = () => {
    const targetId = selectedRowIds[0];
    // TODO: /api/building/{buildingId} DELETE 요청

    setBuildingData((prev) =>
      prev.filter((row) => String(row.id) !== String(targetId))
    );
    setSelectedRowIds([]);
  };

  return (
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle={`${departmentName ?? ''} 메뉴`}
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
      <div>
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
                  navigate(`/admin/building/edit/${selectedRowIds[0]}`); // +1을 해야 하나?
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
        <VerticalTable
          columns={buildingColumns}
          data={buildingData}
          headerHeight={40}
          maxHeight={1200}
          selectable={true}
          singleSelect={true}
          updateSelection={setSelectedRowIds}
        />
      </div>
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          message='선택한 건물을 삭제하시겠습니까?'
        />
      )}
    </Layout>
  );
}

export default BuildingListPage;
