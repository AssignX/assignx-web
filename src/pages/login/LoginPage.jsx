import React, { useState } from 'react';
import apiClient from '@/api/apiClient';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import InputCell from '@/components/table/cells/InputCell';
import logo from '@/assets/logo/knu_logo.png';
import mark from '@/assets/logo/knu_mark.png';

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

      switch (data.role) {
        case 'ADMIN':
          navigate('/admin'); // 관리자 페이지 route 설정 필요
          break;
        case 'PROFESSOR':
          navigate('/professor'); // 교수 페이지 route 설정 필요
          break;
        case 'EMPLOYEE':
          navigate('/office/classrooms');
          break;
        default:
          navigate('/');
          break;
      }
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className='relative h-screen bg-[#E6E7EA] px-[30px]'>
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
          <img src={logo} alt='KNU' className='h-[46px]' />
        </div>
      </div>

      {/* 큰 컨테이너 */}
      <div className='absolute top-[80px] right-[30px] bottom-[50px] left-[30px] flex flex-row gap-[30px] rounded-xl bg-white px-[40px] py-[50px] shadow-[0_8px_12px_rgba(0,0,0,0.16)]'>
        {/* 왼쪽: 로그인 카드 */}
        <div className='flex items-start'>
          <div className='w-[400px] border border-gray-200 bg-white shadow-[0_8px_12px_rgba(0,0,0,0.16)]'>
            {/* 카드 헤더 */}
            <div className='flex items-center justify-between bg-[#7A6A58] px-4 py-3 text-[20px] font-semibold text-white'>
              <div className='flex flex-col'>
                <span>ㅡ</span>
                <span>KNU AssignX</span>
              </div>
              <img src={mark} alt='KNU Mark' className='h-[89px] w-[90px]' />
            </div>

            {/* 입력 영역 */}
            <div className='flex w-full flex-col justify-between gap-[20px] px-[20px] py-[30px]'>
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
              <div className='pt-[16px]'>
                <button
                  type='button'
                  onClick={handleLogin}
                  className='h-[48px] w-full rounded-none bg-[var(--color-red)] text-[16px] font-medium text-white transition duration-200 hover:opacity-90'
                >
                  로그인
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 내용 영역 박스 */}
        <div className='flex w-full rounded-md border border-gray-200 bg-white shadow-[0_8px_12px_rgba(0,0,0,0.16)]' />
      </div>
    </div>
  );
}
