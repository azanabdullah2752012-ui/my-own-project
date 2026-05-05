import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const Auth = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login(password)) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <div className="text-center space-y-8 w-full max-w-sm px-10">
        <div className="text-[10px] font-black tracking-[0.6em] text-[#00FF99] mb-12 uppercase animate-pulse">
          Auth_Required
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="password"
            placeholder="ACCESS_KEY"
            className={`w-full bg-transparent border-none text-center text-xl font-black tracking-[0.5em] text-white focus:ring-0 placeholder:text-[#111] ${error ? 'text-red-500' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <div className="absolute bottom-0 left-0 w-full h-px bg-white/5 overflow-hidden">
            <div className={`h-full bg-[#00FF99] transition-all duration-1000 ${password ? 'w-full' : 'w-0'}`} />
          </div>
        </form>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-900 text-[8px] font-black tracking-widest uppercase"
          >
            Terminal_Refused
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Auth;
