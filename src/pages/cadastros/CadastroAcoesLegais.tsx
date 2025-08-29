import React, { useState } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import { FileDown } from 'lucide-react';
import { Switch } from '@headlessui/react';
import { gerarNotificacaoPDF } from '../../utils/pdfGenerator';

// Definições de classe que você forneceu
const inputClass =
  'w-full border-0 border-b border-gray-400 focus:border-primary focus:ring-0 placeholder:italic placeholder:text-gray-400';
const getSelectClass = (value: string) =>
  `w-full appearance-none bg-transparent border-0 border-b border-gray-400 
   focus:border-primary focus:ring-0
   ${value ? 'not-italic text-black' : 'italic text-gray-400'}`;

const CadastroAcoesLegais: React.FC = () => {
  const [isJudicial, setIsJudicial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    advogadoResponsavel: '',
    honorario: '',
    condominio: '',
    condominos: '',
    instanciaJudicial: '',
    numeroProcesso: '',
    tribunal: '',
    varaJuizo: '',
    forum: '',
    linkTribunal: '',
    valorCausa: '',
    valorCondenacao: '',
    dataDistribuicao: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGerarPDF = () => {
    setError(null);
    if (!isJudicial) { // Validação para Ação Extrajudicial
      if (
        !formData.titulo ||
        !formData.descricao ||
        !formData.condominio ||
        !formData.condominos
      ) {
        setError(
          'Por favor, preencha Título, Descrição, Condomínio e Condômino para gerar a notificação.'
        );
        return;
      }
      gerarNotificacaoPDF(formData);
    } else {
      if (!formData.titulo || !formData.numeroProcesso) {
        setError('Por favor, preencha Título e Número do Processo para gerar o relatório.');
        return;
      }
      alert('Geração de PDF para Ação Judicial ainda não implementada.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.condominio) {
      setError("Título e Condomínio são campos obrigatórios para salvar.");
      return;
    }
    setError(null);
    console.log('Formulário enviado:', {
      ...formData,
      tipoAcao: isJudicial ? 'Judicial' : 'Extrajudicial',
    });
    // Lógica de envio para o backend com axios.post()
  };

  return (
    <PageContainer title="Cadastro de Ações Legais" className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Ação Legal */}
        <div>
          <h3 className="text-lg font-medium text-text-secondary mb-4">
            Ação Legal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-1">
              <label htmlFor="titulo" className="block text-sm font-medium text-text-primary mb-1">
                Título*
              </label>
              <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Digite o título da ação" className={inputClass} />
            </div>

            <div className="md:col-span-1 flex flex-col justify-end">
              <div className="flex items-center gap-4">
                <span className={`font-medium ${!isJudicial ? 'text-primary' : 'text-gray-400'}`}>
                  Extrajudicial
                </span>
                <Switch
                  checked={isJudicial}
                  onChange={setIsJudicial}
                  className={`${ isJudicial ? 'bg-primary' : 'bg-gray-300' } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className={`${ isJudicial ? 'translate-x-6' : 'translate-x-1' } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                </Switch>
                <span className={`font-medium ${isJudicial ? 'text-primary' : 'text-gray-400'}`}>
                  Judicial
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="descricao" className="block text-sm font-medium text-text-primary mb-1">
                Descrição
              </label>
              <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descreva a ação" rows={3} className={inputClass} />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="advogadoResponsavel" className="block text-sm font-medium text-text-primary mb-1">
                Advogado Responsável
              </label>
              <select id="advogadoResponsavel" name="advogadoResponsavel" value={formData.advogadoResponsavel} onChange={handleChange} className={getSelectClass(formData.advogadoResponsavel)}>
                <option value="">Selecione o advogado</option>
                <option value="dr-dias">Dr. Dias</option>
                <option value="dr-nunes">Dr. Nunes</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label htmlFor="honorario" className="block text-sm font-medium text-text-primary mb-1">
                Honorário
              </label>
              <input type="text" id="honorario" name="honorario" value={formData.honorario} onChange={handleChange} placeholder="R$ 0,00" className={inputClass} />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="condominio" className="block text-sm font-medium text-text-primary mb-1">
                Condomínio*
              </label>
              <select id="condominio" name="condominio" value={formData.condominio} onChange={handleChange} className={getSelectClass(formData.condominio)}>
                <option value="">Selecione ou digite para pesquisar</option>
                <option value="Condomínio A">Condomínio Exemplo 1</option>
                <option value="Condomínio B">Condomínio Exemplo 2</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label htmlFor="condominos" className="block text-sm font-medium text-text-primary mb-1">
                Condômino
              </label>
              <select id="condominos" name="condominos" value={formData.condominos} onChange={handleChange} className={getSelectClass(formData.condominos)}>
                <option value="">Selecione ou digite para pesquisar</option>
                <option value="João Silva">João Silva</option>
                <option value="Maria Santos">Maria Santos</option>
              </select>
            </div>
          </div>
        </div>

        {isJudicial && (
          <div>
            <h3 className="text-lg font-medium text-text-secondary mb-4">
              Ação Judicial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label htmlFor="instanciaJudicial" className="block text-sm font-medium text-text-primary mb-1">Instância Judicial</label>
                <input type="text" id="instanciaJudicial" name="instanciaJudicial" value={formData.instanciaJudicial} onChange={handleChange} placeholder="Ex: Primeira Instância" className={inputClass}/>
              </div>
              <div>
                <label htmlFor="numeroProcesso" className="block text-sm font-medium text-text-primary mb-1">Número do Processo</label>
                <input type="text" id="numeroProcesso" name="numeroProcesso" value={formData.numeroProcesso} onChange={handleChange} placeholder="Digite o número do processo" className={inputClass}/>
              </div>
              <div>
                <label htmlFor="tribunal" className="block text-sm font-medium text-text-primary mb-1">Tribunal</label>
                <input type="text" id="tribunal" name="tribunal" value={formData.tribunal} onChange={handleChange} placeholder="Ex: TJBA" className={inputClass}/>
              </div>
              <div>
                <label htmlFor="varaJuizo" className="block text-sm font-medium text-text-primary mb-1">Vara ou Juízo</label>
                <input type="text" id="varaJuizo" name="varaJuizo" value={formData.varaJuizo} onChange={handleChange} placeholder="Ex: 1ª Vara Cível" className={inputClass}/>
              </div>
              <div>
                <label htmlFor="forum" className="block text-sm font-medium text-text-primary mb-1">Fórum</label>
                <input type="text" id="forum" name="forum" value={formData.forum} onChange={handleChange} placeholder="Digite o fórum" className={inputClass}/>
              </div>
              <div className="md:col-span-1">
                <label htmlFor="linkTribunal" className="block text-sm font-medium text-text-primary mb-1">Link do tribunal</label>
                <input type="url" id="linkTribunal" name="linkTribunal" value={formData.linkTribunal} onChange={handleChange} placeholder="Cole aqui o link do tribunal" className={inputClass}/>
              </div>
              <div>
                <label htmlFor="valorCausa" className="block text-sm font-medium text-text-primary mb-1">Valor da causa</label>
                <input type="text" id="valorCausa" name="valorCausa" value={formData.valorCausa} onChange={handleChange} placeholder="R$ 0,00" className={inputClass}/>
              </div>
              <div>
                <label htmlFor="valorCondenacao" className="block text-sm font-medium text-text-primary mb-1">Valor da Condenação</label>
                <input type="text" id="valorCondenacao" name="valorCondenacao" value={formData.valorCondenacao} onChange={handleChange} placeholder="R$ 0,00" className={inputClass}/>
              </div>
              <div className="md:col-span-1">
                  <label htmlFor="dataDistribuicao" className="block text-sm font-medium text-text-primary mb-1">Data de distribuição</label>
                  <input type="date" id="dataDistribuicao" name="dataDistribuicao" value={formData.dataDistribuicao} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>
        )}
        
        {error && <div className="text-center text-red-600 bg-red-100 p-3 rounded-md w-full">{error}</div>}

        <div className="flex justify-between items-center pt-4 md:pt-6">
            <button
                type="button"
                onClick={handleGerarPDF}
                className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors flex items-center space-x-2"
            >
                <FileDown className="w-4 h-4" />
                <span>{isJudicial ? 'Gerar Relatório PDF' : 'Gerar Notificação PDF'}</span>
            </button>

            <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                disabled={isLoading}
            >
                {isLoading ? 'Cadastrando...' : 'Cadastrar Ação'}
            </button>
        </div>
      </form>
    </PageContainer>
  )
}

export default CadastroAcoesLegais