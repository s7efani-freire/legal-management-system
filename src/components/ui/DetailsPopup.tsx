import React from 'react';
import { X, Building, Clock, FileText, UserCircle2 } from 'lucide-react';

// Interface para definir quais dados o popup pode receber.
// Pode ser expandida para outros tipos de item no futuro.
interface ItemDetails {
  id: string;
  title: string;
  type?: string;
  condominio?: string;
  prazo?: string;
  assignee?: { name: string };
  numeroProcesso?: string;
  descricao?: string;
}

interface DetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemDetails | null;
}

const DetailsPopup: React.FC<DetailsPopupProps> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) {
    return null;
  }

  return (

    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      {/* Container do Popup */}
      <div
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do popup feche-o
        className="bg-white w-full max-w-2xl rounded-lg shadow-xl transform transition-all"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-text-secondary">{item.title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Corpo com os Detalhes */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {item.type && <DetailItem icon={<FileText />} label="Tipo de Ação" value={item.type} />}
            {item.condominio && <DetailItem icon={<Building />} label="Condomínio" value={item.condominio} />}
            {item.prazo && <DetailItem icon={<Clock />} label="Prazo Final" value={item.prazo} />}
            {item.assignee && <DetailItem icon={<UserCircle2 />} label="Responsável" value={item.assignee.name} />}
            {item.numeroProcesso && <DetailItem icon={<FileText />} label="Nº do Processo" value={item.numeroProcesso} />}
          </div>
          {item.descricao && (
             <div>
                <h4 className="font-semibold text-text-primary mb-1">Descrição</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{item.descricao}</p>
             </div>
          )}
        </div>

         {/* Rodapé */}
         <div className="flex items-center justify-end p-6 border-t border-gray-200">
            <button
                onClick={onClose}
                className="bg-primary text-white py-2 px-6 rounded-md font-medium hover:bg-primary-dark transition-colors"
            >
                Fechar
            </button>
         </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className='flex items-start space-x-3'>
        <span className='text-primary mt-1'>{React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}</span>
        <div>
            <p className="font-semibold text-text-primary">{label}</p>
            <p className="text-gray-600">{value}</p>
        </div>
    </div>
);


export default DetailsPopup;