import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../layouts/MainLayout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Pega o novo estado 'isLoading'

  if (isLoading) {
    // Enquanto o AuthContext verifica, mostra uma tela em branco ou um spinner
    return null; // ou <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    // SÓ DEPOIS de carregar, se não estiver autenticado, redireciona
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, mostra a página
  return <MainLayout>{children}</MainLayout>;
};

export default ProtectedRoute;