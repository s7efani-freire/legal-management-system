import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import { Info, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- DADOS MOCKADOS (Exemplos) ---
const condominosData = [
  { id: 1, nome: "João Silva", cnpjCpf: "XX. XXX. XXX/0001-XX", telefone: "+55 (DDD) XXXX-XXXX", condominio: "Condomínio A" },
  { id: 2, nome: "Maria Oliveira", cnpjCpf: "XX. XXX. XXX/0001-XX", telefone: "+55 (DDD) XXXX-XXXX", condominio: "Condomínio B" },
  { id: 3, nome: "Carlos Ferreira", cnpjCpf: "XX. XXX. XXX/0001-XX", telefone: "+55 (DDD) XXXX-XXXX", condominio: "Condomínio X" },
  { id: 4, nome: "Ana Souza", cnpjCpf: "XX. XXX. XXX/0001-XX", telefone: "+55 (DDD) XXXX-XXXX", condominio: "Condomínio Y" },
  { id: 5, nome: "Pedro Martins", cnpjCpf: "XX. XXX. XXX/0001-XX", telefone: "+55 (DDD) XXXX-XXXX", condominio: "Condomínio Z" },
];

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const Condominos: React.FC = () => {
  return (
    <PageContainer title="Condôminos">
      {/* Botão Novo Condômino - Adicionado para consistência */}
      <div className="flex justify-end items-center mb-6">
        <Link
          to="/cadastros/condominos" // Ajuste a rota conforme necessário
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Condômino</span>
        </Link>
      </div>

      {/* Barra de filtros responsiva com Grid (mesma lógica da pág. de Ações) */}
      <div className="bg-background p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Nome"
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="text"
          placeholder="CNPJ ou CPF"
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="text"
          placeholder="Condomínio"
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
        />
        
        {/* Botões de filtro alinhados à direita em telas grandes */}
        <div className="flex gap-2 sm:col-span-2 lg:col-span-2 justify-end">
          <button className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            Filtrar
          </button>
          <button className="w-full sm:w-auto bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors">
            Limpar
          </button>
        </div>
      </div>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-background">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">CNPJ / CPF</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Telefone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Condomínio</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {condominosData.map((condomino) => (
              <tr key={condomino.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{condomino.nome}</td>
                <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">{condomino.cnpjCpf}</td>
                <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-600">{condomino.telefone}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{condomino.condominio}</td>
                <td className="px-4 py-3 text-sm">
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
    </PageContainer>
  );
};

export default Condominos;