import Modal from '@/components/modal/Modal.jsx';
import PropTypes from 'prop-types';
import VerticalTable from '@/components/table/VerticalTable';
import HorizontalTable from '@/components/table/HorizontalTable.jsx';
import SectionHeader from '@/components/headers/SectionHeader.jsx';

import InputCell from '@/components/table/cells/InputCell.jsx';
import Button from '@/components/buttons/Button.jsx';
import { SearchIcon } from '@/assets/icons';

import { useEffect, useState } from 'react';

const employeeColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '교번', accessorKey: 'employeeId', size: 150 },
  { header: '이름', accessorKey: 'name', size: 150 },
  { header: '소속학과', accessorKey: 'department', size: 300 },
];

const dummyEmployeeData = [
  { id: '4', employeeId: 'EMP001', name: '홍길동', department: '컴퓨터공학' },
  { id: '5', employeeId: 'EMP002', name: '김철수', department: '전자공학과' },
  { id: '6', employeeId: 'EMP003', name: '이영희', department: '기계공학' },
];

function EmployeeModal({ setIsOpen, onSelect }) {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const handleEmployeeSearch = (searchValue) => {
    setEmployeeName(searchValue);
    // search API function
  };

  useEffect(() => {
    // 이걸 제거하고, handleEmployeeSearch에서 API 호출하도록 변경 필요
    setEmployeeData(dummyEmployeeData);
  }, []);

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
            onClick={() => {}}
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
      width
      height
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
