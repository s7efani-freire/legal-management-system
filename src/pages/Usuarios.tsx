import React, { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/ui/PageContainer";
import {
  Info,
  Trash2,
  Mail,
  Shield,
  Clock,
  Pencil,
  Home,
  Scale,
  DollarSign,
  Users,
  Building,
  UserCheck,
  Plus,
} from "lucide-react";
import DetailsPopup, { DetailItem } from "../components/ui/DetailsPopup";
import api from "../services/api";
import ConfirmDeletePopup from "../components/ui/ConfirmDeletePopup";
import PermissionsEditorPopup, { PermissionItem } from "../components/ui/PermissionsEditorPopup";

interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
  user_type: string;
  cadastradoEm: string | null;
  ultimaAtualizacao: string | null;

  // permissões reais (names)
  permissions: string[];
}

type Groups = Record<string, User[]>;

interface UserTableProps {
  title: string;
  users: User[];
  onOpenPopup: (id: number) => void;
  onDelete: (id: number) => void;
  onEditPermissions: (id: number) => void;

  // para render/tooltip com descriptions
  permissionDescByName: Record<string, string>;

  // NOVO: controla quais ações aparecem
  hideEdit?: boolean;
  hideDelete?: boolean;
}

type PermissionKey =
  | "dashboard"
  | "acoes"
  | "honorarios"
  | "usuarios"
  | "condominios"
  | "condominos"
  | "cadastros";

const PERMISSION_MAP: Record<
  PermissionKey,
  { icon: any; label: string; names: string[] | ((p: string[]) => boolean) }
> = {
  dashboard: { icon: Home, label: "Área de Trabalho", names: ["dashboard.view"] },
  acoes: { icon: Scale, label: "Ações Legais", names: ["acoes_legais.view"] },
  honorarios: { icon: DollarSign, label: "Honorários", names: ["honorarios.view"] },
  usuarios: { icon: Users, label: "Usuários", names: ["usuarios.view"] },
  condominios: { icon: Building, label: "Condomínios", names: ["condominios.view"] },
  condominos: { icon: UserCheck, label: "Condôminos", names: ["condominos.view"] },
  cadastros: { icon: Plus, label: "Cadastros", names: (perms) => perms.some((x) => x.startsWith("cadastro.")) },
};

function hasPermissionGroup(userPerms: string[], def: (typeof PERMISSION_MAP)[PermissionKey]) {
  if (typeof def.names === "function") return def.names(userPerms);
  return def.names.some((n) => userPerms.includes(n));
}

function formatPermissionDescriptions(perms: string[], descByName: Record<string, string>) {
  if (!perms || perms.length === 0) return "—";
  const descs = perms.map((p) => descByName[p] ?? p).sort((a, b) => a.localeCompare(b));
  return descs.join(", ");
}

const PermissionsIcons: React.FC<{
  userPerms: string[];
  permissionDescByName: Record<string, string>;
}> = ({ userPerms, permissionDescByName }) => {
  const activeDescs = userPerms
    .map((p) => permissionDescByName[p] ?? p)
    .sort((a, b) => a.localeCompare(b))
    .join("\n");

  return (
    <div className="flex items-center gap-2" title={activeDescs || "Sem permissões"}>
      {(Object.keys(PERMISSION_MAP) as PermissionKey[]).map((key) => {
        const def = PERMISSION_MAP[key];
        const Icon = def.icon;
        const active = hasPermissionGroup(userPerms, def);

        return (
          <span
            key={key}
            className={[
              "inline-flex items-center justify-center rounded-md border",
              "w-8 h-8",
              active ? "border-primary/20 bg-primary/10" : "border-gray-200 bg-gray-50",
            ].join(" ")}
            title={def.label}
          >
            <Icon className={active ? "w-4 h-4 text-primary" : "w-4 h-4 text-gray-300"} />
          </span>
        );
      })}
    </div>
  );
};

const UserTable: React.FC<UserTableProps> = ({
  title,
  users,
  onOpenPopup,
  onDelete,
  onEditPermissions,
  permissionDescByName,
  hideEdit = false,
  hideDelete = false,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-text-secondary mb-4">{title}</h2>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-background">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">
                Cadastrado em
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Permissões</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">
                Última atualização
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{user.nome}</td>
                <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">{user.cadastradoEm ?? "—"}</td>

                <td className="px-4 py-3 text-sm text-gray-800">
                  <PermissionsIcons userPerms={user.permissions ?? []} permissionDescByName={permissionDescByName} />
                </td>

                <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-600">{user.ultimaAtualizacao ?? "—"}</td>

                <td className="px-4 py-3 text-sm text-gray-800">
                  <div className="flex items-center justify-center space-x-3">
                    {/* Detalhes - mantém sempre */}
                    <button
                      onClick={() => onOpenPopup(user.id)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Detalhes"
                    >
                      <Info className="w-5 h-5" />
                    </button>

                    {/* Editar permissões - removido na tabela ADMIN */}
                    {!hideEdit && (
                      <button
                        onClick={() => onEditPermissions(user.id)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Editar permissões"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                    )}

                    {/* Desativar - removido na tabela ADMIN */}
                    {!hideDelete && (
                      <button
                        onClick={() => onDelete(user.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        disabled={user.user_type === "ADMIN"}
                        title={user.user_type === "ADMIN" ? "Não é permitido desativar ADMIN" : "Desativar usuário"}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-sm text-gray-500" colSpan={5}>
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Usuarios: React.FC = () => {
  const [groups, setGroups] = useState<Groups>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const allUsers = useMemo(() => Object.values(groups).flat(), [groups]);

  // delete popup
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // details popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<DetailItem[]>([]);
  const [popupTitle, setPopupTitle] = useState("");

  // permissions popup
  const [isPermsOpen, setIsPermsOpen] = useState(false);
  const [permsSaving, setPermsSaving] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [allPermissions, setAllPermissions] = useState<PermissionItem[]>([]);

  const permissionDescByName = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of allPermissions) {
      m[p.name] = p.description || p.name;
    }
    return m;
  }, [allPermissions]);

  const editingUser = useMemo(() => {
    if (!editingUserId) return null;
    return allUsers.find((u) => u.id === editingUserId) ?? null;
  }, [editingUserId, allUsers]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const usersResp = await api.get("/api/users");
        setGroups(usersResp.data.groups ?? {});

        const permsResp = await api.get("/api/permissions");
        setAllPermissions(permsResp.data.data?.permissions ?? permsResp.data.permissions ?? []);
      } catch (e: any) {
        setError(e?.response?.data?.message ?? "Erro ao carregar usuários/permissões");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleOpenPopup = (id: number) => {
    const user = allUsers.find((u) => u.id === id);
    if (!user) return;

    setPopupTitle(user.nome);

    const detailsList: DetailItem[] = [
      { icon: <Mail />, label: "Email", value: user.email },
      { icon: <Shield />, label: "Cargo", value: user.role },
      { icon: <Clock />, label: "Usuário desde", value: user.cadastradoEm ?? "—" },
      { icon: <Clock />, label: "Última Atualização", value: user.ultimaAtualizacao ?? "—" },
      {
        label: "Permissões Concedidas",
        value: formatPermissionDescriptions(user.permissions ?? [], permissionDescByName),
        isFullWidth: true,
      },
    ];

    setSelectedDetails(detailsList);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedDetails([]);
    setPopupTitle("");
  };

  const handleDelete = (id: number) => {
    const user = allUsers.find((u) => u.id === id);
    if (!user) return;
    if (user.user_type === "ADMIN") return;

    setUserIdToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userIdToDelete) return;

    try {
      setDeleting(true);

      await api.post("/api/users/deactivate", { id: userIdToDelete });

      setGroups((prev) => {
        const next: Groups = {};
        for (const [type, list] of Object.entries(prev)) {
          next[type] = list.filter((u) => u.id !== userIdToDelete);
        }
        return next;
      });

      if (isPopupOpen) handleClosePopup();

      setIsConfirmOpen(false);
      setUserIdToDelete(null);
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Erro ao desativar usuário");
    } finally {
      setDeleting(false);
    }
  };

  const openPermissionsEditor = (id: number) => {
    setEditingUserId(id);
    setIsPermsOpen(true);
  };

  const savePermissions = async (nextSelected: string[]) => {
    if (!editingUserId) return;

    try {
      setPermsSaving(true);

      await api.post("/api/users/permissions/set", {
        id: editingUserId,
        permissions: nextSelected,
      });

      setGroups((prev) => {
        const next: Groups = {};
        for (const [type, list] of Object.entries(prev)) {
          next[type] = list.map((u) => {
            if (u.id !== editingUserId) return u;
            return { ...u, permissions: nextSelected };
          });
        }
        return next;
      });

      if (isPopupOpen && editingUser) {
        handleOpenPopup(editingUserId);
      }

      setIsPermsOpen(false);
      setEditingUserId(null);
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Erro ao salvar permissões");
    } finally {
      setPermsSaving(false);
    }
  };

  return (
    <div className="relative">
      <PageContainer title="Usuários">
        {loading && <div className="text-sm text-gray-600">Carregando...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="space-y-10">
            <UserTable
              title="Advogados"
              users={groups["LAWYER"] ?? []}
              onOpenPopup={handleOpenPopup}
              onDelete={handleDelete}
              onEditPermissions={openPermissionsEditor}
              permissionDescByName={permissionDescByName}
            />
            <UserTable
              title="Financeiro"
              users={groups["ACCOUNTING"] ?? []}
              onOpenPopup={handleOpenPopup}
              onDelete={handleDelete}
              onEditPermissions={openPermissionsEditor}
              permissionDescByName={permissionDescByName}
            />
            <UserTable
              title="Gestores"
              users={groups["MANAGER"] ?? []}
              onOpenPopup={handleOpenPopup}
              onDelete={handleDelete}
              onEditPermissions={openPermissionsEditor}
              permissionDescByName={permissionDescByName}
            />

            {/* AQUI: ADMIN sem editar/excluir */}
            <UserTable
              title="Administradores"
              users={groups["ADMIN"] ?? []}
              onOpenPopup={handleOpenPopup}
              onDelete={handleDelete}
              onEditPermissions={openPermissionsEditor}
              permissionDescByName={permissionDescByName}
              hideEdit
              hideDelete
            />
          </div>
        )}
      </PageContainer>

      <DetailsPopup isOpen={isPopupOpen} onClose={handleClosePopup} title={popupTitle} details={selectedDetails} />

      <ConfirmDeletePopup
        isOpen={isConfirmOpen}
        loading={deleting}
        onClose={() => {
          if (deleting) return;
          setIsConfirmOpen(false);
          setUserIdToDelete(null);
        }}
        onConfirm={confirmDelete}
        message="Deseja realmente desativar este usuário? Ele não poderá acessar o sistema até ser reativado."
      />

      <PermissionsEditorPopup
        isOpen={isPermsOpen}
        loading={permsSaving}
        userName={editingUser?.nome ?? "Usuário"}
        allPermissions={allPermissions}
        selected={editingUser?.permissions ?? []}
        onClose={() => {
          if (permsSaving) return;
          setIsPermsOpen(false);
          setEditingUserId(null);
        }}
        onSave={savePermissions}
      />
    </div>
  );
};

export default Usuarios;
