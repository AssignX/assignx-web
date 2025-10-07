import React from 'react';
import Logo from '@/assets/bar/logo.png';
import PropTypes from 'prop-types';

export default function NavBar({ username = '사용자님', onLogout }) {
  return (
    <header className='flex h-[80px] w-full items-center justify-between border border-[var(--color-gnb-border)] bg-[var(--color-white)] px-10'>
      <div className='flex h-fit w-fit items-center gap-2'>
        <img src={Logo} alt='Logo' className='h-7 w-auto' />
        <span className='text-[18px] font-bold text-[var(--color-text-main)]'>
          시험 신청 서비스
        </span>
      </div>
      <div className='flex-1' />
      <div className='flex items-center gap-[21px]'>
        <span className='text-[13px] font-normal text-[var(--color-text-main)]'>
          {username}
        </span>
        <button
          onClick={onLogout ? onLogout : undefined}
          className='cursor-pointer text-[13px] font-normal text-[var(--color-text-main)] hover:underline'
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}

NavBar.propTypes = {
  username: PropTypes.string, // 사용자 이름
  onLogout: PropTypes.func, // 로그아웃 클릭 핸들러
};
