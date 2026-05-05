import React from 'react';
import { LayoutDashboard, Target, Settings, BarChart2, Book, FolderKanban } from 'lucide-react';

const Navigation = ({ currentView, setView }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'goals', label: 'Goals', icon: <Target size={20} /> },
    { id: 'system', label: 'System', icon: <Settings size={20} /> },
    { id: 'progress', label: 'Progress', icon: <BarChart2 size={20} /> },
    { id: 'vault', label: 'Vault', icon: <Book size={20} /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={20} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#333] bg-[#0A0A0A]/80 backdrop-blur-md">
      <div className="container py-4 flex items-center justify-between">
        <div className="text-[#00FF99] font-bold text-xl tracking-tighter">EMPIRE OS</div>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentView === tab.id 
                ? 'bg-[#00FF99]/10 text-[#00FF99]' 
                : 'text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
