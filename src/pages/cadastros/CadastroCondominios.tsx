import React, { useState } from "react";

// --- COMPONENTE MOCKADO (Substitua pelo seu componente real) ---
// Adicionado para resolver o erro de importação.
const PageContainer: React.FC<{ title: string; className?: string; children: React.ReactNode }> = ({ title, className = '', children }) => (
  <div className={`p-4 sm:p-6 bg-gray-50 min-h-screen ${className}`}>
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">{title}</h1>
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
      {children}
    </div>
  </div>
);

// --- CLASSES DE ESTILO ---
const inputClass =
  "w-full border-0 border-b border-gray-400 focus:border-primary focus:ring-0 placeholder:italic placeholder:text-gray-400";

const getSelectClass = (value: string) =>
  `w-full appearance-none bg-transparent border-0 border-b border-gray-400
   focus:border-primary focus:ring-0
   ${value ? "not-italic text-black" : "italic text-gray-400"}`;

// --- COMPONENTE ---
const CadastroCondominio: React.FC = () => {
  // Estado do formulário apenas com os campos da primeira etapa
  const [formData, setFormData] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    email: "",
    telefone: "",
    tipoTelefone: "",
    cep: "",
    logradouro: "",
    numero: "",
    uf: "",
    cidade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário enviado:", formData);
    // Aqui você adicionaria a lógica para enviar os dados para a API
  };

  return (
    <PageContainer title="Cadastro de Condomínios" className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8 mt-8">
        {/* Campos do formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div>
            <label>Razão Social</label>
            <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} className={inputClass} placeholder="Digite a razão social do condomínio" />
          </div>
          <div>
            <label>Nome Fantasia</label>
            <input type="text" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} className={inputClass} placeholder="Nome curto ou fantasia" />
          </div>
          <div>
            <label>E-mail</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="emaildocondominio@email.com" />
          </div>
          <div>
            <label>CNPJ</label>
            <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} className={inputClass} placeholder="Digite o CNPJ" />
          </div>
          <div>
            <label>Telefone</label>
            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className={inputClass} placeholder="+55 (xx) xxxx-xxxx" />
          </div>
          <div>
            <label>Tipo de Telefone</label>
            <select name="tipoTelefone" value={formData.tipoTelefone} onChange={handleChange} className={`${getSelectClass(formData.tipoTelefone)} pr-8`}>
              <option value="" disabled hidden className="italic text-gray-400">Selecione</option>
              <option value="fixo">Fixo</option>
              <option value="celular">Celular</option>
            </select>
          </div>
          <div>
            <label>CEP</label>
            <input type="text" name="cep" value={formData.cep} onChange={handleChange} className={inputClass} placeholder="Digite o CEP" />
          </div>
          <div>
            <label>Logradouro</label>
            <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} className={inputClass} placeholder="Digite a rua ou avenida" />
          </div>
          <div>
            <label>Número</label>
            <input type="text" name="numero" value={formData.numero} onChange={handleChange} className={inputClass} placeholder="N°" />
          </div>
          <div>
            <label>UF</label>
            <select name="uf" value={formData.uf} onChange={handleChange} className={`${getSelectClass(formData.uf)} pr-8`}>
              <option value="" disabled hidden className="italic text-gray-400">Selecione</option>
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="MG">MG</option>
              {/* Adicione outros estados conforme necessário */}
            </select>
          </div>
          <div>
            <label>Cidade</label>
            <select name="cidade" value={formData.cidade} onChange={handleChange} className={`${getSelectClass(formData.cidade)} pr-8`}>
              <option value="" disabled hidden className="italic text-gray-400">Selecione</option>
              <option value="São Paulo">São Paulo</option>
              <option value="Rio de Janeiro">Rio de Janeiro</option>
              {/* Adicione outras cidades conforme necessário */}
            </select>
          </div>
        </div>

        {/* Botão de envio */}
        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Salvar Cadastro
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default CadastroCondominio;

