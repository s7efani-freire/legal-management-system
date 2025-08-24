import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginLayout from '../layouts/LoginLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Pages
import Dashboard from '../pages/Dashboard';
import AcoesLegais from '../pages/AcoesLegais';
import Honorarios from '../pages/Honorarios';
import Usuarios from '../pages/Usuarios';
import Condominios from '../pages/Condominios';
import Condominos from '../pages/Condominos';
import Profile from '../pages/Profile';
import Notificacoes from '../pages/Notificacoes';
import Login from '../pages/auth/Login';
import Cadastro from '../pages/auth/Cadastro';

// Cadastros
import CadastroCondominios from '../pages/cadastros/CadastroCondominios';
import CadastroCondominos from '../pages/cadastros/CadastroCondominos';
import CadastroAcoesLegais from '../pages/cadastros/CadastroAcoesLegais';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* === ROTAS PÚBLICAS === */}
        <Route path="/login" element={<LoginLayout><Login /></LoginLayout>} />
        <Route path="/cadastro" element={<AuthLayout><Cadastro /></AuthLayout>} />

        {/* === ROTAS PROTEGIDAS === */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/acoes-legais" element={<ProtectedRoute><AcoesLegais /></ProtectedRoute>} />
        <Route path="/honorarios" element={<ProtectedRoute><Honorarios /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
        <Route path="/condominios" element={<ProtectedRoute><Condominios /></ProtectedRoute>} />
        <Route path="/condominos" element={<ProtectedRoute><Condominos /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
        <Route path="/cadastros/condominios" element={<ProtectedRoute><CadastroCondominios /></ProtectedRoute>} />
        <Route path="/cadastros/condominos" element={<ProtectedRoute><CadastroCondominos /></ProtectedRoute>} />
        <Route path="/cadastros/acoes-legais" element={<ProtectedRoute><CadastroAcoesLegais /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;