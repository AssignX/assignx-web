import Layout from '@/components/Layout';
import TableWrapper from '@/components/layout/TableWrapper';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';

import InputCell from '@/components/table/cells/InputCell';
import PlusCell from '@/components/table/cells/PlusCell';
import { SaveIcon } from '@/assets/icons';

import EmployeeModal from './EmployeeModal';
import ClassRoomModal from './ClassRoomModal';
import ConfirmModal from '@/components/ConfirmModal';

import apiClient from '@/api/apiClient';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const employeeColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '교번', accessorKey: 'idNumber', size: 200 },
  { header: '이름', accessorKey: 'name', size: 200 },
  { header: '소속학과', accessorKey: 'departmentName', size: 400 },
];

const classroomColumns = [
  {
    header: 'No',
    accessorKey: 'number',
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  { header: '건물 번호', accessorKey: 'buildingNumber', size: 200 },
  { header: '건물 이름', accessorKey: 'buildingName', size: 400 },
  { header: '강의실 번호', accessorKey: 'roomNumber', size: 200 },
  { header: '수용 인원', accessorKey: 'roomCapacity', size: 100 },
];

function DepartmentEditPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { name: userNameFromStore } = useAuthStore();

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

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isClassRoomModalOpen, setIsClassRoomModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [departmentId, setDepartmentId] = useState(null);

  const [employeeData, setEmployeeData] = useState([]);
  const [classroomData, setClassroomData] = useState([]);

  const [classroomSelectedRows, setClassroomSelectedRows] = useState([]);

  const departmentInfo = [
    {
      id: 'college',
      label: '단과대학',
      required: false,
      labelWidth: '130px',
      contentWidth: '300px',
      content: (
        <InputCell
          value={String(college)}
          height={32}
          onChange={(e) => setCollege(e.target.value)}
        />
      ),
    },
    {
      id: 'department',
      label: '학과',
      required: false,
      labelWidth: '130px',
      contentWidth: '300px',
      content: (
        <InputCell
          value={String(department)}
          height={32}
          onChange={(e) => setDepartment(e.target.value)}
        />
      ),
    },
  ];

  const fetchDepartmentDetails = async (deptId) => {
    try {
      const res = await apiClient.get(`/api/department/admin/${deptId}`);
      const data = res.data;

      setCollege(data.college || '');
      setDepartment(data.major || '');
      setDepartmentId(data.departmentId ?? null);

      const mappedEmployees = (data.employees || []).map((emp) => ({
        id: String(emp.memberId),
        memberId: emp.memberId,
        idNumber: emp.idNumber,
        name: emp.name,
        departmentId: emp.departmentId,
        departmentName: emp.departmentName,
      }));
      setEmployeeData(mappedEmployees);

      const mappedClassrooms = (data.rooms || []).map((room) => ({
        id: String(room.roomId),
        roomId: room.roomId,
        buildingNumber: room.buildingNumber,
        buildingName: room.buildingName,
        roomNumber: room.roomNumber,
        roomCapacity: room.roomCapacity,
      }));
      setClassroomData(mappedClassrooms);
    } catch (error) {
      console.error('학과 상세 조회 실패:', error);
    }
  };

  useEffect(() => {
    if (isEditMode && id) {
      fetchDepartmentDetails(id);
    }
  }, [id, isEditMode]);

  const handleDeleteClassroomRows = () => {
    if (classroomSelectedRows.length === 0) {
      alert('삭제할 강의실을 선택해주세요.');
      return;
    }
    setClassroomData((prev) =>
      prev.filter((row) => !classroomSelectedRows.includes(row.id))
    );
    setClassroomSelectedRows([]);
  };

  const handleSelectEmployee = (employees) => {
    setEmployeeData((prev) => {
      const newOnes = employees.filter(
        (emp) =>
          !prev.some((row) => String(row.memberId) === String(emp.memberId))
      );
      return [...prev, ...newOnes];
    });
  };

  const handleSelectClassRoom = (rooms) => {
    setClassroomData((prev) => {
      const mappedNew = rooms.map((room) => ({
        id: String(room.roomId ?? room.id),
        roomId: room.roomId,
        buildingNumber: room.buildingNumber ?? room.buildingNo ?? '',
        buildingName: room.buildingName ?? '',
        roomNumber: room.roomNumber ?? room.roomNo ?? '',
        roomCapacity: room.roomCapacity ?? room.capacity ?? 0,
      }));

      const merged = [...prev];
      mappedNew.forEach((newRoom) => {
        const exists = merged.some(
          (r) => String(r.roomId) === String(newRoom.roomId)
        );
        if (!exists) {
          merged.push(newRoom);
        }
      });

      return merged;
    });
  };

  const handleOpenSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    const deptId = isEditMode ? Number(departmentId) : 0;

    const payload = {
      departmentId: deptId,
      college: college,
      major: department,
      employeeIds: employeeData.map((emp) => Number(emp.memberId)),
      roomIds: classroomData.map((room) => Number(room.roomId)),
    };

    try {
      if (isEditMode) {
        await apiClient.put('/api/department/admin', payload);
      } else {
        await apiClient.post('/api/department/admin', payload);
      }

      alert('학과 정보가 저장되었습니다.');
      setIsSaveModalOpen(false);
      navigate(-1);
    } catch (error) {
      console.error('학과 저장 실패:', error);
      alert('학과 정보를 저장하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <Layout
      username={`${userNameFromStore ?? '사용자'} 님`}
      headerTitle='관리자 메뉴'
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
      <div className='flex flex-col'>
        <PageHeader
          title='학과 목록'
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
        <SectionHeader title='직원 목록' />
        <TableWrapper height='160px'>
          <VerticalTable
            columns={employeeColumns}
            data={employeeData}
            headerHeight={40}
          />
        </TableWrapper>
      </div>

      <div className='flex flex-col'>
        <SectionHeader
          title='강의실 목록'
          controlGroup='buttonGroup'
          buttonsData={[
            {
              text: '추가',
              color: 'lightgray',
              onClick: () => setIsClassRoomModalOpen(true),
            },
            {
              text: '삭제',
              color: 'lightgray',
              onClick: handleDeleteClassroomRows,
            },
          ]}
        />
        <TableWrapper height='400px'>
          <VerticalTable
            columns={classroomColumns}
            data={classroomData}
            headerHeight={40}
            selectable={true}
            updateSelection={setClassroomSelectedRows}
            renderNewRowActions={() => <PlusCell />}
          />
        </TableWrapper>
      </div>

      {isEmployeeModalOpen && (
        <EmployeeModal
          setIsOpen={setIsEmployeeModalOpen}
          onSelect={handleSelectEmployee}
        />
      )}
      {isClassRoomModalOpen && (
        <ClassRoomModal
          setIsOpen={setIsClassRoomModalOpen}
          onSelect={handleSelectClassRoom}
        />
      )}
      {isSaveModalOpen && (
        <ConfirmModal
          setIsOpen={setIsSaveModalOpen}
          onConfirm={handleConfirmSave}
          title='저장하시겠습니까?'
          body='학과 정보를 저장하시겠습니까?'
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

export default DepartmentEditPage;
