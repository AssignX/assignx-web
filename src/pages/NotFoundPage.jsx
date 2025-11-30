import Button from '@/components/buttons/Button';
import { useAuthStore } from '@/store/useAuthStore';

export default function NotFoundPage() {
  const role = useAuthStore((state) => state.role);

  const handleGoHome = () => {
    if (role === 'ADMIN') {
      window.location.href = '/admin';
    } else if (role === 'PROFESSOR') {
      window.location.href = '/professor';
    } else if (role === 'OFFICE') {
      window.location.href = '/office';
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-4 bg-white'>
      <div className='mb-8 text-[60px] font-bold text-gray-800'>
        404 NOT FOUND
      </div>
      <div className='mb-8 text-[20px] text-gray-600'>
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
      </div>
      <Button text='홈으로 돌아가기' color='red' onClick={handleGoHome} />
    </div>
  );
}
