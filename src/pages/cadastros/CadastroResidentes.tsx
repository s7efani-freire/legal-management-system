import React, { useEffect, useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import axios from "axios"; // usado apenas para ViaCEP (API externa)
import { Plus, Trash2 } from "lucide-react";
import api from "../../services/api"; // ajuste o caminho se necessário
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { MOCK_CONDOMINIOS, MOCK_UNIT_OPTIONS, MockCondominio, CondoTypeId } from "../../data/mockCondominios";

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

type Condominium = MockCondominio;

type UnitFieldKey = "block" | "tower" | "floor" | "street" | "number";

type CondoTypeDef = {
  id: CondoTypeId;
  label: string;
  unitFields: UnitFieldKey[];
  numberLabel: "Apartamento" | "Casa";
};

const CONDO_TYPES: CondoTypeDef[] = [
  { id: "APTO_BLOCO", label: "Apartamentos com bloco e andar", unitFields: ["block", "floor", "number"], numberLabel: "Apartamento" },
  { id: "APTO_SIMPLES", label: "Apartamentos (andar e apartamento)", unitFields: ["floor", "number"], numberLabel: "Apartamento" },
  { id: "CASAS_RUA", label: "Casas (rua e número)", unitFields: ["street", "number"], numberLabel: "Casa" },
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

type ApiEnvelope<T> = {
  ok?: boolean;
  message?: string;
  data?: T;
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
    // Sem backend nesta versão do projeto — lista vem de dados mockados.
    setLoadingCondominiums(true);
    setCondominiums(MOCK_CONDOMINIOS);
    setLoadingCondominiums(false);
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
    if (cep.length !== 8) return;

    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          logradouro: data.logradouro ?? prev.logradouro,
          cidade: data.localidade ?? prev.cidade,
          uf: data.uf ?? prev.uf,
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  };

  const ensureUnitOptionsLoaded = (condominiumId: number) => {
    if (unitOptionsByCondo[condominiumId]) return;

    // Sem backend nesta versão do projeto — sugestões vêm de dados mockados.
    setUnitOptionsByCondo((prev) => ({
      ...prev,
      [condominiumId]: MOCK_UNIT_OPTIONS[condominiumId] ?? {},
    }));
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
        email: formData.email || null,
        phone: formData.telefone || null,
        phone_type: formData.tipoDeTelefone || null,
        zip_code: formData.cep || null,
        street: formData.logradouro || null,
        number: formData.numero || null,
        address_complement: formData.complemento || null,
        city: formData.cidade || null,
        state: formData.uf || null,
        dwellings: formData.unidades.map((u) => ({
          condominium_id: Number(u.condominiumId),
          block: u.block || null,
          tower: u.tower || null,
          floor: u.floor || null,
          street: u.street || null,
          unit_number: u.number,
        })),
      };

      const { data } = await api.post<ApiEnvelope<any>>("/api/residents", payload);

      if (data?.ok === false) {
        setError(data.message || "Ocorreu um erro ao cadastrar.");
        return;
      }

      setSuccess(data?.message ?? "Cadastro realizado com sucesso.");
      setFormData(initialFormData);
      document.getElementById("nome")?.focus();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Não foi possível conectar ao servidor.";
      setError(msg);
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
        <Input
          type="text"
          name={name}
          value={(u as any)[name]}
          onChange={(e) => handleUnitChange(index, e)}
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
              <Input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite o primeiro nome"
              />
            </div>

            <div>
              <label htmlFor="sobrenome" className="block text-sm font-medium text-text-primary mb-1">
                Sobrenome*
              </label>
              <Input
                type="text"
                id="sobrenome"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                placeholder="Digite o sobrenome"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                E-mail
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="emaildocondomino@email.com"
              />
            </div>

            <div>
              <label htmlFor="documento" className="block text-sm font-medium text-text-primary mb-1">
                Documento (CPF/CNPJ)*
              </label>
              <Input
                type="text"
                id="documento"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                placeholder="Digite o CPF ou CNPJ"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-text-primary mb-1">
                Telefone
              </label>
              <Input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="+55 (xx) xxxx-xxxx"
              />
            </div>

            <div>
              <label htmlFor="tipoDeTelefone" className="block text-sm font-medium text-text-primary mb-1">
                Tipo de telefone
              </label>
              <Select
                id="tipoDeTelefone"
                name="tipoDeTelefone"
                value={formData.tipoDeTelefone}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="LANDLINE">Fixo</option>
                <option value="MOBILE">Celular</option>
                <option value="OTHER">Outro</option>
              </Select>
            </div>

            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-text-primary mb-1">
                CEP
              </label>
              <Input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                placeholder="Digite o CEP"
              />
            </div>

            <div>
              <label htmlFor="logradouro" className="block text-sm font-medium text-text-primary mb-1">
                Logradouro
              </label>
              <Input
                type="text"
                id="logradouro"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                placeholder="Rua, avenida..."
              />
            </div>

            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-text-primary mb-1">
                Número
              </label>
              <Input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Nº"
              />
            </div>

            <div>
              <label htmlFor="complemento" className="block text-sm font-medium text-text-primary mb-1">
                Complemento
              </label>
              <Input
                type="text"
                id="complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                placeholder="Bloco, casa, etc."
              />
            </div>

            <div>
              <label htmlFor="uf" className="block text-sm font-medium text-text-primary mb-1">
                UF
              </label>
              <Select
                id="uf"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                {estados.map((sigla) => (
                  <option key={sigla} value={sigla}>
                    {sigla}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-text-primary mb-1">
                Cidade
              </label>
              <Input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
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
                    <div className="md:col-span-2">
                      <label className="text-sm">Condomínio*</label>
                      <Select
                        name="condominiumId"
                        value={u.condominiumId}
                        onChange={(e) => handleUnitChange(index, e)}
                        disabled={loadingCondominiums}
                      >
                        <option value="">
                          {loadingCondominiums ? "Carregando..." : "Selecione"}
                        </option>
                        {condominiums.map((c) => (
                          <option key={c.id} value={String(c.id)}>
                            {c.trade_name || c.corporate_name || `Condomínio #${c.id}`}
                          </option>
                        ))}
                      </Select>

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

          <Button type="submit" className="w-full max-w-sm px-8 py-3" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar Condômino"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default CadastroCondominos;
