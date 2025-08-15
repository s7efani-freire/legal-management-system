import React from 'react';

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-text-secondary mb-6">{title}</h2>
      {children}
    </div>
  );
};

export default PageContainer;