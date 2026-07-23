import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import PageContainer from "../components/ui/PageContainer";
import { Camera, LogOut } from "lucide-react";
import api from "../services/api"
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

type MeUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  profile_photo_path: string | null;
};

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");

  const [me, setMe] = useState<MeUser | null>(null);

  const [profileImage, setProfileImage] = useState<string>("/user.png");

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [loadingMe, setLoadingMe] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fullName = me ? `${me.first_name} ${me.last_name}`.trim() : "";

  const buildPhotoUrl = (photoPath: string | null) => {
    if (!photoPath) return "/user.png";
    const base = import.meta.env.VITE_API_URL || "http://localhost:8000";
    return `${base}${photoPath}`;
  };

  useEffect(() => {
    const loadMe = async () => {
      setLoadingMe(true);
      setError(null);
      try {
        const { data } = await api.get("/api/profile/me");
        const user: MeUser = data?.data?.user;

        setMe(user);
        setUserData({
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          email: user.email ?? "",
        });
        setProfileImage(buildPhotoUrl(user.profile_photo_path));
      } catch (err: any) {
        setError(err?.response?.data?.message || "Não foi possível carregar seu perfil.");
      } finally {
        setLoadingMe(false);
      }
    };

    loadMe();
  }, []);

const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  console.log("📤 Iniciando upload com compressão");

  if (!file.type.startsWith('image/')) {
    setError("Selecione uma imagem");
    return;
  }

  const previewUrl = URL.createObjectURL(file);
  setProfileImage(previewUrl);
  
  const previousImage = profileImage;
  setError(null);
  setSuccess(null);

  try {
    setUploadingPhoto(true);

    let fileToUpload = file;
    if (file.size > 2 * 1024 * 1024) {
      console.log("⚡ Comprimindo imagem de", (file.size / 1024 / 1024).toFixed(2), "MB");
      fileToUpload = await compressImage(file);
      console.log("✅ Comprimido para", (fileToUpload.size / 1024 / 1024).toFixed(2), "MB");
    }

    const formData = new FormData();
    formData.append('photo', fileToUpload);

    const response = await api.post('/api/profile/photo', formData);
    
    console.log("✅ Upload bem-sucedido:", response.data);
    
    if (response.data?.ok && response.data?.data?.user) {
      const user = response.data.data.user;
      if (user.profile_photo_path) {

        let photoUrl = user.profile_photo_path;
        if (!photoUrl.startsWith('http')) {
          if (!photoUrl.startsWith('/')) photoUrl = '/' + photoUrl;
          photoUrl = 'http://localhost:8000' + photoUrl;
        }
        setProfileImage(photoUrl);
        
        if (me) {
          setMe({
            ...me,
            profile_photo_path: user.profile_photo_path
          });
        }
      }
    }
    
    setSuccess(response.data?.message || "Foto atualizada!");
    URL.revokeObjectURL(previewUrl);

  } catch (err: any) {
    console.error("❌ Erro:", err);
    
    if (err.response?.status === 422 && 
        err.response?.data?.message?.includes('grande')) {
      setError("Arquivo muito grande mesmo após compressão. Tente uma imagem menor.");
    } else {
      setError(err.response?.data?.message || "Erro no upload");
    }
    
    setProfileImage(previousImage);
    URL.revokeObjectURL(previewUrl);
    
  } finally {
    setUploadingPhoto(false);
    if (e.target) e.target.value = "";
  }
};
const compressImage = (file: File, maxWidth = 1200, quality = 0.7): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }
        

        ctx.drawImage(img, 0, 0, width, height);
        

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Falha na compressão"));
              return;
            }
            
    
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            console.log(`📊 Compressão: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = reject;
    };
    
    reader.onerror = reject;
  });
};

  const handleInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userData.first_name.trim() || !userData.last_name.trim()) {
      setError("Informe nome e sobrenome.");
      return;
    }
    if (!userData.email.trim()) {
      setError("Informe um email.");
      return;
    }

    try {
      setSavingInfo(true);
      const { data } = await api.put("/api/profile", {
        first_name: userData.first_name.trim(),
        last_name: userData.last_name.trim(),
        email: userData.email.trim(),
      });

      const user: MeUser = data?.data?.user;
      setMe(user);
      setSuccess(data?.message || "Dados atualizados com sucesso.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Falha ao atualizar seus dados.");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwords.new.length < 8) {
      setError("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError("A confirmação da nova senha não confere.");
      return;
    }

    try {
      setSavingPass(true);
      const { data } = await api.put("/api/profile/password", {
        current_password: passwords.current,
        new_password: passwords.new,
      });

      setSuccess(data?.message || "Senha alterada com sucesso.");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Falha ao alterar a senha.");
    } finally {
      setSavingPass(false);
    }
  };

  const handleLogout = async () => {
    setError(null);
    setSuccess(null);
    try {
      await api.post("/api/auth/logout");
      window.location.href = "/login";
    } catch {
      setError("Não foi possível sair agora. Tente novamente.");
    }
  };

  return (
    <PageContainer title="Meu Perfil">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-accent text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <img
                src={profileImage}
                alt="Foto do Perfil"
                className="w-full h-full rounded-full object-cover border-4 border-accent"
              />

              <label
                htmlFor="profile-upload"
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Alterar foto"
              >
                <Camera className="w-8 h-8 text-white" />
              </label>

              <input
                type="file"
                id="profile-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadingPhoto}
              />
            </div>

            <h2 className="text-xl font-bold text-text-secondary">
              {loadingMe ? "Carregando..." : fullName || "Usuário"}
            </h2>

            <p className="text-sm text-gray-500">
              {me?.user_type || ""}
            </p>

            {/* BOTÃO LOGOUT (texto vermelho) abaixo do card da foto */}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 text-red-600 font-medium hover:underline"
            >
              <LogOut className="w-4 h-4" />
              Sair (Logout)
            </button>
          </div>

          {/* Mensagens */}
          {(error || success) && (
            <div className="mt-4">
              {error && (
                <div className="text-red-600 bg-red-100 p-3 rounded-md text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-600 bg-green-100 p-3 rounded-md text-center">
                  {success}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Coluna da Direita */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-accent">
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`py-2 px-1 font-medium ${
                    activeTab === "info"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-primary"
                  }`}
                  type="button"
                >
                  Informações Pessoais
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`py-2 px-1 font-medium ${
                    activeTab === "password"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-primary"
                  }`}
                  type="button"
                >
                  Alterar Senha
                </button>
              </nav>
            </div>

            {activeTab === "info" && (
              <form className="space-y-6" onSubmit={handleSaveInfo}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      name="first_name"
                      value={userData.first_name}
                      onChange={handleInfoChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Sobrenome
                    </label>
                    <Input
                      type="text"
                      name="last_name"
                      value={userData.last_name}
                      onChange={handleInfoChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Endereço de Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInfoChange}
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={savingInfo}>
                    {savingInfo ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            )}

            {activeTab === "password" && (
              <form className="space-y-6" onSubmit={handleChangePassword}>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Senha Atual
                  </label>
                  <Input
                    type="password"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    placeholder="Digite sua senha atual"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Nova Senha
                  </label>
                  <Input
                    type="password"
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Confirmar Nova Senha
                  </label>
                  <Input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    placeholder="Repita a nova senha"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={savingPass}>
                    {savingPass ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
