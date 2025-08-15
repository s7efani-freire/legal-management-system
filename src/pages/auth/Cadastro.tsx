import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

const Cadastro: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userType: 'Sócio',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration attempt:', formData);
  };

  return (
    <div className="bg-background-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Scale className="w-8 h-8 text-primary" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-text-primary mb-6">Criar conta</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-1">
              Nome
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Digite seu primeiro nome"
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-primary focus:outline-none bg-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-1">
              Sobrenome
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Digite seu sobrenome"
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-primary focus:outline-none bg-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Digite seu melhor email"
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-primary focus:outline-none bg-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-text-primary mb-1">
              Tipo de Usuário
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-primary focus:outline-none bg-transparent"
            >
              <option value="Sócio">Sócio</option>
              <option value="Advogado">Advogado</option>
              <option value="Assistente">Assistente</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Digite uma senha (mínimo 8 dígitos)"
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-primary focus:outline-none bg-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1">
              Confirmar senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme sua senha"
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-primary focus:outline-none bg-transparent"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors mt-6"
        >
          Cadastrar
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-text-primary">
          Já possui Cadastro?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;