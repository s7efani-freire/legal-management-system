import React, { useMemo, useState } from "react";
import { X, Search, ShieldCheck } from "lucide-react";
import Button from "./Button";

export interface PermissionItem {
  id: number;
  name: string;
  description: string;
}

interface PermissionsEditorPopupProps {
  isOpen: boolean;
  loading?: boolean;
  userName: string;
  allPermissions: PermissionItem[];
  selected: string[]; // permission names
  onClose: () => void;
  onSave: (nextSelected: string[]) => void;
}

const PermissionsEditorPopup: React.FC<PermissionsEditorPopupProps> = ({
  isOpen,
  loading = false,
  userName,
  allPermissions,
  selected,
  onClose,
  onSave,
}) => {
  const [query, setQuery] = useState("");
  const [localSelected, setLocalSelected] = useState<string[]>(selected);

  // quando abrir, sincroniza seleção local com seleção recebida
  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setLocalSelected(selected);
    }
  }, [isOpen, selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPermissions;
    return allPermissions.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [allPermissions, query]);

  const isChecked = (permName: string) => localSelected.includes(permName);

  const toggle = (permName: string) => {
    setLocalSelected((prev) => {
      if (prev.includes(permName)) return prev.filter((x) => x !== permName);
      return [...prev, permName];
    });
  };

  const selectAllFiltered = () => {
    const names = filtered.map((p) => p.name);
    setLocalSelected((prev) => Array.from(new Set([...prev, ...names])));
  };

  const clearAll = () => setLocalSelected([]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-gray-200 overflow-hidden">
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Gerenciar permissões
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Usuário: <span className="font-medium text-gray-800">{userName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-700 disabled:opacity-60"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* search + actions */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar permissões..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={selectAllFiltered}
                disabled={loading || filtered.length === 0}
                className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60 text-sm"
              >
                Marcar filtradas
              </button>
              <button
                onClick={clearAll}
                disabled={loading || localSelected.length === 0}
                className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60 text-sm"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* list */}
        <div className="max-h-[50vh] overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <div className="text-sm text-gray-500">Nenhuma permissão encontrada.</div>
          ) : (
            <ul className="space-y-2">
              {filtered.map((perm) => (
                <li
                  key={perm.id}
                  className="flex items-start justify-between gap-4 p-3 rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900">{perm.description}</div>
                    <div className="text-xs text-gray-500 break-all">{perm.name}</div>
                  </div>

                  <label className="flex items-center gap-2 shrink-0 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked(perm.name)}
                      onChange={() => toggle(perm.name)}
                      disabled={loading}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">Ativa</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button onClick={() => onSave(localSelected)} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsEditorPopup;
