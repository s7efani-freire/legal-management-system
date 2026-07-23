import React, { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/ui/PageContainer";
import {
  Info,
  Trash2,
  Plus,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import DetailsPopup, { DetailItem } from "../components/ui/DetailsPopup";
import Button from "../components/ui/Button";
import api from "../services/api"

type CondominiumApi = {
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
  created_at?: string | null;
  condo_type?: string | null;
};

const Condominios: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<DetailItem[]>([]);
  const [popupTitle, setPopupTitle] = useState("");

  const [rows, setRows] = useState<CondominiumApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const fetchCondominios = async (params?: {
    name?: string;
    cnpj?: string;
    city?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
  
      const { data } = await api.get("/api/condominiums", { params });

  
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setRows(list);
    } catch (e: any) {
      console.error(e);

      const message =
        e?.response?.data?.message ||
        "Não foi possível carregar a lista de condomínios.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCondominios();
  }, []);

  const handleOpenPopup = (id: number) => {
    const condominio = rows.find((item) => item.id === id);
    if (!condominio) return;

    const title =
      condominio.corporate_name ||
      condominio.trade_name ||
      `Condomínio #${condominio.id}`;

    setPopupTitle(title);

    const trade = condominio.trade_name ?? "-";
    const cnpj = condominio.cnpj ?? "-";
    const email = condominio.email ?? "-";
    const phone = condominio.phone ?? "-";

    const address = `${condominio.street ?? "-"}, ${
      condominio.number ?? "-"
    } - ${condominio.city ?? "-"}/${condominio.state ?? "-"}`;

    const createdAt = condominio.created_at
      ? new Date(condominio.created_at).toLocaleDateString("pt-BR")
      : "-";

    const detailsList: DetailItem[] = [
      { icon: <Building />, label: "Nome Fantasia", value: trade },
      { icon: <FileText />, label: "CNPJ", value: cnpj },
      { icon: <Mail />, label: "Email", value: email },
      { icon: <Phone />, label: "Telefone", value: phone },
      { icon: <MapPin />, label: "Endereço", value: address },
      { icon: <Clock />, label: "Cliente Desde", value: createdAt },
    ];

    setSelectedDetails(detailsList);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedDetails([]);
    setPopupTitle("");
  };

  const handleFilter = () => {
    fetchCondominios({
      name: filterName.trim() || undefined,
      cnpj: filterCnpj.trim() || undefined,
      city: filterCity.trim() || undefined,
    });
  };

  const handleClear = () => {
    setFilterName("");
    setFilterCnpj("");
    setFilterCity("");
    fetchCondominios();
  };

  const tableRows = useMemo(() => rows, [rows]);

  return (
    <div className="relative">
      <PageContainer title="Condomínios">
        <div className="flex justify-end items-center mb-6">
          <Link
            to="/cadastros/condominios"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Condomínio</span>
          </Link>
        </div>

        <div className="bg-background p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Nome"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
          />

          <input
            type="text"
            placeholder="CNPJ"
            value={filterCnpj}
            onChange={(e) => setFilterCnpj(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
          />

          <input
            type="text"
            placeholder="Cidade"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
          />

          <div className="flex gap-2 sm:col-span-2 lg:col-span-2 justify-end">
            <Button type="button" onClick={handleFilter} disabled={loading} fullWidthOnMobile>
              {loading ? "Filtrando..." : "Filtrar"}
            </Button>

            <Button type="button" variant="neutral" onClick={handleClear} disabled={loading} fullWidthOnMobile>
              Limpar
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md w-full">
            {error}
          </div>
        )}

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Nome Fantasia
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">
                  CNPJ
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Telefone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Cidade
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : tableRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    Nenhum condomínio encontrado.
                  </td>
                </tr>
              ) : (
                tableRows.map((condominio) => (
                  <tr key={condominio.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {condominio.trade_name ?? "-"}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-700">
                      {condominio.cnpj ?? "-"}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-700">
                      {condominio.phone ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {condominio.city ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleOpenPopup(condominio.id)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Detalhes"
                        >
                          <Info className="w-5 h-5" />
                        </button>

                        <button
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Excluir (ainda não implementado)"
                          disabled
                        >
                          <Trash2 className="w-5 h-5 opacity-50" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PageContainer>

      <DetailsPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={popupTitle}
        details={selectedDetails}
      />
    </div>
  );
};

export default Condominios;
