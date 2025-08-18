import React, { useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const inputClass =
  "w-full border-0 border-b border-gray-400 focus:border-primary focus:ring-0 placeholder:italic placeholder:text-gray-400";

const getSelectClass = (value: string) =>
  `w-full appearance-none bg-transparent border-0 border-b border-gray-400
   focus:border-primary focus:ring-0
   ${value ? "not-italic text-black" : "italic text-gray-400"}`;


const steps = ["Informações Gerais", "Unidades Residenciais", "Numeração das Unidades"];

const CadastroCondominio: React.FC = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Passo 1
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

    // Passo 2
    possuiBlocos: true,
    possuiAndares: true,
    blocos: [{ nome: "", andarInicial: "", andarFinal: "" }],

    // Passo 3
    unidades: [{ bloco: "", andar: "", numeroInicial: "", numeroFinal: "" }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form enviado:", formData);
  };

  return (
    <PageContainer title="Cadastro de Condomínios" className="max-w-4xl">
      {/* Barra de progresso com etapas */}
      <div className="flex items-center justify-between mb-8 relative w-full">
        {/* Linha de fundo */}
        <div className="absolute top-4 left-0 w-full h-1 bg-gray-200"></div>

        {/* Linha preenchida */}
        <motion.div
          className="absolute top-4 left-0 h-1 bg-primary z-0"
          initial={{ width: 0 }}
          animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Bolinhas com números */}
        {steps.map((label, index) => (
          <div key={index} className="flex-1 flex flex-col items-center relative z-10">
            <motion.div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium ${step >= index + 1
                  ? "bg-primary text-white border-primary"
                  : "border-gray-400 text-gray-400"
                }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: step === index + 1 ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {index + 1}
            </motion.div>
            <span className="text-sm mt-2 text-center">{label}</span>
          </div>
        ))}
      </div>


      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ETAPA 1 */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-6">
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
              </select>
            </div>
            <div>
              <label>Cidade</label>
              <select name="cidade" value={formData.cidade} onChange={handleChange} className={`${getSelectClass(formData.cidade)} pr-8`}>
                <option value="" disabled hidden className="italic text-gray-400">Selecione</option>
                <option value="São Paulo">São Paulo</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
              </select>
            </div>
          </div>
        )}

        {/* ETAPA 2 */}
        {step === 2 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Unidades Residenciais</h3>
            <div className="flex gap-8">
              <div>
                <p>O condomínio possui blocos?</p>
                <label><input type="radio" name="possuiBlocos" checked={formData.possuiBlocos} onChange={() => setFormData({ ...formData, possuiBlocos: true })} /> Sim</label>
                <label className="ml-4"><input type="radio" name="possuiBlocos" checked={!formData.possuiBlocos} onChange={() => setFormData({ ...formData, possuiBlocos: false })} /> Não</label>
              </div>
              <div>
                <p>O condomínio possui andares?</p>
                <label><input type="radio" name="possuiAndares" checked={formData.possuiAndares} onChange={() => setFormData({ ...formData, possuiAndares: true })} /> Sim</label>
                <label className="ml-4"><input type="radio" name="possuiAndares" checked={!formData.possuiAndares} onChange={() => setFormData({ ...formData, possuiAndares: false })} /> Não</label>
              </div>
            </div>

            {formData.blocos.map((bloco, index) => (
              <div key={index} className="grid grid-cols-3 gap-6 mt-4">
                <input type="text" placeholder="Nome do bloco" value={bloco.nome} onChange={(e) => {
                  const newBlocos = [...formData.blocos];
                  newBlocos[index].nome = e.target.value;
                  setFormData({ ...formData, blocos: newBlocos });
                }} className={inputClass} />
                <input type="text" placeholder="Andar inicial" value={bloco.andarInicial} onChange={(e) => {
                  const newBlocos = [...formData.blocos];
                  newBlocos[index].andarInicial = e.target.value;
                  setFormData({ ...formData, blocos: newBlocos });
                }} className={inputClass} />
                <input type="text" placeholder="Andar final" value={bloco.andarFinal} onChange={(e) => {
                  const newBlocos = [...formData.blocos];
                  newBlocos[index].andarFinal = e.target.value;
                  setFormData({ ...formData, blocos: newBlocos });
                }} className={inputClass} />
              </div>
            ))}

            <button type="button" onClick={() => setFormData({ ...formData, blocos: [...formData.blocos, { nome: "", andarInicial: "", andarFinal: "" }] })} className="text-primary mt-4">+ Adicionar</button>
          </div>
        )}

        {/* ETAPA 3 */}
        {step === 3 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Numeração das Unidades</h3>
            {formData.unidades.map((uni, index) => (
              <div key={index} className="grid grid-cols-4 gap-6 mt-4">
                <select
                  value={uni.bloco}
                  onChange={(e) => {
                    const newUnidades = [...formData.unidades];
                    newUnidades[index].bloco = e.target.value;
                    setFormData({ ...formData, unidades: newUnidades });
                  }}
                  className={getSelectClass(uni.bloco)}
                >
                  <option value="" disabled hidden className="italic text-gray-400">Bloco</option>
                  {formData.blocos.map((b, i) => (
                    <option key={i} value={b.nome}>
                      {b.nome || `Bloco ${i + 1}`}
                    </option>
                  ))}
                </select>

                <select
                  value={uni.andar}
                  onChange={(e) => {
                    const newUnidades = [...formData.unidades];
                    newUnidades[index].andar = e.target.value;
                    setFormData({ ...formData, unidades: newUnidades });
                  }}
                  className={getSelectClass(uni.andar)}
                >
                  <option value="" disabled hidden className="italic text-gray-400">Andar</option>
                  {[...Array(20)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <input type="text" placeholder="Número inicial" value={uni.numeroInicial} onChange={(e) => {
                  const newUnidades = [...formData.unidades];
                  newUnidades[index].numeroInicial = e.target.value;
                  setFormData({ ...formData, unidades: newUnidades });
                }} className={inputClass} />
                <input type="text" placeholder="Número final" value={uni.numeroFinal} onChange={(e) => {
                  const newUnidades = [...formData.unidades];
                  newUnidades[index].numeroFinal = e.target.value;
                  setFormData({ ...formData, unidades: newUnidades });
                }} className={inputClass} />
              </div>
            ))}
            <button type="button" onClick={() => setFormData({ ...formData, unidades: [...formData.unidades, { bloco: "", andar: "", numeroInicial: "", numeroFinal: "" }] })} className="text-primary mt-4">+ Adicionar</button>
          </div>
        )}

        {/* Botões de navegação */}
        <div className="flex justify-between">
          {step > 1 && (
            <button type="button" onClick={handlePrev} className="bg-gray-300 text-black px-6 py-2 rounded-lg">
              Voltar
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={handleNext} className="bg-primary text-white px-6 py-2 rounded-lg">
              Próximo
            </button>
          ) : (
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-medium">
              Finalizar
            </button>
          )}
        </div>
      </form>
    </PageContainer>
  );
};

export default CadastroCondominio;
