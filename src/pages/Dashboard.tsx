import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import { BarChart3, PieChart, Users, Building } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-accent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary">Honorários</p>
              <p className="text-2xl font-bold text-text-secondary">R$ 45.320</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-accent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary">Demandas</p>
              <p className="text-2xl font-bold text-text-secondary">127</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-accent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary">Condomínios</p>
              <p className="text-2xl font-bold text-text-secondary">34</p>
            </div>
            <div className="w-12 h-12 bg-accent/50 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-accent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary">Condôminos</p>
              <p className="text-2xl font-bold text-text-secondary">892</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PageContainer title="Honorários (R$)" className="text-center">
          <div className="w-48 h-48 mx-auto bg-accent/30 rounded-full flex items-center justify-center">
            <PieChart className="w-16 h-16 text-secondary" />
          </div>
          <p className="text-sm text-text-primary mt-4">Gráfico de honorários por status</p>
        </PageContainer>

        <PageContainer title="Demandas (quantidade)" className="text-center">
          <div className="w-48 h-48 mx-auto bg-accent/30 rounded-full flex items-center justify-center">
            <PieChart className="w-16 h-16 text-primary" />
          </div>
          <p className="text-sm text-text-primary mt-4">Gráfico de demandas ativas</p>
        </PageContainer>

        <PageContainer title="Distribuição de tarefas" className="text-center">
          <div className="w-48 h-48 mx-auto bg-accent/30 rounded-full flex items-center justify-center">
            <PieChart className="w-16 h-16 text-secondary" />
          </div>
          <p className="text-sm text-text-primary mt-4">Distribuição por usuário</p>
        </PageContainer>
      </div>

      {/* Kanban Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PageContainer title="Pendentes" className="min-h-96">
          <div className="space-y-3">
            <div className="p-4 bg-accent/20 rounded-lg border border-accent">
              <h4 className="font-medium text-text-secondary">Ação judicial - Condomínio X</h4>
              <p className="text-sm text-text-primary mt-1">Prazo: 18/07/2025</p>
            </div>
            <div className="p-4 bg-accent/20 rounded-lg border border-accent">
              <h4 className="font-medium text-text-secondary">Ação judicial - Condomínio Y</h4>
              <p className="text-sm text-text-primary mt-1">Prazo: 18/07/2025</p>
            </div>
          </div>
        </PageContainer>

        <PageContainer title="Em Andamento" className="min-h-96">
          <div className="space-y-3">
            <div className="p-4 bg-accent/20 rounded-lg border border-accent">
              <h4 className="font-medium text-text-secondary">Ação judicial - Condomínio Z</h4>
              <p className="text-sm text-text-primary mt-1">Prazo: 18/07/2025</p>
            </div>
          </div>
        </PageContainer>

        <PageContainer title="Concluídos" className="min-h-96">
          <div className="space-y-3">
            <div className="p-4 bg-accent/20 rounded-lg border border-accent">
              <h4 className="font-medium text-text-secondary">Ação judicial - Condomínio W</h4>
              <p className="text-sm text-text-primary mt-1">Prazo: 18/07/2025</p>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
};

export default Dashboard;