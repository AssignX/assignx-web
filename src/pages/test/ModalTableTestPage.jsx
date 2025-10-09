import { useState } from 'react';
import TableModal from '@/components/modal/TableModal.jsx';
import HorizontalTable from '@/components/table/HorizontalTable.jsx';
import SectionHeader from '@/components/headers/SectionHeader.jsx';
import Button from '@/components/buttons/Button.jsx';
import { SearchCell } from '@/components/table/cells/SearchCell.jsx';
import { SearchIcon } from '@/assets/icons';

export default function ModalTableTestPage() {
  const [isOpen, setIsOpen] = useState(false);

  // 검색 상태
  const [buildingNum, setBuildingNum] = useState('');

  // 검색 핸들러
  const handleBuildingSearch = (searchValue) => {
    setBuildingNum(searchValue);
    if (searchValue) {
      alert(`(시뮬레이션) 모달을 엽니다.\n입력된 초기값: '${searchValue}'`);
    } else {
      alert('(시뮬레이션) 모달을 엽니다 (초기값 없음).');
    }
  };

  // 🔹 테이블 아이템 (SearchCell + 조회 버튼이 같은 셀에 존재)
  const buildingSearchItems = [
    {
      id: 'buildingSearch',
      label: '건물코드/명',
      labelWidth: '130px',
      contentWidth: '500px',
      content: (
        <div className='flex items-center gap-1'>
          {/* SearchCell */}
          <div className='w-[200px]'>
            <SearchCell
              initialValue={buildingNum}
              onSearch={handleBuildingSearch}
            />
          </div>

          {/* 조회 버튼 */}
          <Button
            text='조회'
            color='lightgray'
            textSize='text-sm'
            Icon={SearchIcon}
            onClick={() => alert(`검색 값: ${buildingNum}`)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className='flex h-screen items-center justify-center'>
      <Button text='건물 조회' color='gold' onClick={() => setIsOpen(true)} />

      {isOpen && (
        <TableModal
          title='건물 조회'
          content={
            <div className='flex flex-col gap-4'>
              <SectionHeader title='건물 검색' />
              <div className='border-t border-[var(--color-light-gray)] pt-3'>
                <HorizontalTable items={buildingSearchItems} />
              </div>
            </div>
          }
          confirmText='확인'
          cancelText='취소'
          onConfirm={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
          width
          height
        />
      )}
    </div>
  );
}
