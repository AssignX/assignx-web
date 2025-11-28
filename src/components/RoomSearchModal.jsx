// src/components/RoomSearchModal.jsx

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/modal/Modal';
import PageHeader from '@/components/headers/PageHeader';
import InputCell from '@/components/table/cells/InputCell';
import Button from '@/components/buttons/Button';
import { SearchIcon } from '@/assets/icons';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';
import RoomSearchTable from '@/components/RoomSearchTable';

export default function RoomSearchModal({
  isOpen,
  onClose,
  onSelect,
  buildingId,
}) {
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (!isOpen || !buildingId) return;

    const fetchRooms = async () => {
      try {
        const res = await apiClient.get(`/api/building/${buildingId}`);
        const data = res.data;

        if (!data?.rooms) {
          setRooms([]);
          setFiltered([]);
          return;
        }

        const mapped = data.rooms.map((room) => ({
          id: room.roomId,
          roomNumber: room.roomNumber,
          capacity: room.roomCapacity,
          buildingName: data.buildingName,
        }));

        setRooms(mapped);
        setFiltered(mapped);
      } catch (err) {
        console.error('강의실 조회 실패:', err);
      }
    };

    fetchRooms();
  }, [isOpen, buildingId]);

  const content = (
    <div className='flex flex-col text-sm'>
      <div className='flex flex-col pb-[10px]'>
        <PageHeader title='강의실 검색' />
        <RoomSearchTable
          onSearch={(kw) => {
            if (!kw.trim()) {
              setFiltered(rooms);
            } else {
              const lower = kw.toLowerCase();
              setFiltered(
                rooms.filter((r) => r.roomNumber.toLowerCase().includes(lower))
              );
            }
          }}
        />
      </div>
      <VerticalTable
        columns={[
          { accessorKey: 'roomNumber', header: '강의실', size: 220 },
          { accessorKey: 'capacity', header: '수용인원', size: 100 },
        ]}
        data={filtered}
        selectable
        singleSelect
        updateSelection={(ids) => {
          const selected = filtered.find((r) => String(r.id) === ids[0]);
          if (selected) setSelectedRoom(selected);
        }}
        maxHeight={400}
      />
    </div>
  );

  return (
    <Modal
      title='강의실 선택'
      content={content}
      confirmText='확인'
      cancelText='취소'
      onConfirm={() => {
        if (selectedRoom) onSelect(selectedRoom);
        onClose();
      }}
      onCancel={onClose}
      onClose={onClose}
      width='700px'
      height='550px'
    />
  );
}

RoomSearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  buildingId: PropTypes.number,
};
