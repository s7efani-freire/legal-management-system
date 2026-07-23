// Dados mockados — não há backend nesta versão do projeto.
// Fonte única usada pelas telas de Condomínios e pelo cadastro de Condôminos.

export type CondoTypeId = "APTO_BLOCO" | "APTO_SIMPLES" | "CASAS_RUA" | "CASAS_SIMPLES";

export interface MockCondominio {
  id: number;
  corporate_name: string;
  trade_name: string | null;
  cnpj: string | null;
  email: string | null;
  phone: string | null;
  zip_code: string | null;
  street: string | null;
  number: number | null;
  city: string | null;
  state: string | null;
  created_at: string | null;
  condo_type: CondoTypeId;
}

export const MOCK_CONDOMINIOS: MockCondominio[] = [
  {
    id: 1,
    corporate_name: "Condomínio Residencial Jardim das Palmeiras Ltda.",
    trade_name: "Jardim das Palmeiras",
    cnpj: "12.345.678/0001-90",
    email: "sindico@jardimdaspalmeiras.com.br",
    phone: "(11) 3456-7890",
    zip_code: "01234-000",
    street: "Rua das Palmeiras",
    number: 120,
    city: "São Paulo",
    state: "SP",
    created_at: "2023-02-10",
    condo_type: "APTO_BLOCO",
  },
  {
    id: 2,
    corporate_name: "Edifício Blue Sky Empreendimentos Ltda.",
    trade_name: "Blue Sky",
    cnpj: "23.456.789/0001-01",
    email: "contato@bluesky.com.br",
    phone: "(11) 2345-6789",
    zip_code: "04567-000",
    street: "Avenida Azul",
    number: 890,
    city: "São Paulo",
    state: "SP",
    created_at: "2022-11-05",
    condo_type: "APTO_SIMPLES",
  },
  {
    id: 3,
    corporate_name: "Condomínio Villa das Flores Ltda.",
    trade_name: "Villa das Flores",
    cnpj: "34.567.890/0001-12",
    email: "administracao@villadasflores.com.br",
    phone: "(21) 3344-5566",
    zip_code: "22000-000",
    street: "Rua das Flores",
    number: 45,
    city: "Rio de Janeiro",
    state: "RJ",
    created_at: "2024-01-20",
    condo_type: "CASAS_RUA",
  },
  {
    id: 4,
    corporate_name: "Residencial Monte Verde Ltda.",
    trade_name: "Monte Verde",
    cnpj: "45.678.901/0001-23",
    email: "sindico@monteverde.com.br",
    phone: "(31) 3232-1010",
    zip_code: "30140-000",
    street: "Rua Monte Verde",
    number: 300,
    city: "Belo Horizonte",
    state: "MG",
    created_at: "2023-07-15",
    condo_type: "CASAS_SIMPLES",
  },
];

// Sugestões de autocomplete por condomínio, usadas no cadastro de unidades.
export const MOCK_UNIT_OPTIONS: Record<
  number,
  Partial<Record<"block" | "tower" | "floor" | "street" | "number", string[]>>
> = {
  1: { block: ["A", "B", "C"], floor: ["1", "2", "3", "4"], number: ["101", "102", "201", "202"] },
  2: { floor: ["1", "2", "3"], number: ["101", "102", "201", "1102"] },
  3: { street: ["Rua das Flores", "Alameda A"], number: ["12", "45", "702"] },
  4: { number: ["10", "15", "22"] },
};
