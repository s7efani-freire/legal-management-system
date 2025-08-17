import React from 'react';
import { Link } from 'react-router-dom';

const Cadastro = () => {
  return (
    <div className="w-full max-w-md space-y-6">
      <h1 className="text-2xl font-bold text-primary-dark mb-6">Criar conta</h1>
      
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-primary-dark mb-1">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu primeiro nome"
              className="w-full px-4 py-2 border-b border-primary-dark focus:outline-none focus:border-primary-dark/70 placeholder:italic"
            />
          </div>
          
          <div>
            <label htmlFor="sobrenome" className="block text-sm font-medium text-primary-dark mb-1">
              Sobrenome
            </label>
            <input
              type="text"
              id="sobrenome"
              placeholder="Digite seu sobrenome"
              className="w-full px-4 py-2 border-b border-primary-dark focus:outline-none focus:border-primary-dark/70 placeholder:italic"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary-dark mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu melhor email"
            className="w-full px-4 py-2 border-b border-primary-dark focus:outline-none focus:border-primary-dark/70 placeholder:italic"
          />
        </div>

        <div>
          <label htmlFor="tipoUsuario" className="block text-sm font-medium text-primary-dark mb-1">
            Tipo de Usuário
          </label>
          <select
            id="tipoUsuario"
            className="w-full px-4 py-2 border-b border-primary-dark focus:outline-none focus:border-primary-dark/70 bg-transparent"
          >
            <option value="">Selecione</option>
            <option value="socio">Sócio</option>
            <option value="colaborador">Colaborador</option>
          </select>
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-primary-dark mb-1">
            Senha
          </label>
          <input
            type="password"
            id="senha"
            placeholder="Digite uma senha (mínimo 8 dígitos)"
            className="w-full px-4 py-2 border-b border-primary-dark focus:outline-none focus:border-primary-dark/70 placeholder:italic"
          />
        </div>

        <div>
          <label htmlFor="confirmarSenha" className="block text-sm font-medium text-primary-dark mb-1">
            Confirmar senha
          </label>
          <input
            type="password"
            id="confirmarSenha"
            placeholder="Confirme sua senha"
            className="w-full px-4 py-2 border-b border-primary-dark focus:outline-none focus:border-primary-dark/70 placeholder:italic"
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-primary-dark text-white py-3 rounded-md font-medium hover:bg-primary-dark/90 transition-colors"
          >
            Cadastrar
          </button>
        </div>
      </form>

      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-primary-dark">
          Já possui cadastro?{' '}
          <Link to="/login" className="text-primary-dark font-medium hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;