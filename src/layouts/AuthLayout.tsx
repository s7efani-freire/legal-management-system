import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-background-white">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};