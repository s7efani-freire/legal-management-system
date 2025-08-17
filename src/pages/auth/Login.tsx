import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex justify-center mb-6 md:mb-8">
        <img 
          src="/logo-square-blue.png" 
          alt="Dias & Nunes" 
          className="w-32 md:md:w-44"
        />
      </div>

      {/* Título usando cor primary.dark */}
      <h1 className="text-2xl md:text-3xl font-bold text-primary-dark mb-6 md:mb-8 text-center">
        Conecte-se
      </h1>

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
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="pt-4 md:pt-6">
          <button
            type="submit"
            className="w-full bg-primary-dark text-white py-2 md:py-3 rounded-md font-medium hover:bg-primary transition-colors text-sm md:text-base"
          >
            Acessar
          </button>
        </div>
      </form>

      <div className="text-center mt-4 md:mt-6">
        <p className="text-xs md:text-sm text-primary-dark">
          Ainda não tem uma conta?{' '}
          <Link 
            to="/cadastro" 
            className="text-primary-dark hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;