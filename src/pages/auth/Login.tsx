import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth, MOCK_USER } from "../../context/AuthContext";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Login de demonstração — sem backend nesta versão, qualquer credencial é aceita.
    login(MOCK_USER);
    navigate(from, { replace: true });
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-6 md:mb-8">
        <img src="/logo.png" alt="Logo" className="w-32 md:w-44" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-primary-dark mb-6 md:mb-8 text-center">
        Conecte-se
      </h1>

      <div className="mb-6 rounded-md border border-secondary/40 bg-secondary/10 px-4 py-3 text-xs md:text-sm text-primary-dark">
        <p className="font-semibold">Ambiente de demonstração</p>
        <p>
          Use o e-mail <span className="font-semibold">{MOCK_USER.email}</span> e qualquer senha para entrar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm md:text-base font-medium text-primary-dark mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu email"
            className="w-full px-4 py-2 md:py-3 border-b border-primary-dark focus:outline-none focus:border-primary-dark text-primary-dark text-sm md:text-base placeholder-primary-dark/70 placeholder:italic bg-transparent"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm md:text-base font-medium text-primary-dark mb-2">
            Senha
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Digite sua senha"
            className="w-full px-4 py-2 md:py-3 border-b border-primary-dark focus:outline-none focus:border-primary-dark text-primary-dark text-sm md:text-base placeholder-primary-dark/70 placeholder:italic bg-transparent pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-3 bottom-2 text-primary-dark"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <div className="text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</div>
        )}

        <div className="pt-4 md:pt-6">
          <button
            type="submit"
            className="w-full bg-primary-dark text-white py-2 md:py-3 rounded-md font-medium hover:bg-primary transition-colors text-sm md:text-base disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Conectando..." : "Acessar"}
          </button>
        </div>
      </form>

      <div className="text-center mt-4 md:mt-6">
        <p className="text-xs md:text-sm text-primary-dark">
          Ainda não tem uma conta?{" "}
          <Link to="/cadastro" className="text-primary-dark hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;