import React from 'react';
import PageContainer from '../../components/ui/PageContainer';
import { Building, Plus } from 'lucide-react';

const CadastroCondominios: React.FC = () => {
  return (
    <PageContainer title="Cadastro de Condomínios">
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-primary" />
          <Plus className="w-4 h-4 text-primary absolute translate-x-2 -translate-y-2" />
        </div>
        <h3 className="text-lg font-medium text-text-secondary mb-2">Cadastro de Condomínios</h3>
        <p className="text-text-primary">
          Formulário para cadastro de novos condomínios em desenvolvimento.
        </p>
      </div>
    </PageContainer>
  );
};

export default CadastroCondominios;