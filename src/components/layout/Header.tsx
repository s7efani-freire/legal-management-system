import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = (pathname: string) => {
    const routes: Record<string, string> = {
      '/': 'Área de Trabalho',
      '/acoes-legais': 'Ações Legais',
      '/honorarios': 'Honorários',
      '/usuarios': 'Usuários',
      '/condominios': 'Condomínios',
      '/condominos': 'Condôminos',
      '/cadastros/condominios': 'Cadastro de Condomínios',
      '/cadastros/condominos': 'Cadastro de Condôminos',
      '/cadastros/acoes-legais': 'Cadastro de Ações Legais',
    };
    return routes[pathname] || 'Página';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-text-primary">
          <ChevronRight className="w-4 h-4" />
          <h1 className="text-lg font-medium">{getPageTitle(location.pathname)}</h1>
        </div>

        {/* User info and notifications */}
        <div className="flex items-center space-x-4">
          {/* Notification bell */}
          <button className="relative p-2 text-text-primary hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">SS</span>
            </div>
            <span className="text-text-primary font-medium">Stefani Soares</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;