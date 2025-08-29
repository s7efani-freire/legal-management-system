import React, { useState, useEffect, useMemo } from 'react';
import { Edit, X } from 'lucide-react';

const PageContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">{title}</h1>
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      {children}
    </div>
  </div>
);

export interface LancamentoHonorarios {
  codigo: number;
  dataLancamento: string;
  tipoAcordo: string;
  formaPgto: string;
  dataVencimento: string;
  descricaoItem: string;
  quantidade: number;
  valorHonorarios: number;
}

export interface AcaoLegal {
  id: number;
  acao: string;
  condominioCliente: string;
  parteContraria: string;
  debito: number;

  lancamento?: LancamentoHonorarios;
}

const HonorariosPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  acao: AcaoLegal | null;
  onSave: (acaoId: number, lancamento: LancamentoHonorarios) => void;
}> = ({ isOpen, onClose, acao, onSave }) => {
  
  const initialState: LancamentoHonorarios = {
    codigo: Math.floor(Math.random() * 1000) + 1,
    dataLancamento: new Date().toISOString().split('T')[0],
    tipoAcordo: 'BOLETO ÚNICO',
    formaPgto: 'BOLETO',
    dataVencimento: new Date().toISOString().split('T')[0],
    descricaoItem: '',
    quantidade: 1,
    valorHonorarios: 0,
  };

  const [formData, setFormData] = useState<LancamentoHonorarios>(initialState);

  useEffect(() => {
  
    if (acao) {
    
      const lancamentoExistente = acao.lancamento;
      setFormData(lancamentoExistente || {
        ...initialState,
        descricaoItem: `Honorários - ${acao.acao}`
      });
    }
  }, [acao]);
  

  const totalDebito = useMemo(() => {
    const debitoBase = acao?.debito || 0;
    const honorarios = Number(formData.valorHonorarios) || 0;
    const quantidade = Number(formData.quantidade) || 0;
    return debitoBase + (honorarios * quantidade);
  }, [acao?.debito, formData.valorHonorarios, formData.quantidade]);

  if (!isOpen || !acao) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(acao.id, formData);
    onClose();
  };
  
  const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Lançamento de Honorários</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Informações da Ação */}
          <div className="p-3 bg-gray-50 rounded-md border">
            <p className="text-sm text-gray-600"><strong>Ação:</strong> {acao.acao}</p>
            <p className="text-sm text-gray-600"><strong>Cliente:</strong> {acao.condominioCliente}</p>
          </div>
          
          {/* Campos de Contexto */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Código</label>
              <input type="number" name="codigo" value={formData.codigo} onChange={handleChange} className="mt-1 block w-full input-form" readOnly/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data Lanç.</label>
              <input type="date" name="dataLancamento" value={formData.dataLancamento} onChange={handleChange} className="mt-1 block w-full input-form" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo Acordo</label>
              <select name="tipoAcordo" value={formData.tipoAcordo} onChange={handleChange} className="mt-1 block w-full input-form">
                <option>BOLETO ÚNICO</option>
                <option>PARCELADO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Forma Pgto</label>
              <select name="formaPgto" value={formData.formaPgto} onChange={handleChange} className="mt-1 block w-full input-form">
                <option>BOLETO</option>
                <option>PIX</option>
                <option>DEPÓSITO</option>
              </select>
            </div>
          </div>

          {/* Descrição e Valores */}
          <div className="space-y-4 border-t pt-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Descrição do Item</label>
                <textarea name="descricaoItem" value={formData.descricaoItem} onChange={handleChange} rows={2} className="mt-1 block w-full input-form" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Valor Débito</label>
                    <input type="text" value={formatCurrency(acao.debito)} className="mt-1 block w-full input-form bg-gray-100" readOnly />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Qt.</label>
                    <input type="number" name="quantidade" value={formData.quantidade} onChange={handleChange} className="mt-1 block w-full input-form" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Honorários (R$)</label>
                    <input type="number" name="valorHonorarios" placeholder="350.50" value={formData.valorHonorarios} onChange={handleChange} className="mt-1 block w-full input-form" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Total Débito</label>
                    <input type="text" value={formatCurrency(totalDebito)} className="mt-1 block w-full input-form bg-gray-100 font-bold" readOnly />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">1º Vencimento</label>
                <input type="date" name="dataVencimento" value={formData.dataVencimento} onChange={handleChange} className="mt-1 block w-full input-form max-w-xs" />
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center p-4 border-t space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Salvar Lançamento</button>
        </div>
      </div>
    </div>
  );
};


const Honorarios: React.FC = () => {
  const [acoes, setAcoes] = useState<AcaoLegal[]>([
    { id: 1501, acao: "Execução Judicial de Débito - Apto 702", condominioCliente: "Condomínio Villa das Flores", parteContraria: "Carlos E. Montenegro", debito: 14850.75, lancamento: { codigo: 17, dataLancamento: '2025-08-20', tipoAcordo: 'BOLETO ÚNICO', formaPgto: 'BOLETO', dataVencimento: '2025-09-15', descricaoItem: 'Honorários sobre execução judicial', quantidade: 1, valorHonorarios: 1485.07 } },
    { id: 1502, acao: "Acordo de Parcelamento - Unidade 1101", condominioCliente: "Edifício Blue Sky", parteContraria: "Larissa Mendes", debito: 2150.40 },
    { id: 1503, acao: "Notificação por Reforma Irregular - Loja 05", condominioCliente: "Centro Empresarial Vanguard", parteContraria: "Global Tech Soluções", debito: 0, lancamento: { codigo: 18, dataLancamento: '2025-08-22', tipoAcordo: 'BOLETO ÚNICO', formaPgto: 'BOLETO', dataVencimento: '2025-09-10', descricaoItem: 'Honorários - Notificação Extrajudicial', quantidade: 1, valorHonorarios: 250.00 } },
    { id: 1505, acao: "Cobrança Simples - Apto 301", condominioCliente: "Residencial Morada do Sol", parteContraria: "Beatriz Nogueira", debito: 1150.22 },
    { id: 1508, acao: "Ação de Reparação de Danos - Vazamento", condominioCliente: "Condomínio Plaza", parteContraria: "Sérgio Martins", debito: 7500.00 },
  ]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAcao, setSelectedAcao] = useState<AcaoLegal | null>(null);

  const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleOpenPopup = (acao: AcaoLegal) => {
    setSelectedAcao(acao);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedAcao(null);
    setIsPopupOpen(false);
  };

  const handleSaveHonorarios = (acaoId: number, lancamento: LancamentoHonorarios) => {
    setAcoes(acoes.map(a => 
      a.id === acaoId 
        ? { ...a, lancamento: lancamento } 
        : a
    ));
  };

  return (
    <>
      <style>{`.input-form { padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); outline: none; } .input-form:focus { ring: 2px; ring-color: #3B82F6; }`}</style>
      <PageContainer title="Gestão de Honorários">
        {/* Barra de filtros */}
        <div className="bg-gray-100 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center mb-6">
          <input type="text" placeholder="Buscar por cliente..." className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20" />
          <input type="text" placeholder="Buscar por parte contrária..." className="w-full px-3 py-2 border border-accent rounded-lg text-sm italic focus:ring-2 focus:ring-primary/20" />
          <div className="flex gap-2 sm:col-span-2 lg:col-span-2 justify-end">
            <button className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">Filtrar</button>
            <button className="w-full sm:w-auto bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors">Limpar</button>
          </div>
        </div>

        {/* Tabela de Ações */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ação / Cliente</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Parte Contrária</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Débito Base</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Honorários</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {acoes.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="font-medium">{item.acao}</div>
                    <div className="text-xs text-gray-500">{item.condominioCliente}</div>
                  </td>
                  <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-700">{item.parteContraria}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{formatCurrency(item.debito)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">
                    {item.lancamento ? formatCurrency(item.lancamento.valorHonorarios) : <span className="text-gray-400 italic">Não lançado</span>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-center">
                      <button onClick={() => handleOpenPopup(item)} className="text-green-600 hover:text-green-800" title="Gerenciar Honorários">
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageContainer>

      {/* Popup */}
      <HonorariosPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        acao={selectedAcao}
        onSave={handleSaveHonorarios}
      />
    </>
  );
};

export default Honorarios;