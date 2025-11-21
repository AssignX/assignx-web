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

export default function RoomSearchModal({
  isOpen,
  onClose,
  onSelect,
  buildingId,
}) {
  const [keyword, setKeyword] = useState('');
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);

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

  const handleSearch = () => {
    if (!keyword.trim()) {
      setFiltered(rooms);
      return;
    }

    const lower = keyword.toLowerCase();
    const result = rooms.filter((r) =>
      r.roomNumber.toLowerCase().includes(lower)
    );

    setFiltered(result);
  };

  const content = (
    <div className='flex flex-col gap-3 text-sm'>
      <PageHeader title='강의실 검색' />

      {/* 검색 입력 */}
      <div className='flex items-center gap-2'>
        <InputCell
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          height={32}
        />
        <Button
          text='조회'
          Icon={SearchIcon}
          color='lightgray'
          onClick={handleSearch}
        />
      </div>

      {/* 검색 결과 테이블 */}
      <VerticalTable
        columns={[
          { accessorKey: 'roomNumber', header: '강의실', size: 100 },
          { accessorKey: 'capacity', header: '수용인원', size: 100 },
        ]}
        data={filtered}
        selectable
        singleSelect
        updateSelection={(ids) => {
          const selected = filtered.find((r) => String(r.id) === ids[0]);
          if (selected) onSelect(selected);
        }}
        maxHeight={400}
      />
    </div>
  );

  return (
    <Modal
      title='강의실 선택'
      content={content}
      confirmText='닫기'
      cancelText='취소'
      onConfirm={onClose}
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
