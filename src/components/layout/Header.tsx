import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, ChevronRight, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void; // callback para abrir/fechar a sidebar no mobile
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    const routes: Record<string, string> = {
      "/": "Área de Trabalho",
      "/acoes-legais": "Ações Legais",
      "/honorarios": "Honorários",
      "/usuarios": "Usuários",
      "/condominios": "Condomínios",
      "/condominos": "Condôminos",
      "/cadastros/condominios": "Cadastro de Condomínios",
      "/cadastros/condominos": "Cadastro de Condôminos",
      "/cadastros/acoes-legais": "Cadastro de Ações Legais",
    };
    return routes[pathname] || "Página";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Esquerda: Botão menu (mobile) + Título */}
        <div className="flex items-center space-x-3">
          {/* Botão Hamburguer visível só no mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-2 text-text-primary">
            <ChevronRight className="w-4 h-4 hidden sm:block" />
            <h1 className="text-lg font-medium">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
        </div>

        {/* Direita: User info + notificações */}
        <div className="flex items-center space-x-4">
          {/* Notificação */}
          <button className="relative p-2 text-text-primary hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Usuário */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">SS</span>
            </div>
            <span className="text-text-primary font-medium hidden sm:block">
              Stefani Soares
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
