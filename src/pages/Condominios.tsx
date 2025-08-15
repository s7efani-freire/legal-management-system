import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import { Building } from 'lucide-react';

const Condominios: React.FC = () => {
  return (
    <PageContainer title="Condomínios">
      <div className="text-center py-20">
        <Building className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-secondary mb-2">Gestão de Condomínios</h3>
        <p className="text-text-primary">
          Módulo em desenvolvimento. Aqui você poderá gerenciar todos os condomínios clientes.
        </p>
      </div>
    </PageContainer>
  );
};

export default Condominios;