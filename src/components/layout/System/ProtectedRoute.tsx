import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth.Hook';

interface ProtectedRouteProps {
  element: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { checkAuth } = useAuth();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const logged = await checkAuth();
      setIsAuth(logged);
    })();
  }, []);

  if (isAuth === null) return <div>Carregando...</div>; 

  if (!isAuth && localStorage.getItem('isAuthenticated') === 'true') localStorage.removeItem('isAuthenticated');

  return isAuth ? element : <Navigate to="/login" replace />;
};
