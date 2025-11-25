import Modal from '@/components/modal/Modal.jsx';
import PropTypes from 'prop-types';
import VerticalTable from '@/components/table/VerticalTable';
import HorizontalTable from '@/components/table/HorizontalTable.jsx';
import SectionHeader from '@/components/headers/SectionHeader.jsx';

import InputCell from '@/components/table/cells/InputCell.jsx';
import Button from '@/components/buttons/Button.jsx';
import { SearchIcon } from '@/assets/icons';

import { useEffect, useState } from 'react';
import { ChevronRightIcon } from '@/assets/icons';

const buildingColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '건물번호', accessorKey: 'buildingId', size: 100 },
  { header: '건물명', accessorKey: 'name', size: 100 },
];

const dummyBuildingData = [
  { number: 1, buildingId: '01', name: 'IT대학5호관(IT융복합관)' },
  { number: 2, buildingId: '02', name: 'IT대학5호관(IT융복합관)' },
  { number: 3, buildingId: '03', name: 'IT대학5호관(IT융복합관)' },
  { number: 4, buildingId: '04', name: 'IT대학5호관(IT융복합관)' },
  { number: 5, buildingId: '05', name: 'IT대학5호관(IT융복합관)' },
  { number: 6, buildingId: '06', name: 'IT대학5호관(IT융복합관)' },
];

const dummyClassRoomData = [
  { number: 1, classRoom: '348' },
  { number: 2, classRoom: '352' },
  { number: 3, classRoom: '355' },
  { number: 4, classRoom: '360' },
  { number: 5, classRoom: '365' },
  { number: 6, classRoom: '370' },
];

function ClassRoomModal({ setIsOpen }) {
  const [buildingName, setBuildingName] = useState('');
  const [buildingData, setBuildingData] = useState([]);
  const [classRoomData, setClassRoomData] = useState([]);

  const handleBuildingSearch = () => {
    console.log(buildingName);
    // search API function
  };

  useEffect(() => {
    // 이걸 제거하고, handleBuildingSearch에서 API 호출하도록 변경 필요
    setBuildingData(dummyBuildingData);
    setClassRoomData(dummyClassRoomData);
  }, []);

  const buildingSearchItems = [
    {
      id: 'building',
      label: '건물코드/명',
      labelWidth: '130px',
      contentWidth: '500px',
      content: (
        <div className='flex items-center gap-1'>
          <div className='w-[200px]'>
            <InputCell
              initialValue={buildingName}
              height={32}
              onChange={(e) => setBuildingName(e.target.value)}
            />
          </div>
          <Button
            text='조회'
            color='lightgray'
            textSize='text-sm'
            Icon={SearchIcon}
            onClick={handleBuildingSearch}
          />
        </div>
      ),
    },
  ];

  const handleConfirm = () => {
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
      title='강의실 조회'
      content={
        <div className='h-[450px]'>
          <div className='pb-[10px]'>
            <SectionHeader title='강의실 검색' />
            <HorizontalTable items={buildingSearchItems} />
          </div>

          <div className='flex flex-row items-center'>
            <VerticalTable
              columns={buildingColumns}
              data={buildingData}
              headerHeight={40}
              maxHeight={300}
            />

            <div>
              <ChevronRightIcon />
            </div>

            <VerticalTable
              columns={[
                { header: '강의실', accessorKey: 'classRoom', size: 50 },
              ]}
              data={classRoomData}
              headerHeight={40}
              maxHeight={300}
              selectable={true}
              singleSelect={true}
            />
          </div>
        </div>
      }
      confirmText='확인'
      cancelText='취소'
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      onClose={handleClose}
      width
      height
      maxWidth='600px'
      maxHeight='500px'
    />
  );
}

ClassRoomModal.propTypes = { setIsOpen: PropTypes.func.isRequired };

export default ClassRoomModal;
