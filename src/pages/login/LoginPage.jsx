import React, { useState } from 'react';
import apiClient from '@/api/apiClient';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import InputCell from '@/components/table/cells/InputCell';
import Button from '@/components/buttons/Button';
import logo from '@/assets/logo/knu_logo.png';

export default function LoginPage() {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await apiClient.post('/api/auth/login', {
        idNumber,
        password,
      });
      login(data);
      navigate('/office/classrooms');
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className='relative h-screen overflow-hidden bg-[#E6E7EA] px-[30px]'>
      {/* 배경 레이어 */}
      <div className='pointer-events-none absolute inset-0'>
        {/* 좌측 레드 영역 */}
        <div className='absolute top-0 left-0 h-full w-[600px] bg-[var(--color-red)]' />
        {/* 상단 레드 바 */}
        <div className='absolute top-0 left-0 h-[64px] w-[600px] bg-[var(--color-red)]' />
        {/* 하단 레드 바 */}
        <div className='absolute bottom-0 left-0 h-[64px] w-[600px] bg-[var(--color-red)]' />
        {/* 상단 로고(배경 위) */}
        <div className='absolute top-3 left-6 flex items-center gap-3'>
          <img src={logo} alt='KNU' className='h-8' />
        </div>
      </div>

      {/* 큰 컨테이너 */}
      <div className='absolute top-[80px] right-[30px] bottom-[50px] left-[30px] rounded-xl bg-white shadow-[0_8px_12px_rgba(0,0,0,0.16)]'>
        {/* 컨테이너 내부 레이아웃 */}
        <div className='gap-30px flex w-full flex-row px-[40px] py-[50px]'>
          {/* 왼쪽: 로그인 카드 */}
          <div className='flex items-start'>
            <div className='h-[614px] w-[400px] border border-gray-200 bg-white shadow-[0_8px_12px_rgba(0,0,0,0.16)]'>
              {/* 카드 헤더 */}
              <div className='flex items-center justify-between bg-[#7A6A58] px-4 py-3 text-sm font-semibold text-white'>
                <span>KNU AssignX</span>
                <span className='text-xs opacity-50'>ⓒ KNU</span>
              </div>

              {/* 입력 영역 */}
              <div className='flex w-full flex-col gap-[20px] px-[70px] py-[30px]'>
                <div className='flex flex-col gap-[10px]'>
                  <label className='text-[16px] font-medium text-gray-700'>
                    학번
                  </label>
                  <InputCell
                    label='통합정보시스템ID'
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    height={48}
                  />
                </div>
                <div className='flex flex-col gap-[10px]'>
                  <label className='text-[16px] font-medium text-gray-700'>
                    비밀번호
                  </label>
                  <InputCell
                    label='비밀번호'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    height={48}
                  />
                </div>

                {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}

                <Button
                  text='로그인'
                  onClick={handleLogin}
                  className='mt-2 w-full bg-[#A12222] hover:bg-[#8C1D1D]'
                />
              </div>
            </div>
          </div>

          {/* 오른쪽: 내용 영역 박스 */}
          <div className='rounded-md border border-gray-200 bg-white shadow-[0_8px_12px_rgba(0,0,0,0.08)]' />
        </div>
      </div>
    </div>
  );
}
