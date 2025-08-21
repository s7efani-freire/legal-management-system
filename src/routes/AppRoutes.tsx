import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginLayout from '../layouts/LoginLayout';
import AuthLayout from '../layouts/AuthLayout';

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
        {/* Rotas de autenticação */}
        <Route path="/login" element={<LoginLayout><Login /></LoginLayout>} />
        <Route path="/cadastro" element={<AuthLayout><Cadastro /></AuthLayout>} />

        {/* Rotas principais */}
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/acoes-legais" element={<MainLayout><AcoesLegais /></MainLayout>} />
        <Route path="/honorarios" element={<MainLayout><Honorarios /></MainLayout>} />
        <Route path="/usuarios" element={<MainLayout><Usuarios /></MainLayout>} />
        <Route path="/condominios" element={<MainLayout><Condominios /></MainLayout>} />
        <Route path="/condominos" element={<MainLayout><Condominos /></MainLayout>} />
        <Route path="/perfil" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/notificacoes" element={<MainLayout><Notificacoes /></MainLayout>} />

        {/* Rotas de cadastros */}
        <Route path="/cadastros/condominios" element={<MainLayout><CadastroCondominios /></MainLayout>} />
        <Route path="/cadastros/condominos" element={<MainLayout><CadastroCondominos /></MainLayout>} />
        <Route path="/cadastros/acoes-legais" element={<MainLayout><CadastroAcoesLegais /></MainLayout>} />

        {/* Redirect para dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;