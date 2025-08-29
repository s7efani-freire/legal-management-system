import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import PageContainer from "../components/ui/PageContainer";
import { Plus, Info, Trash2, Edit, Clock, FileText, UserCircle2, User, Landmark, ShieldCheck, X, Calendar, DollarSign, AlertTriangle, Archive, Handshake, FileCheck, Scissors, Gavel, MessageSquare, BarChart } from "lucide-react";
import DetailsPopup, { DetailItem } from "../components/ui/DetailsPopup";
import EditActionPopup from "../components/ui/EditActionPopup";

export interface Andamento {
  data: string;
  contato: string;
  usuario: string;
  obs: string;
}

export interface AcaoLegal {
  id: number;
  acao: string;
  tipo: 'Judicial' | 'Extra-Judicial';
  numeroProcesso: string;
  descricao: string;
  condominioCliente: string;
  parteContraria: string;
  dataInclusao: string;
  usuarioLogado: string;
  debito: number;
  valorOriginal: number;
  vencimento: string;
  ultimaCobranca: string;
  mesesAberto: number;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  statusProcesso: 'ATIVO' | 'ARQUIVADO';
  statusCobranca: 'PENDENTE' | 'PAGO' | 'EM_ACORDO';
  cnd: 'NAO' | 'SIM' | 'PENDENTE';
  corte: 'NAO' | 'SIM' | 'SOLICITADO' | 'EXECUTADO';
  protesto: 'NAO' | 'SIM';
  statusAcordo: 'NENHUM' | 'EM_ANDAMENTO' | 'CUMPRIDO' | 'DESCUMPRIDO';
  anotacoes: string;
  andamento?: Andamento[];
}

const AcoesLegais: React.FC = () => {
  
  const [dados, setDados] = useState<AcaoLegal[]>([
    {
      id: 1501,
      acao: "Execução Judicial de Débito - Apto 702",
      tipo: 'Judicial',
      numeroProcesso: "0701234-56.2025.8.05.0001",
      descricao: "Ação judicial para execução de 18 meses de cotas condominiais em atraso.",
      condominioCliente: "Condomínio Villa das Flores",
      parteContraria: "Carlos Eduardo Montenegro",
      dataInclusao: "2025-02-10",
      usuarioLogado: "Ana Paula",
      debito: 14850.75,
      valorOriginal: 12500.00,
      vencimento: "2025-09-15",
      ultimaCobranca: "2025-08-20",
      mesesAberto: 18,
      prioridade: 'ALTA',
      statusProcesso: 'ATIVO',
      statusCobranca: 'PENDENTE',
      cnd: 'PENDENTE',
      corte: 'SOLICITADO',
      protesto: 'SIM',
      statusAcordo: 'NENHUM',
      anotacoes: "Processo em fase de citação do réu. Aguardando retorno do oficial de justiça.",
      andamento: [
        { data: "2025-08-20", contato: "Sistema", usuario: "Ana Paula", obs: "Petição inicial protocolada." },
        { data: "2025-07-15", contato: "Telefone", usuario: "Stefane", obs: "Última tentativa de negociação extrajudicial sem sucesso." }
      ],
    },
    {
      id: 1502,
      acao: "Acordo de Parcelamento - Unidade 1101",
      tipo: 'Extra-Judicial',
      numeroProcesso: "N/A",
      descricao: "Acordo para parcelamento de débitos de 5 meses.",
      condominioCliente: "Edifício Blue Sky",
      parteContraria: "Larissa Mendes",
      dataInclusao: "2025-06-05",
      usuarioLogado: "Carlos",
      debito: 2150.40,
      valorOriginal: 4300.80,
      vencimento: "2025-09-10",
      ultimaCobranca: "2025-08-10",
      mesesAberto: 7,
      prioridade: 'MEDIA',
      statusProcesso: 'ATIVO',
      statusCobranca: 'EM_ACORDO',
      cnd: 'PENDENTE',
      corte: 'NAO',
      protesto: 'NAO',
      statusAcordo: 'EM_ANDAMENTO',
      anotacoes: "Moradora está cumprindo o acordo. Próxima parcela vence em 10/09. Débito atual representa o saldo devedor.",
      andamento: [
        { data: "2025-08-10", contato: "E-mail", usuario: "Carlos", obs: "Pagamento da 2ª de 4 parcelas confirmado." },
        { data: "2025-07-08", contato: "Reunião", usuario: "Carlos", obs: "Termo de acordo assinado pela moradora." }
      ],
    },
    {
      id: 1503,
      acao: "Notificação por Reforma Irregular - Loja 05",
      tipo: 'Extra-Judicial',
      numeroProcesso: "N/A",
      descricao: "Notificação para paralisação de obra na fachada da loja, não aprovada em assembleia.",
      condominioCliente: "Centro Empresarial Vanguard",
      parteContraria: "Global Tech Soluções LTDA",
      dataInclusao: "2025-08-22",
      usuarioLogado: "Mariana",
      debito: 0,
      valorOriginal: 0,
      vencimento: "2025-09-05",
      ultimaCobranca: "2025-08-22",
      mesesAberto: 0,
      prioridade: 'ALTA',
      statusProcesso: 'ATIVO',
      statusCobranca: 'PENDENTE',
      cnd: 'SIM',
      corte: 'NAO',
      protesto: 'NAO',
      statusAcordo: 'NENHUM',
      anotacoes: "Notificação entregue ao gerente da loja. Aguardando regularização no prazo de 15 dias.",
      andamento: [
        { data: "2025-08-22", contato: "Pessoalmente", usuario: "Mariana", obs: "Notificação entregue e protocolada." }
      ],
    },
    {
      id: 1504,
      acao: "Cobrança de Taxa Extra - Unidade 204",
      tipo: 'Extra-Judicial',
      numeroProcesso: "N/A",
      descricao: "Cobrança referente à última parcela da taxa extra para reforma do salão de festas.",
      condominioCliente: "Condomínio Residencial Solaris",
      parteContraria: "Ricardo Faria",
      dataInclusao: "2025-05-15",
      usuarioLogado: "Stefane",
      debito: 0,
      valorOriginal: 350.00,
      vencimento: "2025-07-10",
      ultimaCobranca: "2025-06-25",
      mesesAberto: 2,
      prioridade: 'BAIXA',
      statusProcesso: 'ARQUIVADO',
      statusCobranca: 'PAGO',
      cnd: 'SIM',
      corte: 'NAO',
      protesto: 'NAO',
      statusAcordo: 'CUMPRIDO',
      anotacoes: "Débito quitado integralmente em 30/07/2025. Caso finalizado.",
      andamento: [
        { data: "2025-07-30", contato: "Sistema", usuario: "Stefane", obs: "Pagamento identificado. Baixa no sistema." }
      ],
    },
    {
      id: 1505,
      acao: "Cobrança Simples - Apto 301",
      tipo: 'Extra-Judicial',
      numeroProcesso: "N/A",
      descricao: "Cobrança de 2 meses de condomínio.",
      condominioCliente: "Residencial Morada do Sol",
      parteContraria: "Beatriz Nogueira",
      dataInclusao: "2025-08-01",
      usuarioLogado: "Carlos",
      debito: 1150.22,
      valorOriginal: 1080.00,
      vencimento: "2025-09-05",
      ultimaCobranca: "2025-08-25",
      mesesAberto: 2,
      prioridade: 'MEDIA',
      statusProcesso: 'ATIVO',
      statusCobranca: 'PENDENTE',
      cnd: 'PENDENTE',
      corte: 'NAO',
      protesto: 'NAO',
      statusAcordo: 'NENHUM',
      anotacoes: "Moradora informou por e-mail que realizará o pagamento até o vencimento do boleto atualizado.",
      andamento: [],
    },
    {
      id: 1506,
      acao: "Advertência por Barulho Excessivo - Unidade 909",
      tipo: 'Extra-Judicial',
      numeroProcesso: "N/A",
      descricao: "Segunda notificação por barulho excessivo após as 22h, conforme livro de ocorrências.",
      condominioCliente: "Edifício Blue Sky",
      parteContraria: "Felipe Bastos",
      dataInclusao: "2025-08-28",
      usuarioLogado: "Mariana",
      debito: 0,
      valorOriginal: 0,
      vencimento: "N/A",
      ultimaCobranca: "2025-08-28",
      mesesAberto: 0,
      prioridade: 'BAIXA',
      statusProcesso: 'ATIVO',
      statusCobranca: 'PENDENTE',
      cnd: 'SIM',
      corte: 'NAO',
      protesto: 'NAO',
      statusAcordo: 'NENHUM',
      anotacoes: "Advertência formal enviada. Em caso de reincidência, será aplicada multa.",
      andamento: [],
    },
    {
      id: 1507,
      acao: "Descumprimento de Acordo - Sala 303",
      tipo: 'Extra-Judicial',
      numeroProcesso: "N/A",
      descricao: "Morador não efetuou o pagamento da 3ª parcela do acordo firmado em maio.",
      condominioCliente: "Centro Empresarial Vanguard",
      parteContraria: "Consultoria Financeira Alfa",
      dataInclusao: "2025-04-20",
      usuarioLogado: "Stefane",
      debito: 3450.00,
      valorOriginal: 5000.00,
      vencimento: "2025-08-10",
      ultimaCobranca: "2025-08-15",
      mesesAberto: 4,
      prioridade: 'ALTA',
      statusProcesso: 'ATIVO',
      statusCobranca: 'PENDENTE',
      cnd: 'PENDENTE',
      corte: 'NAO',
      protesto: 'NAO',
      statusAcordo: 'DESCUMPRIDO',
      anotacoes: "Acordo rompido por falta de pagamento. Próximo passo será o protesto do débito e possível ação judicial.",
      andamento: [
        { data: "2025-08-15", contato: "Telefone", usuario: "Stefane", obs: "Contato sem sucesso. Caixa postal." },
        { data: "2025-08-11", contato: "E-mail", usuario: "Stefane", obs: "Notificação de vencimento da parcela enviada." }
      ],
    },
    {
      id: 1508,
      acao: "Ação de Reparação de Danos - Vazamento",
      tipo: 'Judicial',
      numeroProcesso: "0709876-12.2025.8.05.0146",
      descricao: "Ação movida pelo condomínio contra o Apto 607 por danos causados ao Apto 507 devido a vazamento não reparado.",
      condominioCliente: "Condomínio Plaza",
      parteContraria: "Sérgio Martins",
      dataInclusao: "2025-07-29",
      usuarioLogado: "Ana Paula",
      debito: 7500.00,
      valorOriginal: 7500.00,
      vencimento: "N/A",
      ultimaCobranca: "N/A",
      mesesAberto: 1,
      prioridade: 'MEDIA',
      statusProcesso: 'ATIVO',
      statusCobranca: 'PENDENTE',
      cnd: 'SIM',
      corte: 'NAO',
      protesto: 'NAO',
      statusAcordo: 'NENHUM',
      anotacoes: "Audiência de conciliação agendada para 15/10/2025.",
      andamento: [
        { data: "2025-08-26", contato: "Sistema Judicial", usuario: "Ana Paula", obs: "Juntada do mandado de citação cumprido." }
      ],
    },
    {
      id: 1509,
      acao: "Corte de Gás Solicitado - Unidade 1204",
      tipo: 'Extra-Judicial',
      numeroProcesso: "N/A",
      descricao: "Débito condominial superior a 90 dias. Procedimento de corte de gás iniciado.",
      condominioCliente: "Residencial Morada do Sol",
      parteContraria: "Amanda Costa",
      dataInclusao: "2025-05-02",
      usuarioLogado: "Carlos",
      debito: 2540.18,
      valorOriginal: 2210.50,
      vencimento: "2025-09-01",
      ultimaCobranca: "2025-08-18",
      mesesAberto: 4,
      prioridade: 'ALTA',
      statusProcesso: 'ATIVO',
      statusCobranca: 'PENDENTE',
      cnd: 'PENDENTE',
      corte: 'EXECUTADO',
      protesto: 'SIM',
      statusAcordo: 'NENHUM',
      anotacoes: "Corte de gás efetuado pela concessionária em 25/08. Moradora notificada.",
      andamento: [
          { data: "2025-08-25", contato: "Concessionária", usuario: "Carlos", obs: "Confirmação de execução do corte." },
          { data: "2025-08-18", contato: "Carta com AR", usuario: "Carlos", obs: "Envio de notificação final de corte." }
      ],
    },
    {
      id: 1510,
      acao: "Cobrança de Multa - Uso Indevido Garagem - Apto 505",
      tipo: 'Extra-Judicial',
      numeroProcesso: "N/A",
      descricao: "Aplicação de multa por estacionar em vaga de visitante por mais de 24h.",
      condominioCliente: "Condomínio Plaza",
      parteContraria: "João Gabriel Rocha",
      dataInclusao: "2025-08-29",
      usuarioLogado: "Mariana",
      debito: 180.00,
      valorOriginal: 180.00,
      vencimento: "2025-09-10",
      ultimaCobranca: "2025-08-29",
      mesesAberto: 0,
      prioridade: 'BAIXA',
      statusProcesso: 'ATIVO',
      statusCobranca: 'PENDENTE',
      cnd: 'NAO',
      corte: 'NAO',
      protesto: 'NAO',
      statusAcordo: 'NENHUM',
      anotacoes: "Multa gerada e enviada junto ao boleto condominial de Setembro. Morador notificado via app.",
      andamento: [],
    }
  ]);

  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedAcao, setSelectedAcao] = useState<AcaoLegal | null>(null);
  const [detailsForPopup, setDetailsForPopup] = useState<DetailItem[]>([]);
  const location = useLocation();
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString('pt-BR');
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleOpenDetailsPopup = (id: number) => {
    const acao = dados.find(item => item.id === id);
    if (acao) {
      const detailsList: DetailItem[] = [
        
        { icon: <Landmark size={18}/>, label: 'Cliente', value: acao.condominioCliente },
        { icon: <User size={18}/>, label: 'Condômino', value: acao.parteContraria },
        { icon: <FileText size={18}/>, label: 'Tipo', value: acao.tipo.replace('_', '-') },
        { icon: <FileText size={18}/>, label: 'Nº do Processo', value: acao.numeroProcesso },
        { icon: <UserCircle2 size={18}/>, label: 'Responsável', value: acao.usuarioLogado },
        { icon: <Calendar size={18}/>, label: 'Data de Inclusão', value: formatDate(acao.dataInclusao) },
        { icon: <DollarSign size={18}/>, label: 'Débito Atual', value: formatCurrency(acao.debito) },
        { icon: <DollarSign size={18}/>, label: 'Valor Original', value: formatCurrency(acao.valorOriginal) },
        { icon: <Calendar size={18}/>, label: 'Vencimento', value: formatDate(acao.vencimento) },
        { icon: <Calendar size={18}/>, label: 'Última Cobrança', value: formatDate(acao.ultimaCobranca) },
        { icon: <BarChart size={18}/>, label: 'Meses em Aberto', value: acao.mesesAberto },
        { icon: <AlertTriangle size={18}/>, label: 'Prioridade', value: acao.prioridade },
        { icon: <Archive size={18}/>, label: 'Status do Processo', value: acao.statusProcesso.replace('_', ' ') },
        { icon: <ShieldCheck size={18}/>, label: 'Status da Cobrança', value: acao.statusCobranca.replace(/_/g, ' ') },
        { icon: <Handshake size={18}/>, label: 'Status do Acordo', value: acao.statusAcordo.replace(/_/g, ' ') },
        { icon: <FileCheck size={18}/>, label: 'CND', value: acao.cnd },
        { icon: <Scissors size={18}/>, label: 'Corte', value: acao.corte.replace('_', ' ') },
        { icon: <Gavel size={18}/>, label: 'Protesto', value: acao.protesto },
        { icon: <FileText size={18}/>, label: 'Descrição Completa', value: acao.descricao, isFullWidth: true },
        { icon: <MessageSquare size={18}/>, label: 'Últimas Anotações', value: acao.anotacoes, isFullWidth: true },
      ];

      setSelectedAcao(acao);
      setDetailsForPopup(detailsList); 
      setIsDetailsPopupOpen(true);
    }
  };
  
  const handleOpenEditPopup = (id: number) => {
    const acaoSelecionada = dados.find(item => item.id === id);
    if (acaoSelecionada) {
      setSelectedAcao(acaoSelecionada);
      setIsEditPopupOpen(true);
    }
  };

  const handleClosePopups = () => {
    setIsDetailsPopupOpen(false);
    setIsEditPopupOpen(false);
    setSelectedAcao(null);
  };

  const handleSaveAcao = (updatedAcao: AcaoLegal) => {
    console.log("Salvando dados atualizados:", updatedAcao);
    setDados(dados.map(d => d.id === updatedAcao.id ? updatedAcao : d));
    handleClosePopups();
    
  };

  useEffect(() => {
    const state = location.state as { openPopupWithId?: number };
    const idToOpen = state?.openPopupWithId;
    if (idToOpen) {
      handleOpenDetailsPopup(idToOpen);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const getStatusBadge = (status: string) => {
    const formattedStatus = status ? status.replace(/_/g, ' ') : 'INDEFINIDO';
    const baseClasses = "text-xs font-medium px-2.5 py-0.5 rounded-full capitalize"; 
    
    switch (status) {
      case 'PENDENTE':
        return <span className={`bg-red-100 text-red-800 ${baseClasses}`}>{formattedStatus}</span>;
      case 'PAGO':
        return <span className={`bg-green-100 text-green-800 ${baseClasses}`}>{formattedStatus}</span>;
      case 'EM_ACORDO':
        return <span className={`bg-yellow-100 text-yellow-800 ${baseClasses}`}>{formattedStatus}</span>;
      default:
        return <span className={`bg-gray-100 text-gray-800 ${baseClasses}`}>{formattedStatus}</span>;
    }
  };
  
  return (
    <div className="relative">
      <PageContainer title="Ações Legais">
        <div className="flex justify-end items-center mb-6">
          <Link
            to="/cadastros/acoes-legais"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Ação</span>
          </Link>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 items-center mb-6">
            <input type="text" placeholder="Condomínio" className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20" />
            <input type="text" placeholder="Condômino" className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20" />
            <input type="date" placeholder="Data" className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20" />
            <input type="text" placeholder="Responsável" className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20" />
            <select className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20">
                <option value="">Status</option>
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago</option>
                <option value="EM_ACORDO">Em Acordo</option>
            </select>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-2 justify-end">
                <button className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">Filtrar</button>
                <button className="w-full sm:w-auto bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors">Limpar</button>
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ação / Cliente</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Condômino</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Data Inclusão</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="font-medium">{item.acao}</div>
                    <div className="text-xs text-gray-500">{item.condominioCliente}</div>
                  </td>
                  <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-700">{item.parteContraria}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-700">{formatDate(item.dataInclusao)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{getStatusBadge(item.statusCobranca)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex items-center justify-center space-x-3">
                      <button onClick={() => handleOpenDetailsPopup(item.id)} className="text-blue-500 hover:text-blue-700" title="Ver Detalhes"><Info className="w-5 h-5" /></button>
                      <button onClick={() => handleOpenEditPopup(item.id)} className="text-green-600 hover:text-green-800" title="Editar Ação"><Edit className="w-5 h-5" /></button>
                      <button className="text-red-500 hover:text-red-700" title="Excluir Ação"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageContainer>
      
      
      <DetailsPopup
        isOpen={isDetailsPopupOpen}
        onClose={handleClosePopups}
        title={selectedAcao?.acao || ''}
        details={detailsForPopup}
      />
      
      <EditActionPopup 
        isOpen={isEditPopupOpen}
        onClose={handleClosePopups}
        acao={selectedAcao}
        onSave={handleSaveAcao}
      />
    </div>
  );
};

export default AcoesLegais;