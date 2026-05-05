import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      // Success handled by context
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 w-full max-w-md text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[#1A1A1A] rounded-full border border-[#00FF99]/20">
            <Shield size={48} className="text-[#00FF99]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">EMPIRE OS</h1>
        <p className="text-secondary mb-8">Authorization required to access command terminal</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter Access Key"
              className={`w-full bg-[#1A1A1A] border ${error ? 'border-red-500' : 'border-[#333]'} p-4 rounded-xl focus:border-[#00FF99] transition-all`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <button 
            type="submit"
            className="w-full btn-primary flex items-center justify-center gap-2 py-4 rounded-xl"
          >
            Access System <ArrowRight size={20} />
          </button>
        </form>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mt-4 text-sm"
          >
            Access Denied. Incorrect key.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
