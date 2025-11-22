import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import VerticalTable from '@/components/table/VerticalTable';
import apiClient from '@/api/apiClient';

export default function ProfessorSearchResultTable({ keyword, onSelect }) {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      { accessorKey: 'no', header: 'No', size: 50 },
      { accessorKey: 'name', header: '이름', size: 150 },
      { accessorKey: 'idNumber', header: '교번', size: 200 },
      { accessorKey: 'departmentName', header: '소속학과', size: 300 },
    ],
    []
  );

  useEffect(() => {
    if (!keyword.trim()) {
      setData([]);
      return;
    }

    const fetchProfessors = async () => {
      try {
        const res = await apiClient.get('/api/member/search/professor', {
          params: { name: keyword.trim() },
        });

        const list = res.data || [];

        setData(
          list.map((prof, idx) => ({
            id: prof.memberId,
            no: idx + 1,
            name: prof.name,
            idNumber: prof.idNumber,
            departmentName: prof.departmentName,
          }))
        );
      } catch (err) {
        console.error('교수 목록 조회 실패:', err);
        setData([]);
      }
    };

    fetchProfessors();
  }, [keyword]);

  const handleSelectionChange = (selectedRowIds) => {
    if (!onSelect || selectedRowIds.length === 0) return;

    const selected = data.find(
      (row) => String(row.id) === String(selectedRowIds[0])
    );

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

ProfessorSearchResultTable.propTypes = {
  keyword: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
};
