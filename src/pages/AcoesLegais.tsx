import React from "react";
import PageContainer from "../components/ui/PageContainer";
import { Scale, Plus, Search, Info, Trash2 } from "lucide-react";

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
    <div className="space-y-6">
      <PageContainer title="Ações Legais">
        {/* Barra de busca + botão */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar ações..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nova Ação</span>
          </button>
        </div>

        {/* Barra de filtros */}
        <div className="bg-gray-100 p-4 rounded-lg flex flex-wrap gap-2 items-center mb-6">
          <input
            type="text"
            placeholder="Condomínio"
            className="px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="text"
            placeholder="Condômino"
            className="px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="text"
            placeholder="Descrição"
            className="px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="date"
            placeholder="Data"
            className="px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="text"
            placeholder="Responsável"
            className="px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="text"
            placeholder="Tipo de Ação"
            className="px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20"
          />

          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            Filtrar
          </button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors">
            Limpar
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 bg-accent/40">
                  Ação Legal
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Criado em
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 bg-accent/40">
                  Responsável
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Tipo de Ação
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 bg-accent/40">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-700 bg-accent/20">
                    {item.acao}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.criadoEm}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 bg-accent/20">
                    {item.responsavel}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.tipo}
                  </td>
                  <td className="px-4 py-3 text-center flex items-center justify-center space-x-3 bg-accent/20">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Info className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </div>
  );
};

export default AcoesLegais;
