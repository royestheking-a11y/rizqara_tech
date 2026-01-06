import React from 'react';

export const GlassCard = ({ 
  children, 
  className = "", 
  hover = true,
  onClick
}: { 
  children: React.ReactNode, 
  className?: string, 
  hover?: boolean,
  onClick?: () => void 
}) => (
  <div 
    onClick={onClick}
    className={`
    backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl rounded-2xl 
    ${hover ? 'hover:bg-white/10 hover:scale-[1.01] hover:border-white/20 transition-all duration-300' : ''}
    ${className}
  `}>
    {children}
  </div>
);
