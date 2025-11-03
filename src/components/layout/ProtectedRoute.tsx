import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Função que checa sessão no backend
async function checkSession() {
  try {
    const res = await fetch('http://localhost:5000/user/session', {
      method: 'GET',
      credentials: 'include', // envia cookies HttpOnly automaticamente
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user; // { id, email, adm }
  } catch (err) {
    return null;
  }
}

function ProtectedRoute({ requireAdmin = false }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function verify() {
      const currentUser = await checkSession();
      setUser(currentUser);
      setLoading(false);
    }
    verify();
  }, []);

  if (loading) return <div>Carregando...</div>; // opcional, enquanto checa a sessão
  if (!user) return <Navigate to="/login" />; // não autenticado
  if (requireAdmin && !user.adm) return <Navigate to="/login" />; // precisa ser admin

  return <Outlet />; // libera a rota
}

export default ProtectedRoute;
