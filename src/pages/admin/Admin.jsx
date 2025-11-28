import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/SideBar';
import NavBar from '@/components/NavBar';
import Body from '@/components/layout/Body';
import PageWrapper from '@/components/layout/PageWrapper';

function Admin() {
  const location = useLocation();

  const baseMenus = [
    {
      title: '학과 관리',
      subItems: [{ label: '학과 목록', path: 'department' }],
    },
    {
      title: '건물 관리',
      subItems: [{ label: '건물 목록', path: 'building' }],
    },
  ];
  const departmentMenus = baseMenus.map((menu) => ({
    ...menu,
    subItems: menu.subItems.map((sub) => ({
      ...sub,
      isSelected: location.pathname.startsWith(`/admin/${sub.path}`),
    })),
  }));

  return (
    <PageWrapper>
      <NavBar />
      <Body>
        <Sidebar menus={departmentMenus} />
        <Outlet />
      </Body>
    </PageWrapper>
  );
}

export default Admin;
