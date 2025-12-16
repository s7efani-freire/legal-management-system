import React, { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/ui/PageContainer";
import { Info, Trash2, Plus, Building, Mail, Phone, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import DetailsPopup, { DetailItem } from "../components/ui/DetailsPopup";
import api from "../services/api";

interface Dwelling {
  unit_number: string;
  building_block?: string | null;
  condominium: string;
}

interface ResidentRow {
  id: number;
  first_name: string;
  last_name: string;
  document_number: string | null;
  email: string | null;
  phone: string | null;
  phone_type?: string | null;
  dwellings: Dwelling[];
}

const Condominos: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<DetailItem[]>([]);
  const [popupTitle, setPopupTitle] = useState("");

  const [rows, setRows] = useState<ResidentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterDoc, setFilterDoc] = useState("");
  const [filterCondo, setFilterCondo] = useState("");

  const fetchResidents = async (params?: {
    name?: string;
    document?: string;
    condominium?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/api/residents", { params });

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
        "Não foi possível carregar a lista de condôminos.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const tableRows = useMemo(() => rows, [rows]);

  const handleOpenPopup = (id: number) => {
    const r = rows.find((item) => item.id === id);
    if (!r) return;

    const fullName = `${r.first_name} ${r.last_name}`.trim();
    setPopupTitle(fullName || `Morador #${r.id}`);

    const detailsList: DetailItem[] = [
      { icon: <FileText />, label: "Documento", value: r.document_number ?? "-" },
      { icon: <Mail />, label: "Email", value: r.email ?? "-" },
      { icon: <Phone />, label: "Telefone", value: r.phone ?? "-" },
    ];

    if (r.dwellings?.length) {
      const unitsString = r.dwellings
        .map((d) => {
          const bloco = d.building_block ? `Bloco ${d.building_block} - ` : "";
          return `${d.condominium}, ${bloco}Unidade ${d.unit_number}`;
        })
        .join("\n");

      detailsList.push({ icon: <Building />, label: "Unidades", value: unitsString });
    }

    setSelectedDetails(detailsList);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedDetails([]);
    setPopupTitle("");
  };

  const handleFilter = () => {
    fetchResidents({
      name: filterName.trim() || undefined,
      document: filterDoc.trim() || undefined,
      condominium: filterCondo.trim() || undefined,
    });
  };

  const handleClear = () => {
    setFilterName("");
    setFilterDoc("");
    setFilterCondo("");
    fetchResidents();
  };

  return (
    <div className="relative">
      <PageContainer title="Condôminos">
        <div className="flex justify-end items-center mb-6">
          <Link
            to="/cadastros/condominos"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Condômino</span>
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
            placeholder="CNPJ ou CPF"
            value={filterDoc}
            onChange={(e) => setFilterDoc(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
          />

          <input
            type="text"
            placeholder="Condomínio"
            value={filterCondo}
            onChange={(e) => setFilterCondo(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
          />

          <div className="flex gap-2 sm:col-span-2 lg:col-span-2 justify-end">
            <button
              type="button"
              onClick={handleFilter}
              className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Filtrando..." : "Filtrar"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="w-full sm:w-auto bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
              disabled={loading}
            >
              Limpar
            </button>
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">CNPJ / CPF</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">Telefone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Condomínio</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : tableRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                    Nenhum condômino encontrado.
                  </td>
                </tr>
              ) : (
                tableRows.map((item) => {
                  const name = `${item.first_name} ${item.last_name}`.trim();
                  const firstCondo = item.dwellings?.length ? item.dwellings[0].condominium : "N/A";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{name || "-"}</td>
                      <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">
                        {item.document_number ?? "-"}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-600">
                        {item.phone ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">{firstCondo}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => handleOpenPopup(item.id)}
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
                  );
                })
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

export default Condominos;
