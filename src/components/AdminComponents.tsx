import React from 'react';
import { motion } from 'framer-motion';

// --- Card Component (Light Mode Premium) ---
export const AdminCard = ({ children, className = "", onClick }: any) => {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- Stat Card ---
export const StatCard = ({ icon: Icon, value, label, colorClass }: any) => (
  <AdminCard className="flex items-center gap-6 cursor-default">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${colorClass}`}>
      <Icon size={32} />
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  </AdminCard>
);

// --- Inputs ---
export const AdminInput = (props: any) => (
  <div className="mb-4">
    {props.label && <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{props.label}</label>}
    <input 
      {...props} 
      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 focus:outline-none focus:border-[#500000] focus:ring-1 focus:ring-[#500000] transition-all" 
    />
  </div>
);

export const AdminTextArea = (props: any) => (
  <div className="mb-4">
    {props.label && <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{props.label}</label>}
    <textarea 
      {...props} 
      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 focus:outline-none focus:border-[#500000] focus:ring-1 focus:ring-[#500000] transition-all min-h-[120px]" 
    />
  </div>
);

export const AdminSelect = (props: any) => (
  <div className="mb-4">
    {props.label && <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{props.label}</label>}
    <select 
      {...props} 
      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 focus:outline-none focus:border-[#500000] focus:ring-1 focus:ring-[#500000] transition-all" 
    >
      {props.children}
    </select>
  </div>
);

// --- Buttons ---
export const AdminButton = ({ children, onClick, variant = 'primary', className = "", ...props }: any) => {
  const base = "px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#500000] text-white hover:bg-[#700000] shadow-lg shadow-red-900/20",
    secondary: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
  };
  
  return (
    <button onClick={onClick} className={`${base} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};
