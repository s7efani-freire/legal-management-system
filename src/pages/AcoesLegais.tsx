import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import PageContainer from "../components/ui/PageContainer";
import { Plus, Info, Trash2, Clock, FileText, UserCircle2 } from "lucide-react"; // Ícones para os detalhes
import DetailsPopup, { DetailItem } from "../components/ui/DetailsPopup"; // Importar a interface DetailItem

// --- DEFINIÇÃO DE TIPO E DADOS MOCKADOS ---
interface AcaoLegal {
  id: number;
  acao: string;
  criadoEm: string;
  responsavel: string;
  tipo: 'Judicial' | 'Extra-Judicial';
  numeroProcesso: string;
  descricao: string;
}

const dados: AcaoLegal[] = [
  { id: 1, acao: "Cobrança de Inadimplentes - Unidade 101", criadoEm: "20/07/2025", responsavel: "Dr. Dias", tipo: "Judicial", numeroProcesso: "0123-45.2025.01", descricao: "Ação movida para cobrança de três meses de condomínio em atraso."},
  { id: 2, acao: "Notificação de Barulho - Unidade 503", criadoEm: "22/07/2025", responsavel: "Dr. Nunes", tipo: "Extra-Judicial", numeroProcesso: "N/A", descricao: "Notificação enviada devido a reclamações recorrentes de barulho após o horário permitido."},
  { id: 3, acao: "Revisão de Contrato - Elevadores", criadoEm: "25/07/2025", responsavel: "Dr. Dias", tipo: "Extra-Judicial", numeroProcesso: "N/A", descricao: "Análise e revisão do contrato de manutenção com a empresa de elevadores." },
  { id: 4, acao: "Ação de Reparação - Infiltração", criadoEm: "28/07/2025", responsavel: "Dr. Dias", tipo: "Judicial", numeroProcesso: "0567-89.2025.02", descricao: "Ação contra a construtora para reparo de infiltração na garagem."},
  { id: 5, acao: "Mediação de Conflito - Vagas", criadoEm: "30/07/2025", responsavel: "Dr. Nunes", tipo: "Extra-Judicial", numeroProcesso: "N/A", descricao: "Mediação entre os moradores das unidades 301 e 302 sobre o uso indevido da vaga de garagem."},
];

const AcoesLegais: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // --- ESTADO CORRIGIDO ---
  const [selectedDetails, setSelectedDetails] = useState<DetailItem[]>([]);
  const [popupTitle, setPopupTitle] = useState('');
  
  const location = useLocation();

  const handleOpenPopup = (id: number) => {
    const acao = dados.find(item => item.id === id);
    if (acao) {
      // --- LÓGICA CORRIGIDA ---
      // Monta o título e a lista de detalhes para o popup genérico
      setPopupTitle(acao.acao);
      const detailsList: DetailItem[] = [
        { icon: <FileText />, label: 'Tipo de Ação', value: acao.tipo },
        { icon: <UserCircle2 />, label: 'Responsável', value: acao.responsavel },
        { icon: <FileText />, label: 'Nº do Processo', value: acao.numeroProcesso },
        { icon: <Clock />, label: 'Criado em', value: acao.criadoEm },
        { label: 'Descrição', value: acao.descricao, isFullWidth: true }, // Detalhe de largura total
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
  
  useEffect(() => {
    const state = location.state as { openPopupWithId?: number };
    const idToOpen = state?.openPopupWithId;
    if (idToOpen) {
      handleOpenPopup(idToOpen);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="relative">
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

        {/* Barra de filtros */}
        <div className="bg-gray-100 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 items-center mb-6">
          <input type="text" placeholder="Condomínio" className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20" />
          <input type="text" placeholder="Condômino" className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20" />
          <input type="date" placeholder="Data" className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20" />
          <input type="text" placeholder="Responsável" className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20" />
          <select className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20">
            <option value="">Tipo de Ação</option>
            <option value="judicial">Judicial</option>
            <option value="extrajudicial">Extrajudicial</option>
          </select>
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
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ação Legal</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Criado em</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Responsável</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{item.acao}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-700">{item.criadoEm}</td>
                  <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-700">{item.responsavel}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.tipo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex items-center justify-center space-x-3">
                      <button 
                        onClick={() => handleOpenPopup(item.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
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
      
      {/* --- CHAMADA DO POPUP --- */}
      <DetailsPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={popupTitle}
        details={selectedDetails}
      />
    </div>
  );
};

export default AcoesLegais;