import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import { Info, Trash2, Plus, Building, Mail, Phone, MapPin, FileText, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import DetailsPopup, { DetailItem } from '../components/ui/DetailsPopup'; 


interface Condominio {
    id: number;
    legal_name: string;
    trade_name: string;
    cnpj: string;
    email: string;
    phone_number: string;
    zip_code: string;
    street_address: string;
    street_number: string;
    city: string;
    state: string;
    created_at: string;
}

const condominiosData: Condominio[] = [
    { id: 1, legal_name: "Condomínio Exemplo A Ltda.", trade_name: "Condomínio A", cnpj: "00.000.000/0001-01", email: "contato@condominioa.com.br", phone_number: "(77) 98765-4321", zip_code: "45000-000", street_address: "Rua das Flores", street_number: "123", city: "Vitória da Conquista", state: "BA", created_at: "2024-01-15" },
    { id: 2, legal_name: "Condomínio Exemplo B Ltda.", trade_name: "Condomínio B", cnpj: "00.000.000/0001-02", email: "contato@condominiob.com.br", phone_number: "(77) 91234-5678", zip_code: "45000-000", street_address: "Avenida Principal", street_number: "456", city: "Vitória da Conquista", state: "BA", created_at: "2024-02-20" },
    { id: 3, legal_name: "Condomínio Exemplo X Ltda.", trade_name: "Condomínio X", cnpj: "00.000.000/0001-03", email: "contato@condominiox.com.br", phone_number: "(77) 95555-4444", zip_code: "46430-000", street_address: "Rua do Bosque", street_number: "789", city: "Guanambi", state: "BA", created_at: "2024-03-10" },
];



const Condominios: React.FC = () => {
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<DetailItem[]>([]);
  const [popupTitle, setPopupTitle] = useState('');

  
  const handleOpenPopup = (id: number) => {
    const condominio = condominiosData.find(item => item.id === id);
    if (condominio) {
      setPopupTitle(condominio.legal_name);

      
      const detailsList: DetailItem[] = [
        { icon: <Building />, label: 'Nome Fantasia', value: condominio.trade_name },
        { icon: <FileText />, label: 'CNPJ', value: condominio.cnpj },
        { icon: <Mail />, label: 'Email', value: condominio.email },
        { icon: <Phone />, label: 'Telefone', value: condominio.phone_number },
        { icon: <MapPin />, label: 'Endereço', value: `${condominio.street_address}, ${condominio.street_number} - ${condominio.city}/${condominio.state}` },
        { icon: <Clock />, label: 'Cliente Desde', value: new Date(condominio.created_at).toLocaleDateString('pt-BR') },
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

  return (
    <div className="relative">
      <PageContainer title="Condomínios">
        {/* Botão Novo Condomínio */}
        <div className="flex justify-end items-center mb-6">
          <Link
            to="/cadastros/condominios"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Condomínio</span>
          </Link>
        </div>

        {/* Barra de filtros responsiva */}
        <div className="bg-background p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center mb-6">
          <input type="text" placeholder="Nome" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" />
          <input type="text" placeholder="CNPJ" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" />
          <input type="text" placeholder="Cidade" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" />
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome Fantasia</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">CNPJ</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Telefone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cidade</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {condominiosData.map((condominio) => (
                <tr key={condominio.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{condominio.trade_name}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">{condominio.cnpj}</td>
                  <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-600">{condominio.phone_number}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{condominio.city}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-center space-x-3">
                      {/* 4. ADICIONAR O ONCLICK NO BOTÃO DE INFO */}
                      <button 
                        onClick={() => handleOpenPopup(condominio.id)} 
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
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

      {/* 5. RENDERIZAR O POPUP COM OS DADOS */}
      <DetailsPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={popupTitle}
        details={selectedDetails}
      />
    </div>
  );
};

export default Condominios;