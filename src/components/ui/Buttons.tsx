import React from 'react';

export const ButtonPrimary = ({ 
  children, 
  onClick, 
  className = "", 
  type = "button"
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string,
  type?: "button" | "submit" | "reset"
}) => (
  <button 
    type={type}
    onClick={onClick}
    className={`
      bg-gradient-to-r from-red-900 to-red-700 text-white font-semibold py-3 px-8 rounded-full 
      shadow-lg hover:shadow-red-900/50 hover:brightness-110 transition-all duration-300 
      flex items-center justify-center gap-2
      ${className}
    `}
  >
    {children}
  </button>
);

export const ButtonGlass = ({ 
  children, 
  onClick, 
  className = "",
  type = "button"
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string,
  type?: "button" | "submit" | "reset"
}) => (
  <button 
    type={type}
    onClick={onClick}
    className={`
      backdrop-blur-sm bg-white/5 border border-white/20 text-white font-semibold py-3 px-8 rounded-full 
      hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2
      ${className}
    `}
  >
    {children}
  </button>
);

export const ButtonDanger = ({ 
    children, 
    onClick, 
    className = "" 
  }: { 
    children: React.ReactNode, 
    onClick?: () => void, 
    className?: string 
  }) => (
    <button 
      onClick={onClick}
      className={`
        bg-red-500/20 border border-red-500/50 text-red-200 font-semibold py-2 px-4 rounded-lg 
        hover:bg-red-500/40 transition-all duration-300 flex items-center justify-center gap-2 text-sm
        ${className}
      `}
    >
      {children}
    </button>
  );
