import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Terminal, ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      // Success
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] p-6">
      <div className="hud-panel w-full max-w-md">
        <div className="hud-header">
          <div className="hud-title flex items-center gap-2">
            <Lock size={12} /> System_Authorization_v1.0
          </div>
          <div className="text-[8px] text-[#444] font-bold">STATUS: ENCRYPTED</div>
        </div>
        <div className="hud-content space-y-8 py-10 text-center">
          <div className="flex justify-center">
            <div className="p-4 border-2 border-[#00FF99]/20 relative">
              <ShieldAlert size={48} className="text-[#00FF99]" />
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#00FF99]" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#00FF99]" />
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-black tracking-[0.4em] text-white mb-2">EMPIRE_OS</h1>
            <div className="text-[10px] text-[#444] font-bold tracking-widest uppercase">Unauthorized access is strictly prohibited</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto text-left">
            <div className="relative">
              <label className="text-[8px] text-[#444] font-bold uppercase block mb-1">Enter Access Key</label>
              <input
                type="password"
                placeholder="********"
                className={`w-full bg-black border ${error ? 'border-red-500' : 'border-[#1A1A1A]'} p-3 font-mono text-[#00FF99] focus:border-[#00FF99] transition-all`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="w-full btn-terminal flex items-center justify-center gap-3 py-3"
            >
              INITIALIZE_BOOT <ArrowRight size={14} />
            </button>
          </form>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-[10px] font-bold tracking-widest uppercase"
            >
              [ERROR] Access_Key_Invalid. Traceback initiated.
            </motion.div>
          )}

          <div className="pt-4 border-t border-[#1A1A1A]">
            <div className="text-[8px] text-[#333] font-bold uppercase tracking-[0.2em]">Secure_Shell / AES-256_Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
