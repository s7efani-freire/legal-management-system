import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

const maskCpf = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const Cadastro: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    email: "",
    tipoUsuario: "",
    senha: "",
    confirmarSenha: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      setFormData((prev) => ({ ...prev, cpf: maskCpf(value) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não conferem.");
      setIsLoading(false);
      return;
    }

    if (onlyDigits(formData.cpf).length !== 11) {
      setError("Informe um CPF válido.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        first_name: formData.nome.trim(),
        last_name: formData.sobrenome.trim(),
        cpf: onlyDigits(formData.cpf),
        email: formData.email.trim(),
        user_type: formData.tipoUsuario,
        password: formData.senha,
      };

      const { data } = await api.post("/api/auth/register", payload);

      setSuccess(data?.message || "Cadastro realizado com sucesso.");
      setFormData({
        nome: "",
        sobrenome: "",
        cpf: "",
        email: "",
        tipoUsuario: "",
        senha: "",
        confirmarSenha: "",
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao cadastrar.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-xl bg-background rounded-xl shadow-lg p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Logo" className="w-32 mb-4" />
          <h1 className="text-2xl font-bold text-text-secondary">
            Criar conta
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Nome*</label>
              <Input type="text" name="nome" value={formData.nome} onChange={handleChange} />
            </div>

            <div>
              <label className="text-sm font-medium">Sobrenome*</label>
              <Input type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange} />
            </div>

            <div>
              <label className="text-sm font-medium">CPF*</label>
              <Input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
            </div>

            <div>
              <label className="text-sm font-medium">Tipo de Usuário*</label>
              <Select name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="ADMIN">Administrador</option>
                <option value="LAWYER">Advogado</option>
                <option value="MANAGER">Gestor</option>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Email*</label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div>
              <label className="text-sm font-medium">Senha*</label>
              <Input type="password" name="senha" value={formData.senha} onChange={handleChange} />
            </div>

            <div>
              <label className="text-sm font-medium">Confirmar senha*</label>
              <Input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} />
            </div>
          </div>

          {error && (
            <div className="text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 bg-green-100 p-3 rounded-md text-center">{success}</div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full py-3">
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>

          <p className="text-center text-sm mt-4">
            Já possui cadastro?{" "}
            <Link to="/login" className="text-primary font-semibold">Faça login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;