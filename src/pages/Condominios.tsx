import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import { Info, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- DADOS MOCKADOS (Exemplos) ---
const condominiosData = [
  { id: 1, nome: "Condomínio A", cnpj: "XX. XXX. XXX/0001-XX", telefone: "+55 (DDD) XXXX-XXXX", cidade: "Vitória da Conquista" },
  { id: 2, nome: "Condomínio B", cnpj: "XX. XXX. XXX/0001-XX", telefone: "+55 (DDD) XXXX-XXXX", cidade: "Vitória da Conquista" },
  { id: 3, nome: "Condomínio X", cnpj: "XX. XXX. XXX/0001-XX", telefone: "+55 (DDD) XXXX-XXXX", cidade: "Vitória da Conquista" },
  { id: 4, nome: "Condomínio Y", cnpj: "XX. XXX. XXX/0001-XX", telefone: "+55 (DDD) XXXX-XXXX", cidade: "Guanambi" },
  { id: 5, nome: "Condomínio Z", cnpj: "XX. XXX. XXX/0001-XX", telefone: "+55 (DDD) XXXX-XXXX", cidade: "Guanambi" },
];

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const Condominios: React.FC = () => {
  return (
    <PageContainer title="Condomínios">
      {/* Botão Novo Condomínio */}
      <div className="flex justify-end items-center mb-6">
        <Link
          to="/cadastros/condominios" // Rota para o formulário de cadastro
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Condomínio</span>
        </Link>
      </div>

      {/* Barra de filtros responsiva */}
      <div className="bg-background p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Nome"
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="text"
          placeholder="CNPJ"
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="text"
          placeholder="Cidade"
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus-ring-primary/20"
        />
        
        {/* Botões de filtro */}
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
              <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">CNPJ</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Telefone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cidade</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {condominiosData.map((condominio) => (
              <tr key={condominio.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{condominio.nome}</td>
                <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">{condominio.cnpj}</td>
                <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-600">{condominio.telefone}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{condominio.cidade}</td>
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

export default Condominios;