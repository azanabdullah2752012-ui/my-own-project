import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Auth from './pages/Auth';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import System from './pages/System';
import Progress from './pages/Progress';
import Vault from './pages/Vault';
import Projects from './pages/Projects';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const { data, isAuthenticated, updateModule } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard data={data.dashboard} update={(val) => updateModule('dashboard', val)} />;
      case 'goals': return <Goals data={data.goals} update={(val) => updateModule('goals', val)} />;
      case 'system': return <System data={data.system} update={(val) => updateModule('system', val)} />;
      case 'progress': return <Progress data={data.progress} update={(val) => updateModule('progress', val)} />;
      case 'vault': return <Vault data={data.vault} update={(val) => updateModule('vault', val)} />;
      case 'projects': return <Projects data={data.projects} update={(val) => updateModule('projects', val)} />;
      default: return <Dashboard data={data.dashboard} update={(val) => updateModule('dashboard', val)} />;
    }
  };

  return (
    <div className="app-container min-h-screen bg-[#0A0A0A] text-white">
      <Navigation currentView={currentView} setView={setCurrentView} />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            className="fade-in"
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
  );
};

export default App;
