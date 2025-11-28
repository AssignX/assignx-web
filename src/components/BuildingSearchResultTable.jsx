import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';

export default function BuildingSearchResultTable({ keyword, onSelect }) {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      { accessorKey: 'no', header: 'No', size: 50 },
      { accessorKey: 'buildingNum', header: '건물번호', size: 200 },
      { accessorKey: 'buildingName', header: '건물명', size: 550 },
    ],
    []
  );

  useEffect(() => {
    if (!keyword.trim()) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await apiClient.get('/api/building');
        const buildings = res.data || [];

        const lower = keyword.toLowerCase();

        const filtered = buildings.filter((b) => {
          const id = String(b.buildingId).toLowerCase();
          const number = String(b.buildingNumber).toLowerCase();
          const name = b.buildingName.toLowerCase();

          return (
            id.includes(lower) || number.includes(lower) || name.includes(lower)
          );
        });

        setData(
          filtered.map((b, i) => ({
            id: b.buildingId,
            no: i + 1,
            buildingNum: b.buildingNumber,
            buildingName: b.buildingName,
          }))
        );
      } catch (err) {
        console.error('건물 목록 조회 실패:', err);
        setData([]);
      }
    };

    fetchData();
  }, [keyword]);

  const handleSelectionChange = (selectedRowIds) => {
    if (!onSelect || selectedRowIds.length === 0) return;
    const selected = data.find((row) => String(row.id) === selectedRowIds[0]);
    if (selected) onSelect(selected);
  };

  return (
    <VerticalTable
      columns={columns}
      data={data}
      selectable={true}
      singleSelect={true}
      updateSelection={handleSelectionChange}
    />
  );
}

BuildingSearchResultTable.propTypes = {
  keyword: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
};
