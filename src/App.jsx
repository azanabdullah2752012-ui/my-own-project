import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import System from './pages/System';
import Progress from './pages/Progress';
import Vault from './pages/Vault';
import Projects from './pages/Projects';
import Auth from './pages/Auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, HelpCircle, Settings, User } from 'lucide-react';

const App = () => {
  const { state, updateState, user } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!user) return <Auth />;

  const renderView = () => {
    const props = { data: state[currentView], update: (val) => updateState(currentView, val) };
    switch (currentView) {
      case 'dashboard': return <Dashboard data={state} update={(val) => updateState(null, val)} />;
      case 'goals': return <Goals {...props} />;
      case 'system': return <System {...props} />;
      case 'progress': return <Progress {...props} />;
      case 'vault': return <Vault {...props} />;
      case 'projects': return <Projects {...props} />;
      default: return <Dashboard data={state} />;
    }
  };

  return (
    <div className="app-layout">
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <div className="content-wrapper">
        <header className="top-bar">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search for missions, lessons, etc" />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="strip-item"><Bell size={20} /></button>
            <button className="strip-item"><HelpCircle size={20} /></button>
            <button className="strip-item"><Settings size={20} /></button>
            <div className="flex items-center gap-3 ml-4 bg-panel p-1.5 pr-4 rounded-full border border-white/5 cursor-pointer hover:bg-panel-hover transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border border-white/10" />
              <div className="text-[11px] font-bold">Isa Abdullah</div>
            </div>
          </div>
        </header>

        <main className="main-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
