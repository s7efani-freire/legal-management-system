import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import { Clock, AlertTriangle, FileCheck, Bell, CheckCheck } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";

// --- DEFINIÇÃO DE TIPO E DADOS MOCKADOS ---
interface Notification {
  id: number;
  type: 'deadline' | 'assignment' | 'completed';
  message: string;
  time: string;
  read: boolean;
    linkTo: string; 
  relatedId: number;
}

const allNotificationsData: Notification[] = [
  { id: 1, type: 'deadline', message: 'Prazo da Ação Condomínio X está expirando em 3 dias.', time: '5 min atrás', read: false, linkTo: '/acoes-legais', relatedId: 2  },
  { id: 2, type: 'assignment', message: 'Você foi atribuído à nova demanda do Condomínio Y.', time: '2 horas atrás', read: false, linkTo: '/acoes-legais', relatedId: 4 },
  { id: 3, type: 'completed', message: 'Ação do Condomínio Z foi marcada como concluída.', time: '1 dia atrás', read: true, linkTo: '/acoes-legais', relatedId: 3 },
  { id: 4, type: 'deadline', message: 'Prazo da Ação Condomínio A está expirando hoje.', time: '2 dias atrás', read: true, linkTo: '/acoes-legais', relatedId: 1 },
  { id: 5, type: 'assignment', message: 'Nova tarefa "Revisar contrato" adicionada ao seu Kanban.', time: '3 dias atrás', read: false, linkTo: '/acoes-legais', relatedId: 5 },
  { id: 6, type: 'completed', message: 'O pagamento dos honorários de Julho foi confirmado.', time: '4 dias atrás', read: true, linkTo: '/acoes-legais', relatedId: 6 },
];

const NotificationItem: React.FC<{ notification: Notification; onToggleRead: (id: number) => void }> = ({ notification, onToggleRead }) => {
    const getNotificationIcon = (type: string) => {
        switch(type) {
            case 'deadline': return <AlertTriangle className="w-6 h-6 text-red-500" />;
            case 'assignment': return <FileCheck className="w-6 h-6 text-blue-500" />;
            case 'completed': return <FileCheck className="w-6 h-6 text-green-500" />;
            default: return <Bell className="w-6 h-6 text-gray-500" />;
        }
    }

return (
    <div className={`flex items-start gap-4 border-b last:border-b-0 ${!notification.read ? 'bg-accent/40' : 'bg-white'}`}>
        <Link 
            to={notification.linkTo}
            state={{ openPopupWithId: notification.relatedId }}
            className="flex items-start gap-4 p-4 flex-grow"
        >
            <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
            <div className="flex-grow">
                <p className="text-text-primary">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {notification.time}
                </p>
            </div>
        </Link>
        <div className="flex-shrink-0 p-4">
            <button 
                onClick={() => onToggleRead(notification.id)}
                title={notification.read ? 'Marcar como não lida' : 'Marcar como lida'}
                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full"
            >
                <CheckCheck className="w-5 h-5" />
            </button>
        </div>
    </div>
)
}

const Notificacoes: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(allNotificationsData);
    const [filter, setFilter] = useState<'todas' | 'nao-lidas'>('todas');

    const handleToggleRead = (id: number) => {
        setNotifications(
            notifications.map(n => n.id === id ? { ...n, read: !n.read } : n)
        );
    };
    
    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({...n, read: true})));
    }

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'nao-lidas') return !n.read;
        return true;
    });
  
  return (
    <PageContainer title="Todas as Notificações">
      <div className="bg-white rounded-lg shadow-sm border border-accent">
        {/* Cabeçalho com Filtros e Ações */}
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg p-1">
                <button 
                    onClick={() => setFilter('todas')}
                    className={`px-4 py-1.5 text-sm rounded-md ${filter === 'todas' ? 'bg-primary text-white' : 'text-text-primary hover:bg-gray-100'}`}
                >
                    Todas
                </button>
                <button 
                    onClick={() => setFilter('nao-lidas')}
                    className={`px-4 py-1.5 text-sm rounded-md ${filter === 'nao-lidas' ? 'bg-primary text-white' : 'text-text-primary hover:bg-gray-100'}`}
                >
                    Não Lidas
                </button>
            </div>
            <button 
                onClick={markAllAsRead}
                className="text-sm font-medium text-primary hover:underline"
            >
                Marcar todas como lidas
            </button>
        </div>
        {/* Lista de Notificações */}
        <div>
            {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} onToggleRead={handleToggleRead} />
                ))
            ) : (
                <div className="text-center p-12 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="font-semibold">Nenhuma notificação encontrada</h3>
                    <p className="text-sm">Você não tem notificações {filter === 'nao-lidas' ? 'não lidas' : ''} no momento.</p>
                </div>
            )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Notificacoes;