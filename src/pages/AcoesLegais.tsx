import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import { Scale, Plus, Search } from 'lucide-react';

const AcoesLegais: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageContainer title="Ações Legais">
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

        <div className="text-center py-20">
          <Scale className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-secondary mb-2">Ações Legais</h3>
          <p className="text-text-primary">
            Módulo em desenvolvimento. Aqui você poderá gerenciar todas as ações legais do escritório.
          </p>
        </div>
      </PageContainer>
    </div>
  );
};

export default AcoesLegais;