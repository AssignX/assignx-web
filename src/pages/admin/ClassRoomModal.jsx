import Modal from '@/components/modal/Modal.jsx';
import PropTypes from 'prop-types';
import VerticalTable from '@/components/table/VerticalTable';
import HorizontalTable from '@/components/table/HorizontalTable.jsx';
import SectionHeader from '@/components/headers/SectionHeader.jsx';

import InputCell from '@/components/table/cells/InputCell.jsx';
import Button from '@/components/buttons/Button.jsx';
import { SearchIcon } from '@/assets/icons';

import { useState, useEffect, useCallback } from 'react';
import { ChevronRightIcon } from '@/assets/icons';
import apiClient from '@/api/apiClient';

const buildingColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '건물번호', accessorKey: 'buildingNumber', size: 100 },
  { header: '건물명', accessorKey: 'buildingName', size: 160 },
];

const roomColumns = [
  { header: 'No', accessorKey: 'no', size: 50 },
  { header: '강의실', accessorKey: 'roomNumber', size: 90 },
  { header: '정원', accessorKey: 'roomCapacity', size: 70 },
];

function ClassRoomModal({ setIsOpen, onSelect }) {
  const [buildingKeyword, setBuildingKeyword] = useState('');
  const [buildingData, setBuildingData] = useState([]);
  const [classRoomData, setClassRoomData] = useState([]);

  const [selectedBuildingIds, setSelectedBuildingIds] = useState([]);
  const [selectedClassRoomIds, setSelectedClassRoomIds] = useState([]);
  const [selectedBuildingDetail, setSelectedBuildingDetail] = useState(null);
  const [buildingFilter, setBuildingFilter] = useState(null);

  const mapBuildingList = useCallback(
    (list) =>
      list.map((building, idx) => ({
        id: String(building.buildingId),
        buildingId: building.buildingId,
        buildingNumber: building.buildingNumber ?? building.buildingNum ?? '',
        buildingName: building.buildingName ?? '',
        no: idx + 1,
      })),
    []
  );

  const fetchBuildings = useCallback(
    async (keyword = '') => {
      try {
        const res = await apiClient.get('/api/building');
        const raw = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        const trimmed = keyword.trim();
        const filtered = trimmed
          ? raw.filter((b) => {
              const key = trimmed.toLowerCase();
              return (
                String(b.buildingId ?? '')
                  .toLowerCase()
                  .includes(key) ||
                String(b.buildingNumber ?? b.buildingNum ?? '')
                  .toLowerCase()
                  .includes(key) ||
                String(b.buildingName ?? '')
                  .toLowerCase()
                  .includes(key)
              );
            })
          : raw;

        setBuildingData(mapBuildingList(filtered));
        setSelectedBuildingIds([]);
        setSelectedBuildingDetail(null);
        setClassRoomData([]);
        setSelectedClassRoomIds([]);
        setBuildingFilter(null);
      } catch (error) {
        console.error('건물 목록 조회 실패:', error);
        alert('건물 목록 조회 중 오류가 발생했습니다.');
      }
    },
    [mapBuildingList]
  );

  const handleBuildingSearch = () => {
    fetchBuildings(buildingKeyword);
  };

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

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
              value={buildingKeyword}
              height={32}
              onChange={(e) => setBuildingKeyword(e.target.value)}
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
      setBuildingFilter(null);
      setSelectedBuildingDetail(null);
      setClassRoomData([]);
      setSelectedClassRoomIds([]);
      return;
    }

    setBuildingFilter({
      buildingId: selectedBuilding.buildingId,
      buildingName: selectedBuilding.buildingName,
      buildingNumber: selectedBuilding.buildingNumber,
    });
  };

  useEffect(() => {
    if (!buildingFilter?.buildingId) {
      setSelectedBuildingDetail(null);
      setClassRoomData([]);
      setSelectedClassRoomIds([]);
      return;
    }

    const fetchBuildingRooms = async () => {
      try {
        const res = await apiClient.get(
          `/api/building/${buildingFilter.buildingId}`
        );
        const detail = res.data ?? null;
        setSelectedBuildingDetail(detail);

        const rooms = Array.isArray(detail?.rooms) ? detail.rooms : [];
        const mappedRooms = rooms.map((room, idx) => ({
          id: String(room.roomId),
          roomId: room.roomId,
          roomNumber: room.roomNumber,
          roomCapacity: room.roomCapacity,
          buildingName: room.buildingName ?? detail?.buildingName,
          buildingNumber: room.buildingNumber ?? detail?.buildingNumber,
          no: idx + 1,
        }));
        setClassRoomData(mappedRooms);
        setSelectedClassRoomIds([]);
      } catch (error) {
        console.error('강의실 조회 실패:', error);
        alert('강의실 조회 중 오류가 발생했습니다.');
        setSelectedBuildingDetail(null);
        setClassRoomData([]);
        setSelectedClassRoomIds([]);
      }
    };

    fetchBuildingRooms();
  }, [buildingFilter]);

  const handleConfirm = () => {
    if (selectedBuildingIds.length === 0) {
      alert('건물을 선택해주세요.');
      return;
    }
    if (selectedClassRoomIds.length === 0) {
      alert('강의실을 선택해주세요.');
      return;
    }

    const selectedBuilding = selectedBuildingDetail;
    const selectedClassRoom = classRoomData.find(
      (c) => c.id === selectedClassRoomIds[0]
    );

    if (!selectedBuilding || !selectedClassRoom) {
      alert('선택한 건물 또는 강의실 정보를 찾을 수 없습니다.');
      return;
    }

    const mappedRoom = {
      id: `${selectedBuilding.buildingId}-${selectedClassRoom.roomId}`,
      buildingNo: selectedBuilding.buildingNumber,
      buildingName: selectedBuilding.buildingName,
      roomNo: selectedClassRoom.roomNumber,
      roomId: selectedClassRoom.roomId,
      capacity: selectedClassRoom.roomCapacity,
    };

    if (onSelect) {
      onSelect([mappedRoom]);
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
              columns={roomColumns}
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
