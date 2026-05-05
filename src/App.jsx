import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import System from './pages/System';
import Progress from './pages/Progress';
import Vault from './pages/Vault';
import Projects from './pages/Projects';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, HelpCircle, Settings } from 'lucide-react';

const App = () => {
  const { data, updateModule } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    const props = { data: data[currentView], update: (val) => updateModule(currentView, val) };
    switch (currentView) {
      case 'dashboard': return <Dashboard data={data} update={(val) => updateModule(null, val)} />;
      case 'goals':     return <Goals     {...props} />;
      case 'system':    return <System    {...props} />;
      case 'progress':  return <Progress  {...props} />;
      case 'vault':     return <Vault     {...props} />;
      case 'projects':  return <Projects  {...props} />;
      default:          return <Dashboard data={data} update={(val) => updateModule(null, val)} />;
    }
  };

  return (
    <div className="app-shell">
      <Navigation currentView={currentView} setView={setCurrentView} />

      <div className="content-area">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar-search">
            <Search size={15} />
            <input type="text" placeholder="Search for missions, lessons, etc" />
          </div>
          <div className="topbar-actions">
            <button className="topbar-icon-btn"><Bell size={17} /></button>
            <button className="topbar-icon-btn"><HelpCircle size={17} /></button>
            <button className="topbar-icon-btn"><Settings size={17} /></button>
            <div className="topbar-avatar">
              <div className="topbar-avatar-img">A</div>
              <span className="topbar-avatar-name">Azan</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="page-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              className="fade-in"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default App;
