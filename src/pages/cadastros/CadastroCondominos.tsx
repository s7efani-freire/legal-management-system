import React, { useState } from 'react';
import PageContainer from '../../components/ui/PageContainer';

const CadastroCondominos: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    documento: '',
    telefone: '',
    tipoDeTelefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    uf: '',
    cidade: '',
    unidades: [
      { condominio: '', bloco: '', andar: '', numero: '' }
    ]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUnidadeChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newUnidades = [...formData.unidades];
    newUnidades[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      unidades: newUnidades
    });
  };

  const addUnidade = () => {
    setFormData({
      ...formData,
      unidades: [...formData.unidades, { condominio: '', bloco: '', andar: '', numero: '' }]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <PageContainer title="Cadastro de Condôminos" className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Informações Pessoais */}
        <div>
          <h3 className="text-lg font-medium text-text-secondary mb-4">Informações Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-text-primary mb-1">Nome</label>
              <input type="text" id="nome" name="nome" placeholder="Digite o primeiro nome" value={formData.nome} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="sobrenome" className="block text-sm font-medium text-text-primary mb-1">Sobrenome</label>
              <input type="text" id="sobrenome" name="sobrenome" placeholder="Digite o sobrenome" value={formData.sobrenome} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">E-mail</label>
              <input type="email" id="email" name="email" placeholder="emaildocondomino@email.com" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="documento" className="block text-sm font-medium text-text-primary mb-1">Documento</label>
              <input type="text" id="documento" name="documento" placeholder="Digite o CPF ou CNPJ" value={formData.documento} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-text-primary mb-1">Telefone</label>
              <input type="tel" id="telefone" name="telefone" placeholder="+55 (xx) xxxx-xxxx" value={formData.telefone} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="tipoDeTelefone" className="block text-sm font-medium text-text-primary mb-1">Tipo de telefone</label>
              <select id="tipoDeTelefone" name="tipoDeTelefone" value={formData.tipoDeTelefone} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="celular">Celular</option>
                <option value="fixo">Fixo</option>
              </select>
            </div>
            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-text-primary mb-1">CEP</label>
              <input type="text" id="cep" name="cep" placeholder="Digite o CEP" value={formData.cep} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="logradouro" className="block text-sm font-medium text-text-primary mb-1">Logradouro</label>
              <input type="text" id="logradouro" name="logradouro" placeholder="Digite a rua, ou avenida" value={formData.logradouro} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-text-primary mb-1">Número</label>
              <input type="text" id="numero" name="numero" placeholder="Nº" value={formData.numero} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="complemento" className="block text-sm font-medium text-text-primary mb-1">Complemento</label>
              <input type="text" id="complemento" name="complemento" placeholder="Bloco, casa, etc." value={formData.complemento} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="uf" className="block text-sm font-medium text-text-primary mb-1">UF</label>
              <select id="uf" name="uf" value={formData.uf} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
              </select>
            </div>
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-text-primary mb-1">Cidade</label>
              <input type="text" id="cidade" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Unidades Residenciais */}
        <div>
          <h3 className="text-lg font-medium text-text-secondary mb-4">Unidades Residenciais</h3>
          {formData.unidades.map((unidade, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-2">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Condomínio</label>
                <select name="condominio" value={unidade.condominio} onChange={(e) => handleUnidadeChange(index, e)}>
                  <option value="">Selecione ou digite para pesquisar</option>
                  <option value="cond1">Condomínio Exemplo 1</option>
                  <option value="cond2">Condomínio Exemplo 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Bloco</label>
                <select name="bloco" value={unidade.bloco} onChange={(e) => handleUnidadeChange(index, e)}>
                  <option value="">Selecione</option>
                  <option value="A">Bloco A</option>
                  <option value="B">Bloco B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Andar</label>
                <select name="andar" value={unidade.andar} onChange={(e) => handleUnidadeChange(index, e)}>
                  <option value="">Selecione</option>
                  {[...Array(20)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Número</label>
                <select name="numero" value={unidade.numero} onChange={(e) => handleUnidadeChange(index, e)}>
                  <option value="">Selecione</option>
                  {[...Array(50)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <button type="button" onClick={addUnidade} className="text-primary font-medium flex items-center gap-1">
            + Adicionar
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Cadastrar
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default CadastroCondominos;
