import React, { useState } from 'react';
import apiClient from '@/api/apiClient';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import InputCell from '@/components/table/cells/InputCell';
import Button from '@/components/buttons/Button';

export default function LoginPage() {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await apiClient.post('/api/auth/login', {
        idNumber,
        password,
      });
      login(data);
      console.log('[DEBUG] login response:', data);
      navigate('/office/classrooms');
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className='flex h-screen items-center justify-center bg-gray-50'>
      <div className='w-[320px] rounded-xl bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-center text-lg font-semibold'>로그인</h2>

        <InputCell
          label='학번(ID)'
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        <InputCell
          label='비밀번호'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}

        <Button text='로그인' onClick={handleLogin} className='mt-4 w-full' />
      </div>
    </div>
  );
}
