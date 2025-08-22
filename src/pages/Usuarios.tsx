import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import { Info, Trash2, Mail, Shield, Clock } from 'lucide-react';
import DetailsPopup, { DetailItem } from '../components/ui/DetailsPopup'; // 1. IMPORTAR

// --- INTERFACE E DADOS MOCKADOS ATUALIZADOS ---
interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
  cadastradoEm: string;
  permissoes: string;
  ultimaAtualizacao: string;
}

const advogadosData: User[] = [
  { id: 1, nome: "João Silva", email: "joao.silva@email.com", role: "Advogado Sênior", cadastradoEm: "20/07/2025", permissoes: "Cadastrar Ações, Editar Ações", ultimaAtualizacao: "20/07/2025" },
  { id: 2, nome: "Maria Oliveira", email: "maria.oliveira@email.com", role: "Advogada Júnior", cadastradoEm: "20/07/2025", permissoes: "Ler Ações", ultimaAtualizacao: "20/07/2025" },
];

const financeiroData: User[] = [
  { id: 3, nome: "Lucas Andrade", email: "lucas.andrade@email.com", role: "Analista Financeiro", cadastradoEm: "20/07/2025", permissoes: "Editar honorários", ultimaAtualizacao: "20/07/2025" },
  { id: 4, nome: "Camila Rocha", email: "camila.rocha@email.com", role: "Assistente Financeiro", cadastradoEm: "20/07/2025", permissoes: "Excluir honorários", ultimaAtualizacao: "20/07/2025" },
];

const administradoresData: User[] = [
  { id: 5, nome: "Stéfani Freire", email: "stefani.freire@email.com", role: "Sócio Administrador", cadastradoEm: "20/07/2025", permissoes: "Todas", ultimaAtualizacao: "20/07/2025" },
];

// Combina todos os usuários em um único array para facilitar a busca
const allUsers = [...advogadosData, ...financeiroData, ...administradoresData];

// --- COMPONENTE REUTILIZÁVEL DA TABELA (MODIFICADO) ---
// Agora aceita uma função onOpenPopup como propriedade
interface UserTableProps {
  title: string;
  users: User[];
  onOpenPopup: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ title, users, onOpenPopup }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-text-secondary mb-4">{title}</h2>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-background">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Cadastrado em</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Permissões</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Última atualização</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{user.nome}</td>
                <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">{user.cadastradoEm}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{user.permissoes}</td>
                <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-600">{user.ultimaAtualizacao}</td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  <div className="flex items-center justify-center space-x-3">
                    <button 
                        onClick={() => onOpenPopup(user.id)} // 3. CHAMA A FUNÇÃO DO PAI
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const Usuarios: React.FC = () => {
    // 2. ESTADO E FUNÇÕES DE CONTROLE NO COMPONENTE PAI
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState<DetailItem[]>([]);
    const [popupTitle, setPopupTitle] = useState('');

    const handleOpenPopup = (id: number) => {
        const user = allUsers.find(u => u.id === id);
        if (user) {
            setPopupTitle(user.nome);
            const detailsList: DetailItem[] = [
                { icon: <Mail />, label: 'Email', value: user.email },
                { icon: <Shield />, label: 'Cargo', value: user.role },
                { icon: <Clock />, label: 'Usuário desde', value: user.cadastradoEm },
                { icon: <Clock />, label: 'Última Atualização', value: user.ultimaAtualizacao },
                { label: 'Permissões Concedidas', value: user.permissoes, isFullWidth: true },
            ];
            setSelectedDetails(detailsList);
            setIsPopupOpen(true);
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedDetails([]);
        setPopupTitle('');
    };

  return (
    <div className="relative">
        <PageContainer title="Usuários">
        <div className="space-y-10">
            {/* Passando a função handleOpenPopup para cada tabela */}
            <UserTable title="Advogados" users={advogadosData} onOpenPopup={handleOpenPopup} />
            <UserTable title="Financeiro" users={financeiroData} onOpenPopup={handleOpenPopup} />
            <UserTable title="Administradores" users={administradoresData} onOpenPopup={handleOpenPopup} />
        </div>
        </PageContainer>
        
        {/* 4. RENDERIZAR O POPUP */}
        <DetailsPopup 
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
            title={popupTitle}
            details={selectedDetails}
        />
    </div>
  );
};

export default Usuarios;