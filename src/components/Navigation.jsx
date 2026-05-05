import React from 'react';
import { LayoutDashboard, Target, Settings, BarChart2, Book, FolderKanban } from 'lucide-react';

const Navigation = ({ currentView, setView }) => {
  const tabs = [
    { id: 'dashboard', label: 'EXECUTION', icon: <LayoutDashboard size={18} /> },
    { id: 'goals', label: 'OBJECTIVES', icon: <Target size={18} /> },
    { id: 'system', label: 'PROTOCOL', icon: <Settings size={18} /> },
    { id: 'progress', label: 'ANALYTICS', icon: <BarChart2 size={18} /> },
    { id: 'vault', label: 'ARCHIVE', icon: <Book size={18} /> },
    { id: 'projects', label: 'MISSIONS', icon: <FolderKanban size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="mb-12 flex justify-center w-full">
        <div className="w-6 h-6 border-2 border-[#00FF99] rotate-45" />
      </div>
      
      <nav className="flex-grow w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`nav-item ${currentView === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="w-full flex justify-center opacity-20">
        <div className="w-1 h-8 bg-white/20 rounded-full" />
      </div>
    </aside>
  );
};

export default Navigation;
