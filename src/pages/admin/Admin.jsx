import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
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
    subItems: menu.subItems.map((sub) => {
      const basePath = `/admin/${sub.path}`;
      const isStatus =
        sub.path === 'department' &&
        (location.pathname === '/admin' ||
          location.pathname.startsWith('/admin/department'));
      return {
        ...sub,
        isSelected: isStatus || location.pathname.startsWith(basePath),
      };
    }),
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
