// src/components/office/Layout.jsx
<<<<<<< HEAD
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
import Modal from '@/components/modal/Modal';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api/apiClient';
=======
import React from 'react';
import PropTypes from 'prop-types';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
>>>>>>> d1789de (feat: Add Layout.jsx use on SearchProfessorPage)

/**
 * 공용 페이지 레이아웃
 * NavBar + SideBar + 본문(children) 구조
 */
<<<<<<< HEAD
export default function Layout({ username, headerTitle, menus, children }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      console.warn('서버 로그아웃 실패 (클라이언트만 처리)');
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className='relative min-h-screen bg-[var(--color-background)]'>
      {/* 상단 네비게이션 바 */}
      <NavBar username={username} onLogout={() => setShowLogoutModal(true)} />

      {/* 메인 콘텐츠 영역 */}
      <div className='flex flex-1 gap-5 px-5 py-5'>
        <SideBar headerTitle={headerTitle} menus={menus} />
        <main className='border-border-contents flex-1 border p-5 pt-[40px] pb-[40px]'>
          {children}
        </main>
      </div>

      {/* 공용 Modal 컴포넌트 활용 */}
      {showLogoutModal && (
        <Modal
          title='로그아웃'
          content={<p className='text-[14px]'>정말 로그아웃하시겠습니까?</p>}
          confirmText='확인'
          cancelText='취소'
          onConfirm={() => {
            setShowLogoutModal(false);
            handleLogout();
          }}
          onCancel={() => setShowLogoutModal(false)}
          onClose={() => setShowLogoutModal(false)}
          width='400px'
          height='auto'
        />
      )}
=======
export default function Layout({
  username,
  headerTitle,
  menus,
  onLogout,
  children,
}) {
  return (
    <div className='min-h-screen bg-[var(--color-background)]'>
      {/* 상단 네비게이션 바 */}
      <NavBar username={username} onLogout={onLogout} />

      {/* 메인 콘텐츠 영역 */}
      <div className='flex flex-1 px-5 py-5'>
        {/* 왼쪽 사이드바 */}
        <SideBar headerTitle={headerTitle} menus={menus} />

        {/* 오른쪽 본문 영역 */}
        <main className='flex-1 p-5 pt-[40px] pb-[40px]'>{children}</main>
      </div>
>>>>>>> d1789de (feat: Add Layout.jsx use on SearchProfessorPage)
    </div>
  );
}

Layout.propTypes = {
  username: PropTypes.string,
  headerTitle: PropTypes.string,
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subItems: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
          isSelected: PropTypes.bool,
        })
      ),
    })
  ),
<<<<<<< HEAD
=======
  onLogout: PropTypes.func,
>>>>>>> d1789de (feat: Add Layout.jsx use on SearchProfessorPage)
  children: PropTypes.node,
};

Layout.defaultProps = {
  username: '관리자',
  headerTitle: '기본 메뉴',
  menus: [],
<<<<<<< HEAD
=======
  onLogout: () => alert('로그아웃 되었습니다.'),
>>>>>>> d1789de (feat: Add Layout.jsx use on SearchProfessorPage)
};
