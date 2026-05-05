import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLogin = ({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Hardcoded admin for demo, in real world this should be a secure backend call
        setTimeout(() => {
            if (username === 'rizqara_admin' && password === 'rizqara@2025') {
                setIsAuthenticated(true);
                localStorage.setItem('rizqara_admin_auth', 'true');
                toast.success('Welcome back, Admin!');
            } else {
                toast.error('Invalid credentials');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#500000]/5 -z-10" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#500000]/5 rounded-full blur-[120px] -z-10" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white border border-gray-100 rounded-[40px] shadow-2xl p-8 md:p-12 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-[#500000] text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-900/20 rotate-3">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-500 font-medium">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#500000] uppercase tracking-widest ml-4">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-12 py-4 focus:outline-none focus:border-[#500000] transition-all font-medium"
                                placeholder="Admin Username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#500000] uppercase tracking-widest ml-4">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-12 py-4 focus:outline-none focus:border-[#500000] transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#500000] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#3a0000] transition-all shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {isLoading ? 'Verifying...' : 'Access Portal'}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">
                        Protected by RizQara Tech Security
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
