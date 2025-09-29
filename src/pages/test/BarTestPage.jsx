import React from 'react';
import NavBar from '@/components/NavBar';

export default function NavBarTest() {
  return (
    <div className='min-h-screen'>
      <NavBar
        username='홍길동'
        onLogout={() => {
          alert('로그아웃 되었습니다!');
          // 추가 로직: 로그아웃 API 호출, 로그인 페이지로 이동. modal 띄어도?
        }}
      />
    </div>
  );
}
