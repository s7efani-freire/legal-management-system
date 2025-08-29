import React from 'react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AcaoLegal } from '../../pages/AcoesLegais'; 

interface EditActionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  acao: AcaoLegal | null;
  onSave: (updatedAcao: AcaoLegal) => void;
}

const inputClass = "w-full border-0 border-b border-gray-400 focus:border-primary focus:ring-0 placeholder:italic placeholder:text-gray-400 bg-gray-50/50 p-2 text-sm";
const labelClass = "font-medium text-text-secondary text-sm";
const getSelectClass = (value: any) => `w-full appearance-none bg-gray-50/50 border-0 border-b border-gray-400 focus:border-primary focus:ring-0 p-2 text-sm ${!value || value === "" ? "italic text-gray-400" : "not-italic text-black"}`;

const EditActionPopup: React.FC<EditActionPopupProps> = ({ isOpen, onClose, acao, onSave }) => {
  const [formData, setFormData] = useState<AcaoLegal | null>(null);

  useEffect(() => {
    setFormData(acao);
  }, [acao]);

  const getStatusPrincipalStyle = (status: AcaoLegal['statusCobranca'] | undefined) => {
    switch (status) {
      case 'PENDENTE':
        return 'bg-red-100 text-red-800';
      case 'PAGO':
        return 'bg-green-100 text-green-800';
      case 'EM_ACORDO':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !formData) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  const formatDateForInput = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  }

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-5xl rounded-lg shadow-xl transform transition-all max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-text-secondary">Ação Extrajudicial: #{acao?.id}</h3>
            <p className="text-sm text-gray-500">{acao?.acao}</p>
          </div>
          
          <div className="text-center">
            <span 
              className={`px-4 py-1.5 text-sm font-semibold tracking-wider rounded-full ${getStatusPrincipalStyle(formData.statusCobranca)}`}
            >
              {formData.statusCobranca?.replace('_', ' ') || 'INDEFINIDO'}
            </span>
            <p className="text-xs text-gray-500 mt-2 font-medium">Status Principal</p>
          </div>
          
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-text-secondary mb-4">Informações Principais</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
              <div>
                <label htmlFor="id" className={labelClass}>Código</label>
                <input type="text" name="id" value={formData.id} disabled className={`${inputClass} bg-gray-200 cursor-not-allowed`} />
              </div>
              <div>
                <label htmlFor="condominioCliente" className={labelClass}>Condomínio/Cliente</label>
                <input type="text" name="condominioCliente" value={formData.condominioCliente || ''} disabled className={`${inputClass} bg-gray-200 cursor-not-allowed`} />
              </div>
              <div>
                <label htmlFor="parteContraria" className={labelClass}>Condômino</label>
                <input type="text" name="parteContraria" value={formData.parteContraria || ''} onChange={handleChange} className={inputClass} placeholder="Ex: João da Silva" />
              </div>
              <div>
                <label htmlFor="dataInclusao" className={labelClass}>Data de Inclusão</label>
                <input type="date" name="dataInclusao" value={formatDateForInput(formData.dataInclusao)} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="usuarioLogado" className={labelClass}>Usuário Responsável</label>
                <input type="text" name="usuarioLogado" value={formData.usuarioLogado || ''} disabled className={`${inputClass} bg-gray-200 cursor-not-allowed`} />
              </div>
            </div>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-text-secondary mb-4">Valores e Prazos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
              <div>
                <label htmlFor="valorOriginal" className={labelClass}>Valor Original (R$)</label>
                <input type="number" name="valorOriginal" value={formData.valorOriginal || ''} onChange={handleChange} className={inputClass} placeholder="Ex: 832.87" />
              </div>
              <div>
                <label htmlFor="debito" className={labelClass}>Débito Atual (R$)</label>
                <input type="number" name="debito" value={formData.debito || ''} onChange={handleChange} className={inputClass} placeholder="Ex: 950.00" />
              </div>
              <div>
                <label htmlFor="vencimento" className={labelClass}>Vencimento</label>
                <input type="date" name="vencimento" value={formatDateForInput(formData.vencimento)} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="ultimaCobranca" className={labelClass}>Última Cobrança</label>
                <input type="date" name="ultimaCobranca" value={formatDateForInput(formData.ultimaCobranca)} onChange={handleChange} className={inputClass} />
              </div>
               <div>
                <label htmlFor="mesesAberto" className={labelClass}>Meses em Aberto</label>
                <input type="number" name="mesesAberto" value={formData.mesesAberto || ''} onChange={handleChange} className={inputClass} placeholder="Ex: 3" />
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-text-secondary mb-4">Status e Controle</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
              <div>
                <label htmlFor="statusProcesso" className={labelClass}>Status do Processo</label>
                <select name="statusProcesso" value={formData.statusProcesso} onChange={handleChange} className={getSelectClass(formData.statusProcesso)}>
                  <option value="ATIVO">ATIVO</option>
                  <option value="ARQUIVADO">ARQUIVADO</option>
                </select>
              </div>
              <div>
                <label htmlFor="statusCobranca" className={labelClass}>Status da Cobrança</label>
                <select name="statusCobranca" value={formData.statusCobranca} onChange={handleChange} className={getSelectClass(formData.statusCobranca)}>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="PAGO">PAGO</option>
                  <option value="EM_ACORDO">EM ACORDO</option>
                </select>
              </div>
               <div>
                <label htmlFor="statusAcordo" className={labelClass}>Status/Acordo</label>
                <select name="statusAcordo" value={formData.statusAcordo} onChange={handleChange} className={getSelectClass(formData.statusAcordo)}>
                  <option value="NENHUM">Nenhum</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="CUMPRIDO">Cumprido</option>
                  <option value="DESCUMPRIDO">Descumprido</option>
                </select>
              </div>
              <div>
                <label htmlFor="prioridade" className={labelClass}>Prioridade</label>
                <select name="prioridade" value={formData.prioridade} onChange={handleChange} className={getSelectClass(formData.prioridade)}>
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
              <div>
                <label htmlFor="cnd" className={labelClass}>CND</label>
                <select name="cnd" value={formData.cnd} onChange={handleChange} className={getSelectClass(formData.cnd)}>
                    <option value="NAO">Não</option>
                    <option value="SIM">Sim</option>
                    <option value="PENDENTE">Pendente</option>
                </select>
              </div>
               <div>
                <label htmlFor="corte" className={labelClass}>Corte de Serviço</label>
                <select name="corte" value={formData.corte} onChange={handleChange} className={getSelectClass(formData.corte)}>
                    <option value="NAO">Não</option>
                    <option value="SOLICITADO">Solicitado</option>
                    <option value="EXECUTADO">Executado</option>
                </select>
              </div>
              <div>
                <label htmlFor="protesto" className={labelClass}>Protesto</label>
                <select name="protesto" value={formData.protesto} onChange={handleChange} className={getSelectClass(formData.protesto)}>
                  <option value="NAO">Não</option>
                  <option value="SIM">Sim</option>
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-text-secondary mb-2">Anotações Gerais</h4>
              <textarea name="anotacoes" value={formData.anotacoes || ''} onChange={handleChange} className={`${inputClass} bg-yellow-50`} rows={4} placeholder="Adicione observações importantes sobre o caso..."></textarea>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end p-4 border-t border-gray-200 gap-4 bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md font-medium hover:bg-gray-300 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="bg-primary text-white py-2 px-6 rounded-md font-medium hover:bg-primary-dark transition-colors">Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

export default EditActionPopup;