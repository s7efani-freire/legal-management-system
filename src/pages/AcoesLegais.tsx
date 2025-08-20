import React from "react";
import { Link } from 'react-router-dom';
import PageContainer from "../components/ui/PageContainer";
import { Plus, Info, Trash2 } from "lucide-react";

// Os dados permanecem os mesmos
const dados = [
  {
    id: 1,
    acao: "Ação Condomínio X e Condomínio Y",
    criadoEm: "20/07/2025",
    responsavel: "Advogado Z",
    tipo: "Judicial",
  },
  {
    id: 2,
    acao: "Ação Condomínio X e Condomínio Y",
    criadoEm: "20/07/2025",
    responsavel: "Advogado Z",
    tipo: "Extra-Judicial",
  },
  {

    id: 3,
    acao: "Ação Condomínio X e Condomínio Y",
    criadoEm: "20/07/2025",
    responsavel: "Advogado Z",
    tipo: "Judicial",

  },

  {

    id: 4,
    acao: "Ação Condomínio X e Condomínio Y",
    criadoEm: "20/07/2025",
    responsavel: "Advogado Z",
    tipo: "Extra-Judicial",

  },

  {

    id: 5,
    acao: "Ação Condomínio X e Condomínio Y",
    criadoEm: "20/07/2025",
    responsavel: "Advogado Z",
    tipo: "Judicial",
  },
];

const AcoesLegais: React.FC = () => {
  return (
    // Removido o div extra, PageContainer já serve como container principal
    <PageContainer title="Ações Legais">
      {/* Botão Nova Ação */}
      <div className="flex justify-end items-center mb-6">
        <Link
          to="/cadastros/acoes-legais"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Ação</span>
        </Link>
      </div>

 {/* Barra de filtros responsiva com Grid */}
      <div className="bg-gray-100 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 items-center mb-6">
        {/* Os 5 campos de input/select continuam os mesmos */}
        <input
          type="text"
          placeholder="Condomínio"
          className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="text"
          placeholder="Condômino"
          className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="date"
          placeholder="Data"
          className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="text"
          placeholder="Responsável"
          className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
        />
        <select
          className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Tipo de Ação</option>
          <option value="judicial">Judicial</option>
          <option value="extrajudicial">Extrajudicial</option>
        </select>
        
        {/* Botões de filtro ajustados */}
        <div className="flex gap-2 sm:col-span-2 lg:col-span-2 justify-end">
          <button className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            Filtrar
          </button>
          <button className="w-full sm:w-auto bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors">
            Limpar
          </button>
        </div>
      </div>

      {/* Tabela responsiva */}
      <div className="overflow-x-auto">
        {/* Em telas de desktop, a tabela é exibida normalmente */}
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ação Legal</th>
              {/* Oculta colunas em telas menores */}
              <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Criado em</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Responsável</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm text-gray-700" data-label="Ação Legal:">{item.acao}</td>
                <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-700" data-label="Criado em:">{item.criadoEm}</td>
                <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-700" data-label="Responsável:">{item.responsavel}</td>
                <td className="px-4 py-3 text-sm text-gray-700" data-label="Tipo:">{item.tipo}</td>
                <td className="px-4 py-3 text-sm text-gray-700" data-label="Ações:">
                  <div className="flex items-center justify-center space-x-3">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Info className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
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

export default AcoesLegais;