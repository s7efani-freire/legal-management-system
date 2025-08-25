import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PageContainer from '../../components/ui/PageContainer';
import axios from 'axios';
import { Plus, Trash2, ChevronDown } from "lucide-react";

const inputClass = "w-full border-0 border-b border-gray-400 focus:border-primary focus:ring-0 placeholder:italic placeholder:text-gray-400";
const getSelectClass = (value: string) => `w-full appearance-none bg-transparent border-0 border-b border-gray-400 focus:border-primary focus:ring-0 ${value ? "not-italic text-black" : "italic text-gray-400"}`;

const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

type Unidade = {
  condominioId: string;
  bloco: string;
  numero: string;
};

const CadastroCondominos: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '', sobrenome: '', email: '', documento: '', telefone: '',
    tipoDeTelefone: '', cep: '', logradouro: '', numero: '',
    complemento: '', uf: '', cidade: '',
    unidades: [{ condominioId: '', bloco: '', numero: '' }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUnidadeChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newUnidades = [...formData.unidades];
    (newUnidades[index] as any)[e.target.name] = e.target.value;
    setFormData({ ...formData, unidades: newUnidades });
  };

  const addUnidade = () => {
    setFormData({ ...formData, unidades: [...formData.unidades, { condominioId: '', bloco: '', numero: '' }] });
  };

  const removeUnidade = (indexToRemove: number) => {
    setFormData({ ...formData, unidades: formData.unidades.filter((_, index) => index !== indexToRemove) });
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!data.erro) {
          setFormData(prev => ({ ...prev, logradouro: data.logradouro, cidade: data.localidade, uf: data.uf }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.nome || !formData.sobrenome || !formData.documento) {
      setError("Nome, sobrenome e documento são obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        first_name: formData.nome,
        last_name: formData.sobrenome,
        document_number: formData.documento,
        email: formData.email,
        phone_number: formData.telefone,
        phone_type: formData.tipoDeTelefone,
        zip_code: formData.cep,
        street_address: formData.logradouro,
        street_number: formData.numero,
        address_complement: formData.complemento,
        city: formData.cidade,
        state: formData.uf,
        dwellings: formData.unidades.map(unidade => ({
          condominium_id: parseInt(unidade.condominioId, 10),
          unit_number: unidade.numero,
          building_block: unidade.bloco,
        }))
      };

      const response = await axios.post('http://localhost/diasenunes-api/api/residents/create.php', payload);
      setSuccess(response.data.message);

      // setTimeout(() => navigate('/condominos'), 2000);

    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Ocorreu um erro ao cadastrar.");
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title="Cadastro de Condôminos" className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Pessoais */}
        <div>
          <h3 className="text-lg font-medium text-text-secondary mb-4">Informações Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div><label htmlFor="nome" className="block text-sm font-medium text-text-primary mb-1">Nome*</label><input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} className={inputClass} placeholder="Digite o primeiro nome" /></div>
            <div><label htmlFor="sobrenome" className="block text-sm font-medium text-text-primary mb-1">Sobrenome*</label><input type="text" id="sobrenome" name="sobrenome" value={formData.sobrenome} onChange={handleChange} className={inputClass} placeholder="Digite o sobrenome" /></div>
            <div><label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">E-mail</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="emaildocondomino@email.com" /></div>
            <div><label htmlFor="documento" className="block text-sm font-medium text-text-primary mb-1">Documento (CPF/CNPJ)*</label><input type="text" id="documento" name="documento" value={formData.documento} onChange={handleChange} className={inputClass} placeholder="Digite o CPF ou CNPJ" /></div>
            <div><label htmlFor="telefone" className="block text-sm font-medium text-text-primary mb-1">Telefone</label><input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} className={inputClass} placeholder="+55 (xx) xxxx-xxxx" /></div>
            <div className="relative"><label htmlFor="tipoDeTelefone" className="block text-sm font-medium text-text-primary mb-1">Tipo de telefone</label><select id="tipoDeTelefone" name="tipoDeTelefone" value={formData.tipoDeTelefone} onChange={handleChange} className={getSelectClass(formData.tipoDeTelefone)}><option value="">Selecione</option><option value="Celular">Celular</option><option value="Fixo">Fixo</option><option value="Whatsapp">Whatsapp</option></select><ChevronDown className="absolute right-0 bottom-2 w-5 h-5 text-gray-400 pointer-events-none" /></div>
            <div><label htmlFor="cep" className="block text-sm font-medium text-text-primary mb-1">CEP</label><input type="text" id="cep" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} className={inputClass} placeholder="Digite o CEP" /></div>
            <div><label htmlFor="logradouro" className="block text-sm font-medium text-text-primary mb-1">Logradouro</label><input type="text" id="logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} className={inputClass} placeholder="Rua, avenida..." /></div>
            <div><label htmlFor="numero" className="block text-sm font-medium text-text-primary mb-1">Número</label><input type="text" id="numero" name="numero" value={formData.numero} onChange={handleChange} className={inputClass} placeholder="Nº" /></div>
            <div><label htmlFor="complemento" className="block text-sm font-medium text-text-primary mb-1">Complemento</label><input type="text" id="complemento" name="complemento" value={formData.complemento} onChange={handleChange} className={inputClass} placeholder="Bloco, casa, etc." /></div>
            <div className="relative"><label htmlFor="uf" className="block text-sm font-medium text-text-primary mb-1">UF</label><select id="uf" name="uf" value={formData.uf} onChange={handleChange} className={getSelectClass(formData.uf)}><option value="">Selecione</option>{estados.map((sigla) => (<option key={sigla} value={sigla}>{sigla}</option>))}</select><ChevronDown className="absolute right-0 bottom-2 w-5 h-5 text-gray-400 pointer-events-none" /></div>
            <div><label htmlFor="cidade" className="block text-sm font-medium text-text-primary mb-1">Cidade</label><input type="text" id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} className={inputClass} placeholder="Cidade" /></div>
          </div>
        </div>

        {/* Unidades Residenciais */}
        <div>
          <h3 className="text-lg font-medium text-text-secondary mb-4">Unidades Residenciais</h3>
          <div className="space-y-4">
            {formData.unidades.map((unidade, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2 relative"><label className="text-sm">Condomínio*</label><select name="condominioId" value={unidade.condominioId} onChange={(e) => handleUnidadeChange(index, e)} className={getSelectClass(unidade.condominioId)}><option value="">Selecione</option><option value="1">Condomínio A</option><option value="2">Condomínio B</option></select><ChevronDown className="absolute right-0 bottom-2 w-5 h-5 text-gray-400 pointer-events-none" /></div>
                <div><label className="text-sm">Bloco</label><input type="text" name="bloco" value={unidade.bloco} onChange={(e) => handleUnidadeChange(index, e)} className={inputClass} placeholder="Ex: A" /></div>
                <div><label className="text-sm">Unidade*</label><input type="text" name="numero" value={unidade.numero} onChange={(e) => handleUnidadeChange(index, e)} className={inputClass} placeholder="Ex: 101" /></div>
                {formData.unidades.length > 1 && (<button type="button" onClick={() => removeUnidade(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>)}
              </div>
            ))}
          </div>
          <button type="button" onClick={addUnidade} className="text-primary font-medium flex items-center gap-1 mt-4"><Plus className="w-4 h-4" />Adicionar Unidade</button>
        </div>

        {/* Submit */}
        <div className="flex flex-col items-center pt-6">
          {error && <div className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md w-full">{error}</div>}
          {success && <div className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded-md w-full">{success}</div>}
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors w-full max-w-sm disabled:bg-gray-400" disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar Condômino'}
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default CadastroCondominos;