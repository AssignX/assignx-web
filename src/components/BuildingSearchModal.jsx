import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/modal/Modal';
import PageHeader from '@/components/headers/PageHeader';
import BuildingSearchTable from '@/components/BuildingSearchTable';
import BuildingSearchResultTable from '@/components/BuildingSearchResultTable';

export default function BuildingSearchModal({
  isOpen,
  onClose,
  onSelect,
  initialValue = '',
}) {
  const [searchKeyword, setSearchKeyword] = useState(initialValue);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchKeyword('');
      setSelectedBuilding(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (newKeyword) => {
    setSearchKeyword(newKeyword);
  };

  const handleRowSelect = (building) => {
    setSelectedBuilding(building);
  };

  const handleConfirm = () => {
    if (selectedBuilding) {
      onSelect({
        buildingId: selectedBuilding.id,
        buildingNum: selectedBuilding.buildingNum,
        buildingName: selectedBuilding.buildingName,
      });
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // 모달 본문(content)
  const content = (
    <div className='flex flex-col text-sm'>
      <div className='flex flex-col pb-[10px]'>
        <PageHeader title='건물검색' />
        <BuildingSearchTable
          onSearch={handleSearch}
          initialValue={initialValue}
        />
      </div>
      <BuildingSearchResultTable
        keyword={searchKeyword}
        onSelect={handleRowSelect}
      />
    </div>
  );

  return (
    <Modal
      title='건물 조회'
      content={content}
      confirmText='확인'
      cancelText='취소'
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      onClose={onClose}
      width='900px'
      height='600px'
    />
  );
}

BuildingSearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
};
