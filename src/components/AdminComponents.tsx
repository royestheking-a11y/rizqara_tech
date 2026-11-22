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
    <div className="rq-admin-field">
      {label && (
        <label htmlFor={fieldId} className="rq-admin-field-label">
          {label}
        </label>
      )}
      <Tag 
        {...props} 
        id={fieldId} 
        aria-label={props['aria-label'] || label || props.name} 
        className="rq-admin-field-control"
      />
    </div>
  );
};
export const AdminInput = (props: any) => <AdminField {...props} as="input" />;
export const AdminTextArea = (props: any) => <AdminField {...props} as="textarea" />;
export const AdminSelect = (props: any) => <AdminField {...props} as="select" />;

// --- Buttons ---
export const AdminButton = ({ children, onClick, variant = 'primary', className = "", ...props }: any) => {
  return (
    <button onClick={onClick} className={`rq-admin-button rq-admin-button--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};
