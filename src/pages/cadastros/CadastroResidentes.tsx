import React, { useEffect, useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import axios from "axios";
import { Plus, Trash2, ChevronDown } from "lucide-react";

const inputClass =
  "w-full h-12 px-1 border-0 border-b border-gray-400 text-black bg-white " +
  "focus:border-primary focus:ring-0 hover:border-gray-600 transition-colors " +
  "placeholder:italic placeholder:text-gray-400";

const selectClass =
  "w-full h-12 px-1 appearance-none border-0 border-b border-gray-400 text-black bg-white " +
  "focus:border-primary focus:ring-0 hover:border-gray-600 transition-colors";

const estados = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

type CondoTypeId = "APTO_BLOCO" | "APTO_SIMPLES" | "CASAS_RUA" | "CASAS_SIMPLES";

type Condominium = {
  id: number;
  trade_name?: string;
  corporate_name?: string;
  condo_type: CondoTypeId;
};

type UnitFieldKey = "block" | "tower" | "floor" | "street" | "number";

type CondoTypeDef = {
  id: CondoTypeId;
  label: string;
  unitFields: UnitFieldKey[];
  numberLabel: "Apartamento" | "Casa";
};

const CONDO_TYPES: CondoTypeDef[] = [
  { id: "APTO_BLOCO", label: "Apartamentos com bloco e andar", unitFields: ["block","floor","number"], numberLabel: "Apartamento" },
  { id: "APTO_SIMPLES", label: "Apartamentos (andar e apartamento)", unitFields: ["floor","number"], numberLabel: "Apartamento" },
  { id: "CASAS_RUA", label: "Casas (rua e número)", unitFields: ["street","number"], numberLabel: "Casa" },
  { id: "CASAS_SIMPLES", label: "Casas (somente número)", unitFields: ["number"], numberLabel: "Casa" },
];

type UnitAutocompleteOptions = Partial<Record<UnitFieldKey, string[]>>;

type UnitForm = {
  condominiumId: string;
  block: string;
  tower: string;
  floor: string;
  street: string;
  number: string;
};

const emptyUnit = (): UnitForm => ({
  condominiumId: "",
  block: "",
  tower: "",
  floor: "",
  street: "",
  number: "",
});

const initialFormData = {
  nome: "",
  sobrenome: "",
  email: "",
  documento: "",
  telefone: "",
  tipoDeTelefone: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  uf: "",
  cidade: "",
  unidades: [emptyUnit()],
};

const CadastroCondominos: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [loadingCondominiums, setLoadingCondominiums] = useState(false);

  const [unitOptionsByCondo, setUnitOptionsByCondo] =
    useState<Record<number, UnitAutocompleteOptions>>({});

  const [formData, setFormData] = useState(initialFormData);

 
  useEffect(() => {
    const loadCondominiums = async () => {
      setLoadingCondominiums(true);
      try {
        const { data } = await axios.get("http://localhost:8000/api/condominiums");
        setCondominiums(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError("Não foi possível carregar a lista de condomínios.");
      } finally {
        setLoadingCondominiums(false);
      }
    };

    loadCondominiums();
  }, []);

  const getCondoById = (idStr: string) => {
    const id = Number(idStr);
    if (!id) return null;
    return condominiums.find((c) => c.id === id) ?? null;
  };

  const getCondoTypeDef = (condo: Condominium | null) =>
    condo ? CONDO_TYPES.find((t) => t.id === condo.condo_type) ?? null : null;

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            logradouro: data.logradouro,
            cidade: data.localidade,
            uf: data.uf,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      }
    }
  };

 
  const ensureUnitOptionsLoaded = async (condominiumId: number) => {
    if (unitOptionsByCondo[condominiumId]) return;

    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/units/options?condominium_id=${condominiumId}`
      );

      setUnitOptionsByCondo((prev) => ({
        ...prev,
        [condominiumId]: {
          block: data.block ?? [],
          tower: data.tower ?? [],
          floor: data.floor ?? [],
          street: data.street ?? [],
          number: (data.number ?? []).map(String),
        },
      }));
    } catch (e) {
      console.error(e);
      setUnitOptionsByCondo((prev) => ({ ...prev, [condominiumId]: {} }));
    }
  };

  type UnitFieldName = keyof UnitForm;

  const handleUnitChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name as UnitFieldName;
    const value = e.target.value;

    setFormData((prev) => {
      const unidades = [...prev.unidades];

      if (name === "condominiumId") {
        unidades[index] = { ...emptyUnit(), condominiumId: value };
      } else {
        unidades[index] = { ...unidades[index], [name]: value };
      }

      return { ...prev, unidades };
    });

    if (name === "condominiumId") {
      const condoId = Number(value);
      if (condoId) await ensureUnitOptionsLoaded(condoId);
    }
  };

  const addUnit = () => {
    setFormData((prev) => ({ ...prev, unidades: [...prev.unidades, emptyUnit()] }));
  };

  const removeUnit = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      unidades: prev.unidades.filter((_, index) => index !== indexToRemove),
    }));
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

    for (let i = 0; i < formData.unidades.length; i++) {
      const u = formData.unidades[i];
      const condo = getCondoById(u.condominiumId);

      if (!condo) {
        setError(`Selecione um condomínio válido na unidade #${i + 1}.`);
        setIsLoading(false);
        return;
      }

      const typeDef = getCondoTypeDef(condo);
      if (!typeDef) {
        setError(`Tipo de condomínio não encontrado para a unidade #${i + 1}.`);
        setIsLoading(false);
        return;
      }

      const required: UnitFieldKey[] = typeDef.unitFields;
      const missing = required.filter((k) => !u[k]?.trim());

      if (missing.length) {
        setError(`Preencha os campos da unidade #${i + 1}: ${missing.join(", ")}.`);
        setIsLoading(false);
        return;
      }
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
        dwellings: formData.unidades.map((u) => ({
          condominium_id: Number(u.condominiumId),
          block: u.block || null,
          tower: u.tower || null,
          floor: u.floor || null,
          street: u.street || null,
          unit_number: u.number,
        })),
      };

      const { data } = await axios.post("http://localhost:8000/api/residents", payload);

      setSuccess(data.message ?? "Cadastro realizado com sucesso.");
      setFormData(initialFormData);
      document.getElementById("nome")?.focus();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const msg =
          (err.response.data as { message?: string } | undefined)?.message ||
          "Ocorreu um erro ao cadastrar.";
        setError(msg);
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderUnitField = (
    index: number,
    field: UnitFieldKey,
    condoId: number | null,
    numberLabel: "Apartamento" | "Casa"
  ) => {
    const u = formData.unidades[index];

    const options = condoId ? unitOptionsByCondo[condoId]?.[field] ?? [] : [];
    const datalistId = condoId ? `dl-${field}-${condoId}` : `dl-${field}-none`;

    const label =
      field === "block"
        ? "Bloco"
        : field === "tower"
        ? "Torre"
        : field === "floor"
        ? "Andar"
        : field === "street"
        ? "Rua"
        : numberLabel;

    const placeholder =
      field === "block"
        ? "Ex: A, PITANGA, 2"
        : field === "tower"
        ? "Ex: 1, 2, Norte"
        : field === "floor"
        ? "Ex: 1, 2, Térreo"
        : field === "street"
        ? "Ex: 1, Alameda A"
        : numberLabel === "Casa"
        ? "Ex: 15"
        : "Ex: 101";

    const name = field === "number" ? "number" : field;

    return (
      <div key={field}>
        <label className="text-sm">{label}*</label>
        <input
          type="text"
          name={name}
          value={u[name]}
          onChange={(e) => handleUnitChange(index, e)}
          className={inputClass}
          placeholder={placeholder}
          list={options.length ? datalistId : undefined}
          disabled={!u.condominiumId}
        />
        {options.length > 0 && (
          <datalist id={datalistId}>
            {options.map((opt) => (
              <option key={`${datalistId}-${opt}`} value={opt} />
            ))}
          </datalist>
        )}
      </div>
    );
  };

  return (
    <PageContainer title="Cadastro de Condôminos" className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-text-secondary mb-4">
            Informações Pessoais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-text-primary mb-1">
                Nome*
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={inputClass}
                placeholder="Digite o primeiro nome"
              />
            </div>

            <div>
              <label htmlFor="sobrenome" className="block text-sm font-medium text-text-primary mb-1">
                Sobrenome*
              </label>
              <input
                type="text"
                id="sobrenome"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                className={inputClass}
                placeholder="Digite o sobrenome"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="emaildocondomino@email.com"
              />
            </div>

            <div>
              <label htmlFor="documento" className="block text-sm font-medium text-text-primary mb-1">
                Documento (CPF/CNPJ)*
              </label>
              <input
                type="text"
                id="documento"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                className={inputClass}
                placeholder="Digite o CPF ou CNPJ"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-text-primary mb-1">
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+55 (xx) xxxx-xxxx"
              />
            </div>

            <div className="relative">
              <label htmlFor="tipoDeTelefone" className="block text-sm font-medium text-text-primary mb-1">
                Tipo de telefone
              </label>
              <select
                id="tipoDeTelefone"
                name="tipoDeTelefone"
                value={formData.tipoDeTelefone}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="" className="text-gray-400">Selecione</option>
                <option value="Celular">Celular</option>
                <option value="Fixo">Fixo</option>
                <option value="Whatsapp">Whatsapp</option>
              </select>
              <ChevronDown className="absolute right-0 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-text-primary mb-1">
                CEP
              </label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                className={inputClass}
                placeholder="Digite o CEP"
              />
            </div>

            <div>
              <label htmlFor="logradouro" className="block text-sm font-medium text-text-primary mb-1">
                Logradouro
              </label>
              <input
                type="text"
                id="logradouro"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                className={inputClass}
                placeholder="Rua, avenida..."
              />
            </div>

            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-text-primary mb-1">
                Número
              </label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className={inputClass}
                placeholder="Nº"
              />
            </div>

            <div>
              <label htmlFor="complemento" className="block text-sm font-medium text-text-primary mb-1">
                Complemento
              </label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                className={inputClass}
                placeholder="Bloco, casa, etc."
              />
            </div>

            <div className="relative">
              <label htmlFor="uf" className="block text-sm font-medium text-text-primary mb-1">
                UF
              </label>
              <select
                id="uf"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="" className="text-gray-400">Selecione</option>
                {estados.map((sigla) => (
                  <option key={sigla} value={sigla}>
                    {sigla}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-text-primary mb-1">
                Cidade
              </label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className={inputClass}
                placeholder="Cidade"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-text-secondary mb-4">
            Unidades Residenciais
          </h3>

          <div className="space-y-6">
            {formData.unidades.map((u, index) => {
              const condo = getCondoById(u.condominiumId);
              const typeDef = getCondoTypeDef(condo);
              const condoIdNum = condo?.id ?? null;
              const numberLabel = typeDef?.numberLabel ?? "Apartamento";

              return (
                <div key={index} className="border border-gray-100 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2 relative">
                      <label className="text-sm">Condomínio*</label>
                      <select
                        name="condominiumId"
                        value={u.condominiumId}
                        onChange={(e) => handleUnitChange(index, e)}
                        className={selectClass}
                        disabled={loadingCondominiums}
                      >
                        <option value="" className="text-gray-400">
                          {loadingCondominiums ? "Carregando..." : "Selecione"}
                        </option>
                        {condominiums.map((c) => (
                          <option key={c.id} value={String(c.id)}>
                            {c.trade_name || c.corporate_name || `Condomínio #${c.id}`}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="absolute right-0 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />

                      {condo && typeDef && (
                        <p className="mt-1 text-xs text-gray-500">
                          Tipo: <span className="font-medium">{typeDef.label}</span>
                        </p>
                      )}
                    </div>

                    {typeDef ? (
                      <>
                        {typeDef.unitFields.map((field) =>
                          renderUnitField(index, field, condoIdNum, numberLabel)
                        )}

                        {formData.unidades.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeUnit(index)}
                            className="text-red-500 hover:text-red-700 p-2 self-end"
                            title="Remover unidade"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="md:col-span-3 text-sm text-gray-500">
                          Selecione um condomínio para preencher os campos da unidade.
                        </div>

                        {formData.unidades.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeUnit(index)}
                            className="text-red-500 hover:text-red-700 p-2 self-end"
                            title="Remover unidade"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addUnit}
            className="text-primary font-medium flex items-center gap-1 mt-4"
          >
            <Plus className="w-4 h-4" />
            Adicionar Unidade
          </button>
        </div>

        <div className="flex flex-col items-center pt-6">
          {error && (
            <div className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md w-full">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded-md w-full">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors w-full max-w-sm disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar Condômino"}
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default CadastroCondominos;
