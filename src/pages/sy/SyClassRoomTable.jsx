import { useEffect, useState, useMemo } from 'react';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';
import PropTypes from 'prop-types';
import TableWrapper from '@/components/layout/TableWrapper';

export default function SyClassRoomTable({
  filters,
  onSelect,
  resetSelection,
}) {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      { accessorKey: 'no', header: 'No', size: 40 },
      { accessorKey: 'buildingName', header: '건물명', size: 230 },
      { accessorKey: 'roomNumber', header: '강의실', size: 175 },
    ],
    []
  );

  useEffect(() => {
    if (!filters || !filters.buildingId) {
      setData([]);
      return;
    }

    const fetchBuildingRooms = async () => {
      try {
        const res = await apiClient.get(`/api/building/${filters.buildingId}`);
        const building = res.data;

        if (!building || !building.rooms) {
          setData([]);
          return;
        }

        const roomData = building.rooms.map((room, idx) => ({
          id: room.roomId,
          no: idx + 1,
          buildingName: building.buildingName,
          roomNumber: room.roomNumber,
        }));

        setData(roomData);
      } catch (err) {
        console.error('건물 상세 조회 실패:', err);
        setData([]);
      }
    };

    fetchBuildingRooms();
  }, [filters]);

  const handleSelectionChange = (selectedIds) => {
    if (!onSelect || selectedIds.length === 0) return;
    const selectedRow = data.find((row) => String(row.id) === selectedIds[0]);
    if (selectedRow) {
      onSelect({
        ...selectedRow,
        year: filters?.year,
        semester: filters?.semester,
        buildingNum: filters?.buildingNum,
        buildingId: filters?.buildingId,
      });
    }
  };

  return (
    <TableWrapper height='680px'>
      <VerticalTable
        columns={columns}
        data={data}
        selectable={true}
        singleSelect={true}
        showSelectionCheckbox={true}
        updateSelection={handleSelectionChange}
        resetSelection={resetSelection}
      />
    </TableWrapper>
  );
}

SyClassRoomTable.propTypes = {
  filters: PropTypes.object,
  onSelect: PropTypes.func,
  resetSelection: PropTypes.func,
};
