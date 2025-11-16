import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import VerticalTable from '@/components/table/VerticalTable';

import DeleteConfirmModal from './DeleteConfirmModal';

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

const dummyData = [
  { id: '1', number: 1, college: '공과대학', major: '컴퓨터공학과' },
  { id: '2', number: 2, college: '공과대학', major: '전자공학과' },
];

function DepartmentListPage() {
  const navigate = useNavigate();
  const [departmentData, setDepartmentData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    // Fetch department data from API
    setDepartmentData(dummyData);
  }, []);

  const handleConfirmDelete = () => {
    const targetId = selectedRowIds[0];

    // TODO: /api/department/{departmentId} DELETE 요청

    setDepartmentData((prev) => prev.filter((row) => row.id !== targetId));
    setSelectedRowIds([]);
  };

  return (
    <Section>
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
                if (selectedRowIds.length > 0) {
                  navigate(`/admin/department/edit/${selectedRowIds[0]}`); // +1을 해야 하나?
                } else {
                  alert('수정할 학과를 선택해주세요.');
                }
              },
            },
            {
              text: '삭제',
              color: 'lightgray',
              onClick: () => {
                if (selectedRowIds.length === 0) {
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
    </Section>
  );
}

export default DepartmentListPage;
