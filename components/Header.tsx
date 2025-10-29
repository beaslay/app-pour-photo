
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c0-1.767.99-3.37 2.55-4.128zM15.75 9.75a.75.75 0 01.75.75v7.19a6.75 6.75 0 01-6.084 6.248.75.75 0 01-.75-.75v-7.19a4.5 4.5 0 012.55-4.128A4.5 4.5 0 0115.75 9.75z" clipRule="evenodd" />
    <path d="M11.25 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V2.25zM15 6.75a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V6.75zM18.75 11.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0v-3.75zM2.25 11.25a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zM6 15.75a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0v-3.75z" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-indigo-400" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-100 tracking-tight">Styliste Photo IA</h1>
        </div>
      </div>
    </header>
  );
};