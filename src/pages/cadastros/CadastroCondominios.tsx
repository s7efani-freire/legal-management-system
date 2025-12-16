import React, { useMemo, useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import { ChevronDown } from "lucide-react";
import api from "../../services/api"; // ajuste o caminho se necessário

const inputClass =
  "w-full h-12 px-1 border-0 border-b border-gray-400 text-black bg-white " +
  "focus:border-primary hover:border-gray-600 focus:ring-0 transition-colors " +
  "placeholder:italic placeholder:text-gray-400";

const selectClass =
  "w-full h-12 px-1 appearance-none border-0 border-b border-gray-400 text-black bg-white " +
  "focus:border-primary hover:border-gray-600 focus:ring-0 transition-colors";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
] as const;

type Uf = (typeof UFS)[number];

type CondoTypeId = "APTO_BLOCO" | "APTO_SIMPLES" | "CASAS_RUA" | "CASAS_SIMPLES";

type CondoTypeDef = {
  id: CondoTypeId;
  label: string;
  description: string;
  unitFields: Array<"block" | "floor" | "number" | "street" | "tower">;
  numberLabel: "Apartamento" | "Casa" | "Unidade";
};

const CONDO_TYPES: CondoTypeDef[] = [
  {
    id: "APTO_BLOCO",
    label: "Apartamentos com bloco e andar",
    description: "Unidade composta por Bloco, Andar e Apartamento.",
    unitFields: ["block", "floor", "number"],
    numberLabel: "Apartamento",
  },
  {
    id: "APTO_SIMPLES",
    label: "Apartamentos sem bloco (andar e apartamento)",
    description: "Unidade composta por Andar e Apartamento.",
    unitFields: ["floor", "number"],
    numberLabel: "Apartamento",
  },
  {
    id: "CASAS_RUA",
    label: "Casas com rua e número",
    description: "Unidade composta por Rua e Casa (número).",
    unitFields: ["street", "number"],
    numberLabel: "Casa",
  },
  {
    id: "CASAS_SIMPLES",
    label: "Casas apenas com número",
    description: "Unidade composta apenas pelo número da Casa.",
    unitFields: ["number"],
    numberLabel: "Casa",
  },
];

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

type ApiResponse = {
  ok?: boolean;
  message?: string;
  data?: any;
  id?: number; // se você usar isso no backend
};

const initialFormData = {
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
  email: "",
  telefone: "",
  tipoTelefone: "" as "" | "MOBILE" | "LANDLINE" | "OTHER",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  uf: "" as "" | Uf,
  cidade: "",
  tipoCondominio: "" as "" | CondoTypeId,

  // garantidora
  isGuarantor: false,
};

const CadastroCondominio: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);

  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCondoType = useMemo(
    () => CONDO_TYPES.find((t) => t.id === formData.tipoCondominio) ?? null,
    [formData.tipoCondominio]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "tipoCondominio") return { ...prev, tipoCondominio: value as CondoTypeId | "" };
      if (name === "uf") return { ...prev, uf: value as Uf | "" };
      if (name === "tipoTelefone")
        return { ...prev, tipoTelefone: value as "MOBILE" | "LANDLINE" | "OTHER" | "" };
      return { ...prev, [name]: value };
    });
  };

  const handleGuarantorToggle = () => {
    setFormData((prev) => ({ ...prev, isGuarantor: !prev.isGuarantor }));
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value ?? "";
    const cep = raw.replace(/\D/g, "");

    setCepError(null);
    setFormData((prev) => ({ ...prev, cep: raw }));

    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: ViaCepResponse = await resp.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro ?? prev.logradouro,
        cidade: data.localidade ?? prev.cidade,
        uf: (data.uf as Uf) ?? prev.uf,
      }));
    } catch {
      setCepError("Falha ao consultar CEP. Verifique sua conexão.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!formData.tipoCondominio) {
      setError("Selecione o tipo de condomínio (características).");
      return;
    }
    if (!formData.razaoSocial.trim()) {
      setError("Razão Social é obrigatória.");
      return;
    }

    const payload = {
      corporate_name: formData.razaoSocial.trim(),
      trade_name: formData.nomeFantasia.trim() || null,
      email: formData.email.trim() || null,
      cnpj: formData.cnpj.trim() || null,
      phone: formData.telefone.trim() || null,
      phone_type: formData.tipoTelefone || null,
      zip_code: formData.cep.trim() || null,
      street: formData.logradouro.trim() || null,
      number: formData.numero ? Number(formData.numero) : null,
      address_complement: formData.complemento.trim() || null,
      state: formData.uf || null,
      city: formData.cidade.trim() || null,
      condo_type: formData.tipoCondominio,
      is_guarantor: formData.isGuarantor ? 1 : 0,
    };

    setIsSaving(true);

    try {
      const { data } = await api.post<ApiResponse>("/api/condominiums", payload);

      if (data?.ok === false) {
        setError(data.message || "Não foi possível cadastrar o condomínio.");
        return;
      }

      setSuccess(data?.message || "Condomínio cadastrado com sucesso.");
      setFormData(initialFormData);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Falha ao conectar ao servidor.";

      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer title="Cadastro de Condomínios" className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div>
            <label>Razão Social</label>
            <input
              type="text"
              name="razaoSocial"
              value={formData.razaoSocial}
              onChange={handleChange}
              className={inputClass}
              placeholder="Digite a razão social do condomínio"
            />
          </div>

          <div>
            <label>Nome Fantasia</label>
            <input
              type="text"
              name="nomeFantasia"
              value={formData.nomeFantasia}
              onChange={handleChange}
              className={inputClass}
              placeholder="Nome curto ou fantasia"
            />
          </div>

          <div>
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="emaildocondominio@email.com"
            />
          </div>

          <div>
            <label>CNPJ</label>
            <input
              type="text"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              className={inputClass}
              placeholder="Digite o CNPJ"
            />
          </div>

          <div>
            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+55 (xx) xxxx-xxxx"
            />
          </div>

          <div className="relative">
            <label>Tipo de Telefone</label>
            <select
              name="tipoTelefone"
              value={formData.tipoTelefone}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="" className="text-gray-400">Selecione</option>
              <option value="LANDLINE">Fixo</option>
              <option value="MOBILE">Celular</option>
              <option value="OTHER">Outro</option>
            </select>
            <ChevronDown className="absolute right-0 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block">Condomínio é garantidora?</label>
            <button
              type="button"
              onClick={handleGuarantorToggle}
              className={[
                "mt-2 inline-flex items-center gap-3 select-none",
                "rounded-full border border-gray-300 bg-white px-3 py-2",
                "hover:border-gray-400 transition-colors",
              ].join(" ")}
              aria-pressed={formData.isGuarantor}
            >
              <span
                className={[
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  formData.isGuarantor ? "bg-primary" : "bg-gray-300",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                    formData.isGuarantor ? "translate-x-5" : "translate-x-1",
                  ].join(" ")}
                />
              </span>

              <span className="text-sm text-gray-800">
                {formData.isGuarantor ? "Sim" : "Não"}
              </span>
            </button>
          </div>

          <div className="md:col-span-2 relative">
            <label>Tipo de Condomínio (características)</label>
            <select
              name="tipoCondominio"
              value={formData.tipoCondominio}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="" className="text-gray-400">Selecione</option>
              {CONDO_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>

            <ChevronDown className="absolute right-0 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />

            {selectedCondoType && (
              <div className="mt-3 text-sm text-gray-600">
                <p className="font-medium text-gray-700">{selectedCondoType.description}</p>
                <p className="mt-1">
                  Campos de unidade usados no cadastro de morador:{" "}
                  <span className="font-medium text-gray-700">
                    {selectedCondoType.unitFields
                      .map((f) => {
                        switch (f) {
                          case "block": return "Bloco";
                          case "tower": return "Torre";
                          case "floor": return "Andar";
                          case "street": return "Rua";
                          case "number": return selectedCondoType.numberLabel;
                          default: return f;
                        }
                      })
                      .join(", ")}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label>CEP</label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              onBlur={handleCepBlur}
              className={inputClass}
              placeholder="Digite o CEP"
            />
            {cepLoading && <p className="text-xs text-gray-500 mt-1">Buscando endereço...</p>}
            {cepError && <p className="text-xs text-red-600 mt-1">{cepError}</p>}
          </div>

          <div>
            <label>Logradouro</label>
            <input
              type="text"
              name="logradouro"
              value={formData.logradouro}
              onChange={handleChange}
              className={inputClass}
              placeholder="Digite a rua ou avenida"
            />
          </div>

          <div>
            <label>Número</label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className={inputClass}
              placeholder="N°"
            />
          </div>

          <div>
            <label>Complemento</label>
            <input
              type="text"
              name="complemento"
              value={formData.complemento}
              onChange={handleChange}
              className={inputClass}
              placeholder="Ex.: Bloco B, sala 10, fundos..."
            />
          </div>

          <div className="relative">
            <label>UF</label>
            <select name="uf" value={formData.uf} onChange={handleChange} className={selectClass}>
              <option value="" className="text-gray-400">Selecione</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div>
            <label>Cidade</label>
            <input
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              className={inputClass}
              placeholder="Cidade"
            />
          </div>
        </div>

        {error && <div className="text-center text-red-600 bg-red-100 p-3 rounded-md w-full">{error}</div>}
        {success && <div className="text-center text-green-600 bg-green-100 p-3 rounded-md w-full">{success}</div>}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:bg-gray-400"
          >
            {isSaving ? "Salvando..." : "Salvar Cadastro"}
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default CadastroCondominio;
