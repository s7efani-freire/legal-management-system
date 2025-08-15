import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import { Users } from 'lucide-react';

const Usuarios: React.FC = () => {
  return (
    <PageContainer title="Usuários">
      <div className="text-center py-20">
        <Users className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-secondary mb-2">Gestão de Usuários</h3>
        <p className="text-text-primary">
          Módulo em desenvolvimento. Aqui você poderá gerenciar todos os usuários do sistema.
        </p>
      </div>
    </PageContainer>
  );
};

export default Usuarios;