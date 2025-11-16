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
  { header: '건물번호', accessorKey: 'buildingNumber', size: 100 },
  { header: '건물명', accessorKey: 'buildingName', size: 100 },
];

const dummyBuildingData = [
  {
    id: '1', // buildingId값임
    buildingId: 1,
    buildingNumber: 451,
    buildingName: 'IT대학5호관(IT융복합관)',
  },
  { id: '2', buildingId: 2, buildingNumber: 452, buildingName: 'IT대학4호관' },
  { id: '3', buildingId: 3, buildingNumber: 453, buildingName: 'IT대학3호관' },
];

const dummyClassRoomData = {
  1: [
    { id: '1', classRoom: '348' },
    { id: '2', classRoom: '352' },
    { id: '3', classRoom: '355' },
  ],
  2: [
    { id: '1', classRoom: '101' },
    { id: '2', classRoom: '102' },
  ],
  3: [
    { id: '1', classRoom: '201' },
    { id: '2', classRoom: '202' },
  ],
};

function ClassRoomModal({ setIsOpen, onSelect }) {
  const [buildingName, setBuildingName] = useState('');
  const [buildingData, setBuildingData] = useState([]);
  const [classRoomData, setClassRoomData] = useState([]);

  const [selectedBuildingIds, setSelectedBuildingIds] = useState([]);
  const [selectedClassRoomIds, setSelectedClassRoomIds] = useState([]);

  const handleBuildingSearch = () => {
    console.log(buildingName);
    // search API function
  };

  useEffect(() => {
    // 이걸 제거하고, handleBuildingSearch에서 API 호출하도록 변경 필요
    setBuildingData(dummyBuildingData);
    setClassRoomData([]);
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

  const handleBuildingSelectionChange = (selectedIds) => {
    setSelectedBuildingIds(selectedIds);

    const firstId = selectedIds[0];
    const selectedBuilding = buildingData.find((b) => b.id === firstId);

    if (!selectedBuilding) {
      setClassRoomData([]);
      setSelectedClassRoomIds([]);
      return;
    }

    const rooms = dummyClassRoomData[selectedBuilding.buildingId] || [];
    setClassRoomData(rooms);
    setSelectedClassRoomIds([]); // 건물 바뀌면 강의실 선택 초기화
  };

  const handleConfirm = () => {
    if (selectedBuildingIds.length === 0) {
      alert('건물을 선택해주세요.');
      return;
    }
    if (selectedClassRoomIds.length === 0) {
      alert('강의실을 선택해주세요.');
      return;
    }

    const selectedBuilding = buildingData.find(
      (b) => b.id === selectedBuildingIds[0]
    );
    const selectedClassRoom = classRoomData.find(
      (c) => c.id === selectedClassRoomIds[0]
    );

    if (!selectedBuilding || !selectedClassRoom) {
      alert('선택한 건물 또는 강의실 정보를 찾을 수 없습니다.');
      return;
    }

    const mappedRoom = {
      id: `${selectedBuilding.buildingId}-${selectedClassRoom.classRoom}`, // 나중에 수정
      buildingNo: selectedBuilding.buildingNumber,
      buildingName: selectedBuilding.buildingName,
      roomNo: selectedClassRoom.classRoom,
      capacity: '50', // 수용인원은 나중에 변경해야해...................
    };

    if (onSelect) {
      onSelect([mappedRoom]); // 배열로 넘김
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
              selectable={true}
              singleSelect={true}
              updateSelection={handleBuildingSelectionChange}
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
              updateSelection={setSelectedClassRoomIds}
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

ClassRoomModal.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
};

export default ClassRoomModal;
