import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginLayout from "../layouts/LoginLayout";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "./ProtectedRoute";

// Pages
import Dashboard from "../pages/Dashboard";
import AcoesLegais from "../pages/AcoesLegais";
import Honorarios from "../pages/Honorarios";
import Usuarios from "../pages/Usuarios";
import Condominios from "../pages/Condominios";
import Condominos from "../pages/Residentes";
import Profile from "../pages/Profile";
import Notificacoes from "../pages/Notificacoes";
import Login from "../pages/auth/Login";
import Cadastro from "../pages/auth/Cadastro";

// Cadastros
import CadastroCondominios from "../pages/cadastros/CadastroCondominios";
import CadastroCondominos from "../pages/cadastros/CadastroResidentes";
import CadastroAcoesLegais from "../pages/cadastros/CadastroAcoesLegais";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas (sem sidebar) */}
        <Route
          path="/login"
          element={
            <LoginLayout>
              <Login />
            </LoginLayout>
          }
        />

        <Route
          path="/cadastro"
          element={
            <AuthLayout>
              <Cadastro />
            </AuthLayout>
          }
        />

        {/* Rotas protegidas (com sidebar) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/acoes-legais"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AcoesLegais />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/honorarios"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Honorarios />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Usuarios />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/condominios"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Condominios />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/condominos"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Condominos />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notificacoes"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Notificacoes />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cadastros/condominios"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CadastroCondominios />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cadastros/condominos"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CadastroCondominos />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cadastros/acoes-legais"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CadastroAcoesLegais />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
