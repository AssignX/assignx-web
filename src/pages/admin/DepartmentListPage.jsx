import Layout from '@/components/Layout';
import PageHeader from '@/components/headers/PageHeader';
import VerticalTable from '@/components/table/VerticalTable';

import DeleteConfirmModal from './DeleteConfirmModal';

import apiClient from '@/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const departmentColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '단과 대학', accessorKey: 'college', size: 200 },
  {
    header: '학과',
    accessorKey: 'major',
    size: 700, // fill 수정 필요
  },
];

function DepartmentListPage() {
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

  const [departmentData, setDepartmentData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await apiClient.get('/api/department/admin');
      const list = Array.isArray(res.data) ? res.data : [];

      const mapped = list.map((item, index) => ({
        id: String(item.departmentId),
        number: index + 1,
        college: item.college,
        major: item.major,
      }));

      setDepartmentData(mapped);
    } catch (error) {
      console.error('학과 목록 조회 실패:', error);
      setDepartmentData([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleConfirmDelete = async () => {
    const targetId = selectedRowIds[0];
    if (!targetId) return;

    try {
      await apiClient.delete(`/api/department/admin/${targetId}`);

      setDepartmentData((prev) => prev.filter((row) => row.id !== targetId));

      setSelectedRowIds([]);
      setIsDeleteModalOpen(false);

      alert('삭제가 완료되었습니다.'); // 추후 머지 이후 수정 예정
      console.log('학과 삭제 완료');
    } catch (error) {
      console.error('학과 삭제 실패:', error);
      alert('학과 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle={`${departmentName ?? ''} 메뉴`}
      onLogout={handleLogout}
      menus={[
        {
          title: '학과 관리',
          subItems: [
            { label: '학과 목록', path: '/admin/department', isSelected: true },
          ],
        },
        {
          title: '건물 관리',
          subItems: [{ label: '건물 목록', path: '/admin/building' }],
        },
      ]}
    >
      <div>
        <PageHeader
          title='학과 목록'
          buttonsData={[
            {
              text: '추가',
              color: 'lightgray',
              onClick: () => navigate('/admin/department/edit'),
            },
            {
              text: '수정',
              color: 'lightgray',
              onClick: () => {
                const targetId = selectedRowIds[0];
                if (!targetId) {
                  alert('수정할 학과를 선택해주세요.');
                  return;
                }
                navigate(`/admin/department/edit/${targetId}`);
              },
            },
            {
              text: '삭제',
              color: 'lightgray',
              onClick: () => {
                const targetId = selectedRowIds[0];
                if (!targetId) {
                  alert('삭제할 학과를 선택해주세요.');
                  return;
                }
                setIsDeleteModalOpen(true);
              },
            },
          ]}
        />
        <VerticalTable
          columns={departmentColumns}
          data={departmentData}
          headerHeight={40}
          selectable={true}
          singleSelect={true}
          updateSelection={setSelectedRowIds}
        />
      </div>

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          message='선택한 학과를 삭제하시겠습니까?'
        />
      )}
    </Layout>
  );
}

export default DepartmentListPage;
