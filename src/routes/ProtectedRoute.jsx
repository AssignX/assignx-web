import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // 로그인 안 되어 있으면 → /login으로 이동
  if (!accessToken) return <Navigate to='/login' replace />;

  // 로그인되어 있으면 → 내부 페이지 렌더링
  return <Outlet />;
}
