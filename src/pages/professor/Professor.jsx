import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import NavBar from '@/components/NavBar';
import Body from '@/components/common/Body';
import PageWrapper from '@/components/common/PageWrapper';

function Professor() {
  const location = useLocation();
  const baseMenus = [
    {
      title: '강의 조회',
      subItems: [{ label: '시간표 조회', path: 'subject' }],
    },
    {
      title: '시험 신청',
      subItems: [
        { label: '1차 시험 신청', path: 'first' },
        { label: '2차 시험 신청', path: 'second' },
        { label: '신청 현황 조회', path: 'status' },
      ],
    },
  ];

  const professorMenus = baseMenus.map((menu) => ({
    ...menu,
    subItems: menu.subItems.map((sub) => ({
      ...sub,
      isSelected: location.pathname.startsWith(`/professor/${sub.path}`),
    })),
  }));

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
