import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import NavBar from '@/components/NavBar';
import Body from '@/components/common/Body';
import PageWrapper from '@/components/common/PageWrapper';

function Admin() {
  const departmentMenus = [
    {
      title: '학과 관리',
      subItems: [{ label: '학과 목록', path: 'department', isSelected: true }],
    },
    {
      title: '건물 관리',
      subItems: [{ label: '건물 목록', path: 'building', isSelected: false }],
    },
  ];

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
