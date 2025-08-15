import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import { UserCheck } from 'lucide-react';

const Condominos: React.FC = () => {
  return (
    <PageContainer title="Condôminos">
      <div className="text-center py-20">
        <UserCheck className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-secondary mb-2">Gestão de Condôminos</h3>
        <p className="text-text-primary">
          Módulo em desenvolvimento. Aqui você poderá gerenciar todos os condôminos.
        </p>
      </div>
    </PageContainer>
  );
};

export default Condominos;