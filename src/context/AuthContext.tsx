import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  cpf?: string;
  email: string;
  user_type: string;
  permissions: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  refreshMe: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuário fake para o login de demonstração — não há backend nesta versão do projeto.
export const MOCK_USER: User = {
  id: 5,
  first_name: 'Ana',
  last_name: 'Souza',
  email: 'ana.souza@lexeco.adv.br',
  user_type: 'ADMIN',
  permissions: [],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login = (userData: User) => setUser(userData);

  const refreshMe = async () => {
    setUser(MOCK_USER);
  };

  const logout = async () => {
    setUser(null);
  };

  useEffect(() => {
    // Sem backend nesta versão: começa deslogado, a tela de login decide quando autenticar.
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, refreshMe, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};