import HorizontalTable from '../HorizontalTable';

export default function Prof1stExamTable() {
  const allItemsInOneRow = [
    {
      id: 'year',
      label: '개설연도',
      labelWidth: '120px',
      contentWidth: '180px',
      required: true,
      content: '2025',
    },
    {
      id: 'semester',
      label: '개설학기',
      labelWidth: '120px',
      contentWidth: '180px',
      required: true,
      content: '2학기',
    },
    {
      id: 'department',
      label: '소속학과',
      labelWidth: '120px',
      contentWidth: '300px',
      content: 'IT대학 컴퓨터학부',
    },
    {
      id: 'studentId',
      label: '학번',
      labelWidth: '120px',
      contentWidth: '180px',
      required: true,
      content: '95-120392',
    },
    {
      id: 'name',
      label: '이름',
      labelWidth: '120px',
      contentWidth: '180px',
      required: true,
      content: '교수1',
    },
  ];

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>1차 시험 정보</h1>
      <HorizontalTable items={allItemsInOneRow} />
    </div>
  );
}
