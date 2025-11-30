import Layout from '@/components/Layout';
import TableWrapper from '@/components/layout/TableWrapper';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import InputCell from '@/components/table/cells/InputCell';
import PlusCell from '@/components/table/cells/PlusCell';
import { SaveIcon } from '@/assets/icons';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/api/apiClient';

import ConfirmModal from '@/components/ConfirmModal';

function BuildingEditPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { name: userNameFromStore } = useAuthStore();

  const { id } = useParams();
  const isEditMode = Boolean(id);

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

  const [buildingNumber, setBuildingNumber] = useState('');
  const [buildingName, setBuildingName] = useState('');

  const [classroomData, setClassroomData] = useState([]);
  const [classroomNewRows, setClassroomNewRows] = useState([]);
  const [classroomSelectedRows, setClassroomSelectedRows] = useState([]);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const departmentInfo = [
    {
      id: 'buildingNumber',
      label: '건물 번호',
      labelWidth: '130px',
      contentWidth: '300px',
      content: (
        <InputCell
          value={String(buildingNumber)}
          height={32}
          onChange={(e) => setBuildingNumber(e.target.value)}
        />
      ),
    },
    {
      id: 'buildingName',
      label: '건물 이름',
      labelWidth: '130px',
      contentWidth: '300px',
      content: (
        <InputCell
          value={String(buildingName)}
          height={32}
          onChange={(e) => setBuildingName(e.target.value)}
        />
      ),
    },
  ];

  useEffect(() => {
    if (!isEditMode || !id) {
      setBuildingNumber('');
      setBuildingName('');
      setClassroomData([]);
      setClassroomNewRows([]);
      return;
    }

    const fetchBuildingDetail = async () => {
      try {
        const res = await apiClient.get(`/api/building/${id}`);
        const data = res.data || {};

        setBuildingNumber(String(data.buildingNumber ?? ''));
        setBuildingName(data.buildingName ?? '');

        const rooms = Array.isArray(data.rooms) ? data.rooms : [];
        const mappedRooms = rooms.map((room, idx) => ({
          id: String(room.roomId ?? idx),
          roomId: room.roomId,
          classRoomNumber: room.roomNumber,
          capacity: room.roomCapacity,
          isEditing: false,
        }));
        setClassroomData(mappedRooms);
        setClassroomNewRows([]);
      } catch (error) {
        console.error('건물 상세 조회 실패:', error);
        setClassroomData([]);
        setClassroomNewRows([]);
      }
    };

    fetchBuildingDetail();
  }, [id, isEditMode]);

  const handleExistingClassroomChange = useCallback((rowId, key, value) => {
    setClassroomData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
    );
  }, []);

  const handleClassroomNewRowChange = useCallback((rowId, key, value) => {
    setClassroomNewRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
    );
  }, []);

  const handleAddClassroomRow = () => {
    const newRow = {
      id: `new-${Date.now()}`,
      classRoomNumber: '',
      capacity: '',
    };
    setClassroomNewRows((prev) => [...prev, newRow]);
  };

  const handleDeleteClassroomRows = () => {
    if (classroomSelectedRows.length === 0) {
      alert('삭제할 강의실을 선택해주세요.');
      return;
    }
    setClassroomData((prev) =>
      prev.filter((row) => !classroomSelectedRows.includes(row.id))
    );
    setClassroomNewRows((prev) =>
      prev.filter((row) => !classroomSelectedRows.includes(row.id))
    );
    setClassroomSelectedRows([]);
  };

  const isAnyClassroomEditing = useMemo(
    () => classroomData.some((row) => row.isEditing),
    [classroomData]
  );

  const handleStartEditClassroomRow = () => {
    if (classroomSelectedRows.length === 0) {
      alert('수정할 강의실을 선택해주세요.');
      return;
    }

    setClassroomData((prev) =>
      prev.map((row) =>
        classroomSelectedRows.includes(row.id)
          ? { ...row, isEditing: true }
          : row
      )
    );
  };

  const handleFinishEditClassroomRow = () => {
    setClassroomData((prev) =>
      prev.map((row) => ({ ...row, isEditing: false }))
    );
  };

  const handleOpenSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!buildingNumber || !buildingName) {
      alert('건물 번호와 건물 이름을 입력해주세요.');
      return;
    }

    try {
      let payload;
      if (isEditMode) {
        const existingRoomsPayload = classroomData
          .filter(
            (room) =>
              String(room.classRoomNumber ?? room.roomNumber ?? '').trim() !==
              ''
          )
          .map((room) => ({
            actionType: 'UPDATE',
            roomId: room.roomId,
            roomNumber: String(room.classRoomNumber ?? room.roomNumber ?? ''),
            roomCapacity: Number(room.capacity ?? room.roomCapacity ?? 0),
          }));

        const newRoomsPayload = classroomNewRows
          .filter(
            (room) =>
              String(room.classRoomNumber ?? room.roomNumber ?? '').trim() !==
              ''
          )
          .map((room) => ({
            actionType: 'CREATE',
            roomNumber: String(room.classRoomNumber ?? room.roomNumber ?? ''),
            roomCapacity: Number(room.capacity ?? room.roomCapacity ?? 0),
          }));

        payload = {
          buildingId: Number(id),
          buildingNumber: Number(buildingNumber ?? 0),
          buildingName,
          rooms: [...existingRoomsPayload, ...newRoomsPayload],
        };

        await apiClient.put('/api/building', payload);
      } else {
        const allRooms = [...classroomData, ...classroomNewRows];
        const roomsPayload = allRooms
          .filter(
            (room) =>
              String(room.classRoomNumber ?? room.roomNumber ?? '').trim() !==
              ''
          )
          .map((room) => ({
            actionType: 'CREATE',
            roomNumber: String(room.classRoomNumber ?? room.roomNumber ?? ''),
            roomCapacity: Number(room.capacity ?? room.roomCapacity ?? 0),
          }));

        payload = {
          buildingNumber: Number(buildingNumber ?? 0),
          buildingName,
          rooms: roomsPayload,
        };
        await apiClient.post('/api/building', payload);
      }
      alert('건물 정보가 저장되었습니다.');
      setIsSaveModalOpen(false);
      navigate(-1);
    } catch (error) {
      console.error('건물 저장 실패:', error);
      alert('건물 정보를 저장하는 중 오류가 발생했습니다.');
    }
  };

  const ClassroomColumns = useMemo(
    () => [
      {
        header: 'No',
        accessorKey: 'number',
        size: 50,
        cell: ({ row }) => row.index + 1,
      },
      {
        header: '강의실 번호',
        accessorKey: 'classRoomNumber',
        size: 400,
        cell: ({ row }) => {
          const { id, classRoomNumber, isEditing } = row.original;
          if (isEditing) {
            return (
              <InputCell
                value={classRoomNumber ?? ''}
                height={32}
                onChange={(e) =>
                  handleExistingClassroomChange(
                    id,
                    'classRoomNumber',
                    e.target.value
                  )
                }
              />
            );
          }
          return String(classRoomNumber ?? '');
        },
      },
      {
        header: '수용인원',
        accessorKey: 'capacity',
        size: 400,
        cell: ({ row }) => {
          const { id, capacity, isEditing } = row.original;
          if (isEditing) {
            return (
              <InputCell
                value={capacity ?? ''}
                height={32}
                onChange={(e) =>
                  handleExistingClassroomChange(id, 'capacity', e.target.value)
                }
              />
            );
          }
          return String(capacity ?? '');
        },
      },
    ],
    [handleExistingClassroomChange]
  );

  return (
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle='관리자 메뉴'
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
      <div className='flex flex-col'>
        <PageHeader
          title='건물 정보'
          buttonsData={[
            {
              text: '저장',
              color: 'gold',
              Icon: SaveIcon,
              onClick: handleOpenSaveModal,
            },
            {
              text: '취소',
              color: 'lightgray',
              onClick: () => setIsCancelModalOpen(true),
            },
          ]}
        />
        <HorizontalTable items={departmentInfo} />
      </div>

      <div className='flex flex-col'>
        <SectionHeader
          title='강의실 목록'
          controlGroup='buttonGroup'
          buttonsData={[
            {
              text: '추가',
              color: 'lightgray',
              onClick: handleAddClassroomRow,
            },
            ...(isEditMode
              ? [
                  {
                    text: isAnyClassroomEditing ? '완료' : '수정',
                    color: 'lightgray',
                    onClick: isAnyClassroomEditing
                      ? handleFinishEditClassroomRow
                      : handleStartEditClassroomRow,
                  },
                ]
              : []),
            {
              text: '삭제',
              color: 'lightgray',
              onClick: handleDeleteClassroomRows,
            },
          ]}
        />
        <TableWrapper height='600px'>
          <VerticalTable
            columns={ClassroomColumns}
            data={classroomData}
            headerHeight={40}
            selectable={true}
            updateSelection={setClassroomSelectedRows}
            newRows={classroomNewRows}
            onNewRowChange={handleClassroomNewRowChange}
            renderNewRowActions={() => <PlusCell />}
          />
        </TableWrapper>
      </div>

      {isSaveModalOpen && (
        <ConfirmModal
          setIsOpen={setIsSaveModalOpen}
          onConfirm={handleConfirmSave}
          title='저장하시겠습니까?'
          body='건물 정보를 저장하시겠습니까?'
        />
      )}
      {isCancelModalOpen && (
        <ConfirmModal
          setIsOpen={setIsCancelModalOpen}
          onConfirm={() => navigate(-1)}
          title='취소'
          body='정말 취소하시겠습니까? 모든 변경사항은 저장되지 않습니다.'
        />
      )}
    </Layout>
  );
}

export default BuildingEditPage;
