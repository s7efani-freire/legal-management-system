import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import { Info, Trash2 } from 'lucide-react';

// --- DADOS MOCKADOS (Exemplos) ---
const advogadosData = [
  { id: 1, nome: "João Silva", cadastradoEm: "20/07/2025", permissoes: "Cadastrar Ações, Editar Ações", ultimaAtualizacao: "20/07/2025" },
  { id: 2, nome: "Maria Oliveira", cadastradoEm: "20/07/2025", permissoes: "Ler Ações", ultimaAtualizacao: "20/07/2025" },
  { id: 3, nome: "Carlos Ferreira", cadastradoEm: "20/07/2025", permissoes: "Cadastrar Ações, Ler Ações", ultimaAtualizacao: "20/07/2025" },
  { id: 4, nome: "Ana Souza", cadastradoEm: "20/07/2025", permissoes: "Excluir Ações", ultimaAtualizacao: "20/07/2025" },
  { id: 5, nome: "Pedro Martins", cadastradoEm: "20/07/2025", permissoes: "Ler Ações, Excluir Ações", ultimaAtualizacao: "20/07/2025" },
];

const financeiroData = [
  { id: 1, nome: "Lucas Andrade", cadastradoEm: "20/07/2025", permissoes: "Editar honorários", ultimaAtualizacao: "20/07/2025" },
  { id: 2, nome: "Camila Rocha", cadastradoEm: "20/07/2025", permissoes: "Excluir honorários", ultimaAtualizacao: "20/07/2025" },
];

const administradoresData = [
  { id: 1, nome: "Lucas Andrade", cadastradoEm: "20/07/2025", permissoes: "Todas", ultimaAtualizacao: "20/07/2025" },
];

// --- INTERFACE PARA OS DADOS (Boa prática com TypeScript) ---
interface User {
  id: number;
  nome: string;
  cadastradoEm: string;
  permissoes: string;
  ultimaAtualizacao: string;
}

interface UserTableProps {
  title: string;
  users: User[];
}

// --- COMPONENTE REUTILIZÁVEL DA TABELA ---
const UserTable: React.FC<UserTableProps> = ({ title, users }) => {
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
                    <button className="text-blue-500 hover:text-blue-700 transition-colors">
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
  return (
    <PageContainer title="Usuários">
      <div className="space-y-10">
        <UserTable title="Advogados" users={advogadosData} />
        <UserTable title="Financeiro" users={financeiroData} />
        <UserTable title="Administradores" users={administradoresData} />
      </div>
    </PageContainer>
  );
};

export default Usuarios;