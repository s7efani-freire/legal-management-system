import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import { Info, Trash2, Plus, User, Mail, Phone, Building, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import DetailsPopup, { DetailItem } from '../components/ui/DetailsPopup';

// --- DEFINIÇÃO DE TIPOS E DADOS MOCKADOS ---
interface Dwelling {
  unit_number: string;
  building_block: string;
  condominium: string;
}

interface Condomino {
  id: number;
  name: string;
  document_number: string;
  email: string;
  phone_number: string;
  dwellings: Dwelling[]; // <-- NOVO: Lista de unidades
}

const condominosData: Condomino[] = [
  { 
    id: 1, name: "João Silva", document_number: "111.111.111-11", email: "joao.s@email.com", phone_number: "(77) 91234-5678", 
    dwellings: [
        { unit_number: "101", building_block: "A", condominium: "Condomínio A" },
        { unit_number: "203", building_block: "C", condominium: "Condomínio B" },
    ] 
  },
  { 
    id: 2, name: "Maria Oliveira", document_number: "222.222.222-22", email: "maria.o@email.com", phone_number: "(77) 98765-4321", 
    dwellings: [
        { unit_number: "302", building_block: "A", condominium: "Condomínio A" }
    ] 
  },
  { id: 3, name: "Carlos Ferreira", document_number: "333.333.333-33", email: "carlos.f@email.com", phone_number: "(77) 95555-4444", dwellings: [] },
  { id: 4, name: "Ana Souza", document_number: "444.444.444-44", email: "ana.s@email.com", phone_number: "(77) 91111-2222", dwellings: [] },
  { id: 5, name: "Pedro Martins", document_number: "555.555.555-55", email: "pedro.m@email.com", phone_number: "(77) 93333-4444", dwellings: [] },
];

const Condominos: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<DetailItem[]>([]);
  const [popupTitle, setPopupTitle] = useState('');

  const handleOpenPopup = (id: number) => {
    const condomino = condominosData.find(item => item.id === id);
    if (condomino) {
      setPopupTitle(condomino.name);

      // Mapeia os dados do condômino para o formato genérico
      const detailsList: DetailItem[] = [
        { icon: <FileText />, label: 'Documento', value: condomino.document_number },
        { icon: <Mail />, label: 'Email', value: condomino.email },
        { icon: <Phone />, label: 'Telefone', value: condomino.phone_number },
      ];

      // Se houver unidades, adicione-as como um item de detalhes extra
      if (condomino.dwellings.length > 0) {
        // Formata a lista de unidades em uma string com quebras de linha
        const unitsString = condomino.dwellings.map(d => 
            `${d.condominium}, Bloco ${d.building_block} - Unidade ${d.unit_number}`
        ).join('\n');
        detailsList.push({ icon: <Building />, label: 'Unidades', value: unitsString });
      }

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
      <PageContainer title="Condôminos">
        {/* Botão Novo Condômino */}
        <div className="flex justify-end items-center mb-6">
          <Link
            to="/cadastros/condominos"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Condômino</span>
          </Link>
        </div>

        {/* Barra de filtros responsiva com Grid */}
        <div className="bg-background p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center mb-6">
          <input type="text" placeholder="Nome" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" />
          <input type="text" placeholder="CNPJ ou CPF" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" />
          <input type="text" placeholder="Condomínio" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" />
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
                <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">CNPJ / CPF</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Telefone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Condomínio</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {condominosData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{item.name}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">{item.document_number}</td>
                  <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-600">{item.phone_number}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.dwellings.length > 0 ? item.dwellings[0].condominium : 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-center space-x-3">
                      <button 
                        onClick={() => handleOpenPopup(item.id)}
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
      
      <DetailsPopup 
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={popupTitle}
        details={selectedDetails}
      />
    </div>
  );
};

export default Condominos;