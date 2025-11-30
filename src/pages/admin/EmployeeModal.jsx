import Modal from '@/components/modal/Modal.jsx';
import PropTypes from 'prop-types';
import VerticalTable from '@/components/table/VerticalTable';
import HorizontalTable from '@/components/table/HorizontalTable.jsx';
import SectionHeader from '@/components/headers/SectionHeader.jsx';

import InputCell from '@/components/table/cells/InputCell.jsx';
import Button from '@/components/buttons/Button.jsx';
import { SearchIcon } from '@/assets/icons';

import { useEffect, useState } from 'react';
import apiClient from '@/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';

const employeeColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '교번', accessorKey: 'idNumber', size: 150 },
  { header: '이름', accessorKey: 'name', size: 150 },
  { header: '소속학과', accessorKey: 'department', size: 300 },
];

function EmployeeModal({ setIsOpen, onSelect }) {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const departmentId = useAuthStore((state) => state.departmentId);
  const handleEmployeeSearch = async (searchValue) => {
    const keyword = searchValue ?? employeeName;
    setEmployeeName(keyword);

    try {
      const res = await apiClient.get('/api/member/search/employee', {
        params: {
          name: keyword || undefined,
          departmentId: departmentId ?? undefined,
        },
      });

      const list = Array.isArray(res.data) ? res.data : [];
      const mapped = list.map((emp) => ({
        id: String(emp.memberId),
        memberId: emp.memberId,
        idNumber: emp.idNumber,
        name: emp.name,
        department: emp.departmentName,
        departmentId: emp.departmentId,
        departmentName: emp.departmentName,
      }));

      setEmployeeData(mapped);
    } catch (error) {
      console.error('직원 검색 실패:', error);
      alert('직원 검색 중 오류가 발생했습니다.');
      setEmployeeData([]);
    }
  };

  useEffect(() => {
    handleEmployeeSearch('');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const employeeSearchItems = [
    {
      id: 'employee',
      label: '이름/소속',
      labelWidth: '130px',
      contentWidth: '500px',
      content: (
        <div className='flex items-center gap-1'>
          <div className='w-[200px]'>
            <InputCell
              initialValue={employeeName}
              onSearch={handleEmployeeSearch}
              height={32}
            />
          </div>
          <Button
            text='조회'
            color='lightgray'
            textSize='text-sm'
            Icon={SearchIcon}
            onClick={() => handleEmployeeSearch(employeeName)}
          />
        </div>
      ),
    },
  ];

  const handleConfirm = () => {
    if (selectedRowIds.length === 0) {
      alert('직원을 선택해주세요.');
      return;
    }
    const selectedEmployees = employeeData.filter((row) =>
      selectedRowIds.includes(row.id)
    );

    if (onSelect) {
      onSelect(selectedEmployees);
    }

    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title='관리자 지정'
      content={
        <div className='h-[450px]'>
          <div className='pb-[10px]'>
            <SectionHeader title='직원 검색' />
            <HorizontalTable items={employeeSearchItems} />
          </div>
          <VerticalTable
            columns={employeeColumns}
            data={employeeData}
            headerHeight={40}
            maxHeight={300}
            selectable={true}
            updateSelection={setSelectedRowIds}
          />
        </div>
      }
      confirmText='확인'
      cancelText='취소'
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      onClose={handleClose}
      maxWidth='900px'
      maxHeight='600px'
    />
  );
}

EmployeeModal.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
};

export default EmployeeModal;
