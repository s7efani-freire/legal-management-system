import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const logoUrl = "/logo-square-blue.png";

const inputClass =
  "w-full bg-transparent px-1 py-2 border-0 border-b border-gray-400 " +
  "focus:outline-none focus:ring-0 focus:border-primary " +
  "placeholder:text-gray-400 placeholder:italic";

const getSelectClass = (value: string) =>
  `w-full appearance-none bg-transparent px-1 py-2 border-0 border-b border-gray-400
   focus:border-primary focus:ring-0
   ${value ? "text-text-primary" : "italic text-gray-400"}`;

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

      const { data } = await axios.post("/api/auth/register", payload);

      setSuccess(data.message || "Cadastro realizado com sucesso.");
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
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Erro ao cadastrar.");
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-xl bg-background rounded-xl shadow-lg p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <img src={logoUrl} alt="Dias & Nunes" className="w-32 mb-4" />
          <h1 className="text-2xl font-bold text-text-secondary">
            Criar conta
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label className="text-sm font-medium">Nome*</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={inputClass}
                placeholder="Digite seu nome"
              />
            </div>

            {/* Sobrenome */}
            <div>
              <label className="text-sm font-medium">Sobrenome*</label>
              <input
                type="text"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                className={inputClass}
                placeholder="Digite seu sobrenome"
              />
            </div>

            {/* CPF */}
            <div>
              <label className="text-sm font-medium">CPF*</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className={inputClass}
                placeholder="000.000.000-00"
              />
            </div>

            {/* Tipo de usuário */}
            <div>
              <label className="text-sm font-medium">Tipo de Usuário*</label>
              <select
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
                className={getSelectClass(formData.tipoUsuario)}
              >
                <option value="">Selecione</option>
                <option value="ADMIN">Administrador</option>
                <option value="LAWYER">Advogado</option>
                <option value="MANAGER">Gestor</option>
              </select>
            </div>

            {/* Email – DUAS COLUNAS */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="Digite seu email"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="text-sm font-medium">Senha*</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className={inputClass}
                placeholder="Digite a senha"
              />
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="text-sm font-medium">Confirmar senha*</label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className={inputClass}
                placeholder="Confirme a senha"
              />
            </div>
          </div>

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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:bg-gray-400"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <p className="text-center text-sm mt-4">
            Já possui cadastro?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
