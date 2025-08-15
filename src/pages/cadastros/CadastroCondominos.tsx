import React, { useState } from 'react';
import PageContainer from '../../components/ui/PageContainer';

const CadastroAcoesLegais: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    documento: '',
    telefone: '',
    tipoDeTelefone: '',
    cep: '',
    Logradouro: '',
    numero: '',
    complemento: '',
    uf: '',
    cidade: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <PageContainer title="Cadastro de Ações Legais" className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Ação Legal */}
        <div>
          <h3 className="text-lg font-medium text-text-secondary mb-4">Ação Legal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="titulo" className="block text-sm font-medium text-text-primary mb-1">
                Título
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Digite o título da ação"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="tipoAcao" className="block text-sm font-medium text-text-primary mb-1">
                Tipo de ação
              </label>
              <select
                id="tipoAcao"
                name="tipoAcao"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Selecione</option>
                <option value="cobranca">Cobrança</option>
                <option value="despejo">Despejo</option>
                <option value="revisional">Revisional</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="descricao" className="block text-sm font-medium text-text-primary mb-1">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva a ação"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="advogadoResponsavel" className="block text-sm font-medium text-text-primary mb-1">
                Advogado Responsável
              </label>
              <select
                id="advogadoResponsavel"
                name="advogadoResponsavel"
                value={formData.advogadoResponsavel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Selecione</option>
                <option value="dr-dias">Dr. Dias</option>
                <option value="dr-nunes">Dr. Nunes</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label htmlFor="honorario" className="block text-sm font-medium text-text-primary mb-1">
                Honorário
              </label>
              <input
                type="text"
                id="honorario"
                name="honorario"
                value={formData.honorario}
                onChange={handleChange}
                placeholder="R$ 0,00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="condominio" className="block text-sm font-medium text-text-primary mb-1">
                Condomínio
              </label>
              <select
                id="condominio"
                name="condominio"
                value={formData.condominio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Selecione ou digite para pesquisar</option>
                <option value="cond1">Condomínio Exemplo 1</option>
                <option value="cond2">Condomínio Exemplo 2</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label htmlFor="condominos" className="block text-sm font-medium text-text-primary mb-1">
                Condômino
              </label>
              <select
                id="condominos"
                name="condominos"
                value={formData.condominos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Selecione ou digite para pesquisar</option>
                <option value="cond1">João Silva</option>
                <option value="cond2">Maria Santos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ação Judicial */}
        <div>
          <h3 className="text-lg font-medium text-text-secondary mb-4">Ação Judicial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="instanciaJudicial" className="block text-sm font-medium text-text-primary mb-1">
                Instância Judicial
              </label>
              <input
                type="text"
                id="instanciaJudicial"
                name="instanciaJudicial"
                value={formData.instanciaJudicial}
                onChange={handleChange}
                placeholder="Digite o título da ação"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="numeroProcesso" className="block text-sm font-medium text-text-primary mb-1">
                Número do Processo
              </label>
              <input
                type="text"
                id="numeroProcesso"
                name="numeroProcesso"
                value={formData.numeroProcesso}
                onChange={handleChange}
                placeholder="Digite o número do processo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="tribunal" className="block text-sm font-medium text-text-primary mb-1">
                Tribunal
              </label>
              <input
                type="text"
                id="tribunal"
                name="tribunal"
                value={formData.tribunal}
                onChange={handleChange}
                placeholder="Digite o número do tribunal"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="varaJuizo" className="block text-sm font-medium text-text-primary mb-1">
                Vara ou Juízo
              </label>
              <input
                type="text"
                id="varaJuizo"
                name="varaJuizo"
                value={formData.varaJuizo}
                onChange={handleChange}
                placeholder="Digite a Vara ou Juízo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="forum" className="block text-sm font-medium text-text-primary mb-1">
                Fórum
              </label>
              <input
                type="text"
                id="forum"
                name="forum"
                value={formData.forum}
                onChange={handleChange}
                placeholder="Digite um fórum"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="linkTribunal" className="block text-sm font-medium text-text-primary mb-1">
                Link do tribunal
              </label>
              <input
                type="url"
                id="linkTribunal"
                name="linkTribunal"
                value={formData.linkTribunal}
                onChange={handleChange}
                placeholder="Cole aqui o link do tribunal"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="valorCausa" className="block text-sm font-medium text-text-primary mb-1">
                Valor da causa
              </label>
              <input
                type="text"
                id="valorCausa"
                name="valorCausa"
                value={formData.valorCausa}
                onChange={handleChange}
                placeholder="R$ 0,00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="valorCondenacao" className="block text-sm font-medium text-text-primary mb-1">
                Valor da Condenação
              </label>
              <input
                type="text"
                id="valorCondenacao"
                name="valorCondenacao"
                value={formData.valorCondenacao}
                onChange={handleChange}
                placeholder="R$ 0,00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="dataDistribuicao" className="block text-sm font-medium text-text-primary mb-1">
                Data de distribuição
              </label>
              <input
                type="date"
                id="dataDistribuicao"
                name="dataDistribuicao"
                value={formData.dataDistribuicao}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default CadastroAcoesLegais;