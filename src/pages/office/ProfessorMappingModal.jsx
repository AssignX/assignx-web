import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/modal/Modal';
import PageHeader from '@/components/headers/PageHeader';
import HorizontalTable from '@/components/table/HorizontalTable';
import ProfessorMappingTable from './ProfessorMappingTable';
import apiClient from '@/api/apiClient';

export default function ProfessorMappingModal({
  isOpen,
  onClose,
  onSelect,
  metaInfo = {},
}) {
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  const tableItems = useMemo(
    () => [
      {
        id: 'year',
        label: '개설학기',
        content: metaInfo.year || '',
        labelWidth: '120px',
        contentWidth: '150px',
      },
      {
        id: 'course-code',
        label: '강좌번호',
        content: metaInfo.courseCode || '',
        labelWidth: '120px',
        contentWidth: '150px',
      },
      {
        id: 'course-name',
        label: '교과목명',
        content: metaInfo.courseName || '',
        labelWidth: '120px',
        contentWidth: '200px',
      },
      {
        id: 'professor',
        label: '담당교수',
        content: metaInfo.professorName || '',
        labelWidth: '120px',
        contentWidth: '150px',
      },
    ],
    [metaInfo]
  );

  useEffect(() => {
    if (!isOpen) {
      setSelectedProfessor(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRowSelect = (prof) => setSelectedProfessor(prof);

  const handleConfirm = async () => {
    if (!selectedProfessor) {
      alert('교수를 선택하세요.');
      return;
    }

    try {
      await apiClient.post('/api/course/map', {
        courseId: metaInfo.courseId,
        professorId: selectedProfessor.id,
      });

      alert('담당 교수 배정이 완료되었습니다.');

      onSelect(selectedProfessor);
      onClose();
    } catch (err) {
      console.error('교수 매핑 실패:', err);
      alert('매핑 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => onClose();

  const content = (
    <div className='flex flex-col gap-3 text-sm'>
      <PageHeader title='담당 교수 배정' />
      <HorizontalTable items={tableItems} />
      <ProfessorMappingTable
        keyword={metaInfo.professorName || ''}
        onSelect={handleRowSelect}
      />
    </div>
  );

  return (
    <Modal
      title='담당 교수 배정'
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

ProfessorMappingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  metaInfo: PropTypes.shape({
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    courseCode: PropTypes.string,
    courseId: PropTypes.number,
    courseName: PropTypes.string,
    professorName: PropTypes.string,
  }),
};
