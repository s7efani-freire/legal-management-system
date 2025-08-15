import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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
    <div className="bg-background-white rounded-lg shadow-lg p-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Scale className="w-8 h-8 text-primary" />
        </div>
        <div className="text-primary">
          <h1 className="text-lg font-bold">DIAS & NUNES</h1>
          <p className="text-xs text-primary/70">ADVOCACIA & CONSULTORIA JURÍDICA</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-text-primary text-center mb-6">Conecte-se</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@diasenunes.com.br"
            className="w-full px-3 py-2 border-b border-gray-300 focus:border-primary focus:outline-none bg-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-3 py-2 border-b border-gray-300 focus:border-primary focus:outline-none bg-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors mt-6"
        >
          Acessar
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-text-primary">
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;