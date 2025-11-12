import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import NavBar from '@/components/NavBar';
import Body from '@/components/common/Body';
import PageWrapper from '@/components/common/PageWrapper';

function Professor() {
  const professorMenus = [
    {
      title: '강의 조회',
      subItems: [{ label: '시간표 조회', path: 'subject', isSelected: true }],
    },
    {
      title: '시험 신청',
      subItems: [
        { label: '1차 시험 신청', path: 'first', isSelected: false },
        { label: '2차 시험 신청', path: 'second', isSelected: false },
        { label: '신청 현황 조회', path: 'status', isSelected: false },
      ],
    },
  ];

  return (
    <PageWrapper>
      <NavBar />
      <Body>
        <Sidebar menus={professorMenus} />
        <Outlet />
      </Body>
    </PageWrapper>
  );
}

export default Professor;
