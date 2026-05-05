import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

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
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="card w-full max-w-sm text-center space-y-8 py-12 border-white/5 bg-[#050505]">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-[#00FF99]/5 border border-[#00FF99]/20 shadow-[0_0_30px_rgba(0,255,153,0.1)]">
            <Shield size={40} className="text-[#00FF99]" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Empire OS</h1>
          <div className="text-[9px] text-[#444] font-bold tracking-[0.4em] uppercase">Security Protocols Active</div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 space-y-4">
          <input
            type="password"
            placeholder="ACCESS_KEY"
            className={`w-full bg-black border ${error ? 'border-red-500' : 'border-white/5'} p-4 text-center font-bold tracking-[0.5em] text-[#00FF99] focus:border-[#00FF99] transition-all`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button type="submit" className="w-full btn-primary py-4 tracking-widest text-[10px] uppercase">Initialize_Boot</button>
        </form>
        
        {error && (
          <div className="text-red-500 text-[8px] font-black tracking-widest uppercase">
            Access_Denied. Termination_Imminent.
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
