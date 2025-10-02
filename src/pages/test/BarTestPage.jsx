import React from 'react';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';

export default function NavBarTest() {
  const menus = [
    {
      title: '열린 메뉴',
      subItems: [
        {
          label: '선택된 서브 메뉴',
          path: '/sub1',
          color: 'var(--color-main)',
        },
      ],
    },
    {
      title: '닫힌 메뉴',
      subItems: [
        {
          label: '서브 메뉴 1',
          path: '/sub2',
          color: 'text-[var(--color-gold)]',
        },
        {
          label: '서브 메뉴 2',
          path: '/sub3',
          color: 'text-[var(--color-main)]',
        },
      ],
    },
  ];

  return (
    <div className='min-h-screen'>
      <NavBar
        username='홍길동'
        onLogout={() => {
          alert('로그아웃 되었습니다!');
          // 추가 로직: 로그아웃 API 호출, 로그인 페이지로 이동. modal 띄어도?
        }}
      />
      <div className='flex flex-1 px-5 py-5'>
        {/* 왼쪽 사이드바 */}
        <SideBar headerTitle='테스트 메뉴' menus={menus} />

        {/* 오른쪽 본문 (지금은 단순 박스) */}
        <div className='flex-1 p-6 px-5 py-10'>
          <h1 className='text-2xl font-bold text-[var(--color-text-main)]'>
            테스트 페이지 본문
          </h1>
          <p className='mt-2 text-[var(--color-text-main)]'>
            사이드바의 메뉴를 클릭하면 페이지 이동(추후 연결) 또는 UI 변화가
            일어날 자리입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
