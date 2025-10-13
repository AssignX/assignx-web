// src/components/office/Layout.jsx
import React from 'react';
import PropTypes from 'prop-types';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';

/**
 * 공용 페이지 레이아웃
 * NavBar + SideBar + 본문(children) 구조
 */
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
        <main className='flex-1 p-5'>{children}</main>
      </div>
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
  onLogout: PropTypes.func,
  children: PropTypes.node,
};

Layout.defaultProps = {
  username: '관리자',
  headerTitle: '기본 메뉴',
  menus: [],
  onLogout: () => alert('로그아웃 되었습니다.'),
};
