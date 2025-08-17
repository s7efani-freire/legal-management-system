import React from 'react';

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Metade esquerda - Imagem (apenas em desktop) */}
      <div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/close-up-da-estatua.jpg')" }}
      />
      
      {/* Metade direita - Formulário */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-background-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};