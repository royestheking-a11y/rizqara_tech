import { useId } from 'react';
import { motion } from 'framer-motion';

// --- Card Component (Light Mode Premium) ---
export const AdminCard = ({ children, className = "", onClick }: any) => {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(80,0,0,0.04)] border border-[#ebdce3] transition-all duration-300 hover:shadow-[0_12px_28px_-6px_rgba(80,0,0,0.08)] ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- Stat Card ---
export const StatCard = ({ icon: Icon, value, label, colorClass }: any) => (
  <AdminCard className="flex items-center gap-5 cursor-default relative overflow-hidden group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-105 ${colorClass}`}>
      <Icon size={26} />
    </div>
    <div>
      <div className="text-2xl font-black text-[#230711] tracking-tight">{value}</div>
      <div className="text-[11px] font-bold text-[#8c6d7a] uppercase tracking-[0.14em] mt-0.5">{label}</div>
    </div>
  </AdminCard>
);

// --- Inputs ---
const AdminField = ({ as: Tag, label, id, ...props }: any) => {
  const generated = useId();
  const fieldId = id || generated;
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={fieldId} className="block text-[11px] font-bold text-[#785967] uppercase tracking-[0.12em] mb-1.5">
          {label}
        </label>
      )}
      <Tag 
        {...props} 
        id={fieldId} 
        aria-label={props['aria-label'] || label || props.name} 
        className={`w-full bg-[#fdfbfc] border border-[#e5d4dc] rounded-xl px-4 py-3 text-sm font-medium text-[#230711] placeholder:text-[#9e838f] focus:outline-none focus:bg-white focus:border-[#500000] focus:ring-2 focus:ring-[#500000]/15 transition-all duration-200 ${Tag === 'textarea' ? 'min-h-[120px] resize-y' : ''} ${Tag === 'select' ? 'cursor-pointer' : ''}`} 
      />
    </div>
  );
};
export const AdminInput = (props: any) => <AdminField {...props} as="input" />;
export const AdminTextArea = (props: any) => <AdminField {...props} as="textarea" />;
export const AdminSelect = (props: any) => <AdminField {...props} as="select" />;

// --- Buttons ---
export const AdminButton = ({ children, onClick, variant = 'primary', className = "", ...props }: any) => {
  const base = "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-[#500000] via-[#680b26] to-[#781b37] text-white hover:brightness-110 shadow-sm shadow-[#500000]/25 border border-[#500000]/60 active:scale-[0.98]",
    secondary: "bg-white text-[#422230] border border-[#e5d4dc] hover:bg-[#faf4f7] hover:border-[#500000]/30 shadow-xs active:scale-[0.98]",
    danger: "bg-[#fff1f4] text-[#b91c1c] hover:bg-[#ffe4e8] border border-[#fecdd3] active:scale-[0.98]"
  };
  
  return (
    <button onClick={onClick} className={`${base} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};
