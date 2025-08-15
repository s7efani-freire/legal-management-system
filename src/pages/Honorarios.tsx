import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import { DollarSign } from 'lucide-react';

const Honorarios: React.FC = () => {
  return (
    <PageContainer title="Honorários">
      <div className="text-center py-20">
        <DollarSign className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-secondary mb-2">Gestão de Honorários</h3>
        <p className="text-text-primary">
          Módulo em desenvolvimento. Aqui você poderá controlar todos os honorários e faturamentos.
        </p>
      </div>
    </PageContainer>
  );
};

export default Honorarios;