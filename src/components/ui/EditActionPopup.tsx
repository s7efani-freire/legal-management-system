import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AcaoLegal } from '../../pages/AcoesLegais'; // Importa o tipo da página

interface EditActionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  acao: AcaoLegal | null;
  onSave: (updatedAcao: AcaoLegal) => void;
}

// Estilos que já usamos
const inputClass = "w-full border-0 border-b border-gray-400 focus:border-primary focus:ring-0 placeholder:italic placeholder:text-gray-400 bg-gray-50/50 p-2";
const getSelectClass = (value: any) => `w-full appearance-none bg-gray-50/50 border-0 border-b border-gray-400 focus:border-primary focus:ring-0 p-2 ${value ? "not-italic text-black" : "italic text-gray-400"}`;

const EditActionPopup: React.FC<EditActionPopupProps> = ({ isOpen, onClose, acao, onSave }) => {
  const [formData, setFormData] = useState<AcaoLegal | null>(null);

  useEffect(() => {
    // Carrega os dados da ação no estado do formulário quando o popup abre
    setFormData(acao);
  }, [acao]);

  if (!isOpen || !formData) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-4xl rounded-lg shadow-xl transform transition-all max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-text-secondary">Editar Ação: {acao?.acao}</h3>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"><X className="w-6 h-6" /></button>
        </div>

        {/* Corpo com o Formulário */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* --- CAMPOS ADICIONADOS --- */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-text-secondary mb-4">Status e Controle</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                <div>
                    <label htmlFor="statusProcesso" className="font-medium">Status do Processo</label>
                    <select name="statusProcesso" value={formData.statusProcesso} onChange={handleChange} className={getSelectClass(formData.statusProcesso)}>
                        <option value="ATIVO">ATIVO</option>
                        <option value="ARQUIVADO">ARQUIVADO</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="vencimento" className="font-medium">Vencimento</label>
                    <input type="date" name="vencimento" value={formData.vencimento} onChange={handleChange} className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="statusCobranca" className="font-medium">Status da Cobrança</label>
                    <select name="statusCobranca" value={formData.statusCobranca} onChange={handleChange} className={getSelectClass(formData.statusCobranca)}>
                        <option value="PENDENTE">PENDENTE</option>
                        <option value="PAGO">PAGO</option>
                        <option value="EM_ACORDO">EM ACORDO</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="protesto" className="font-medium">Protesto</label>
                    <select name="protesto" value={formData.protesto} onChange={handleChange} className={getSelectClass(formData.protesto)}>
                        <option value="NAO">Não</option>
                        <option value="SIM">Sim</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="statusAcordo" className="font-medium">Status/Acordo</label>
                    <select name="statusAcordo" value={formData.statusAcordo} onChange={handleChange} className={getSelectClass(formData.statusAcordo)}>
                        <option value="NENHUM">Nenhum</option>
                        <option value="EM_ANDAMENTO">Em Andamento</option>
                        <option value="CUMPRIDO">Cumprido</option>
                        <option value="DESCUMPRIDO">Descumprido</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="prioridade" className="font-medium">Prioridade</label>
                    <select name="prioridade" value={formData.prioridade} onChange={handleChange} className={getSelectClass(formData.prioridade)}>
                        <option value="BAIXA">Baixa</option>
                        <option value="MEDIA">Média</option>
                        <option value="ALTA">Alta</option>
                    </select>
                </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-text-secondary mb-2">Anotações</h4>
            <textarea name="anotacoes" value={formData.anotacoes} onChange={handleChange} className={`${inputClass} bg-yellow-50`} rows={5} placeholder="Adicione observações importantes sobre o caso..."></textarea>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 gap-4">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md font-medium hover:bg-gray-300 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="bg-primary text-white py-2 px-6 rounded-md font-medium hover:bg-primary-dark transition-colors">Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

export default EditActionPopup;