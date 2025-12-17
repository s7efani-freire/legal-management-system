import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

const login = (userData: User) => {
  setUser(userData);
};


  const refreshMe = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      const me = data?.data?.user ?? null;

      if (me) {
        // Se o /me não estiver retornando permissions, caímos num array vazio
        setUser({
          ...me,
          permissions: me.permissions ?? [],
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      await refreshMe();
      setIsLoading(false);
    })();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    refreshMe,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
