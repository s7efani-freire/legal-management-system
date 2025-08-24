import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronRight, Menu, Clock, AlertTriangle, FileCheck } from "lucide-react";


const notificationsData = [
  { id: 1, type: 'deadline', message: 'Prazo da Ação Condomínio X está expirando em 3 dias.', time: '5 min atrás', read: false, linkTo: '/acoes-legais', relatedId: 2  },
  { id: 2, type: 'assignment', message: 'Você foi atribuído à nova demanda do Condomínio Y.', time: '2 horas atrás', read: false, linkTo: '/acoes-legais', relatedId: 4 },
  { id: 3, type: 'completed', message: 'Ação do Condomínio Z foi marcada como concluída.', time: '1 dia atrás', read: true, linkTo: '/acoes-legais', relatedId: 3 },
  { id: 4, type: 'deadline', message: 'Prazo da Ação Condomínio A está expirando hoje.', time: '2 dias atrás', read: true, linkTo: '/acoes-legais', relatedId: 1 },
  { id: 5, type: 'assignment', message: 'Nova tarefa "Revisar contrato" adicionada ao seu Kanban.', time: '3 dias atrás', read: false, linkTo: '/acoes-legais', relatedId: 5 },
  { id: 6, type: 'completed', message: 'O pagamento dos honorários de Julho foi confirmado.', time: '4 dias atrás', read: true, linkTo: '/acoes-legais', relatedId: 6 },
];


const NotificationsDropdown = () => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'assignment': return <FileCheck className="w-5 h-5 text-blue-500" />;
      case 'completed': return <FileCheck className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-text-secondary">Notificações</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notificationsData.map(notification => (
          <Link
            key={notification.id}
            to={notification.linkTo}
            state={{ openPopupWithId: notification.relatedId }} 
            className="flex items-start gap-4 p-4 hover:bg-gray-50 border-b last:border-b-0"
          >
            {/* O conteúdo do item da notificação (ícone, texto, etc.) continua o mesmo */}
            {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>}
            <div className={`flex-shrink-0 ${notification.read ? 'ml-4' : ''}`}>
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-grow">
              <p className="text-sm text-text-primary">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {notification.time}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="p-2 bg-gray-50 text-center">
        <Link to="/notificacoes" className="text-sm font-medium text-primary hover:underline">
          Ver todas as notificações
        </Link>
      </div>
    </div>
  )
}


const Header: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const getPageTitle = (pathname: string) => {
    
    const routes: Record<string, string> = {
      "/": "Área de Trabalho", "/acoes-legais": "Ações Legais", "/honorarios": "Honorários",
      "/usuarios": "Usuários", "/condominios": "Condomínios", "/condominos": "Condôminos",
      "/perfil": "Meu Perfil", "/cadastros/condominios": "Cadastro de Condomínios",
      "/cadastros/condominos": "Cadastro de Condôminos", "/cadastros/acoes-legais": "Cadastro de Ações Legais",
    };
    return routes[pathname] || "Página";
  };

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsRef]);

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Esquerda: Botão menu (mobile) + Título */}
        <div className="flex items-center space-x-3">
          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={onMenuClick}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2 text-text-primary">
            <ChevronRight className="w-4 h-4 hidden sm:block" />
            <h1 className="text-lg font-medium">{getPageTitle(location.pathname)}</h1>
          </div>
        </div>

        {/* Direita: User info + notificações */}
        <div className="flex items-center space-x-4">

          {/* Container de Notificação */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {/* O ponto vermelho só aparece se houver notificações não lidas */}
              {notificationsData.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            {isNotificationsOpen && <NotificationsDropdown />}
          </div>

          {/* Usuário com link para o perfil */}
          <Link to="/perfil" className="flex items-center space-x-3 cursor-pointer p-1 rounded-lg hover:bg-gray-100">
            <img src="/user.png" alt="Foto do usuário" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-text-primary font-medium hidden sm:block">
              Stéfani Freire
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;