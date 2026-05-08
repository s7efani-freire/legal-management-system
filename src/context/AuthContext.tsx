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

// Usuário fake para desenvolvimento
const MOCK_USER: User = {
  id: 1,
  first_name: 'Dev',
  last_name: 'Local',
  email: 'dev@local.com',
  user_type: 'admin',
  permissions: [],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login = (userData: User) => setUser(userData);

  const refreshMe = async () => {
    // TODO: trocar por chamada real à API quando o backend estiver pronto
    setUser(MOCK_USER);
  };

  const logout = async () => {
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      await refreshMe();
      setIsLoading(false);
    })();
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