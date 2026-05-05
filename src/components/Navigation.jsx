import React from 'react';
import { LayoutDashboard, Target, Settings, BarChart2, Book, FolderKanban, Terminal } from 'lucide-react';

const Navigation = ({ currentView, setView }) => {
  const tabs = [
    { id: 'dashboard', label: 'EXECUTION', icon: <LayoutDashboard size={14} /> },
    { id: 'goals', label: 'OBJECTIVES', icon: <Target size={14} /> },
    { id: 'system', label: 'PROTOCOL', icon: <Settings size={14} /> },
    { id: 'progress', label: 'ANALYTICS', icon: <BarChart2 size={14} /> },
    { id: 'vault', label: 'ARCHIVE', icon: <Book size={14} /> },
    { id: 'projects', label: 'MISSIONS', icon: <FolderKanban size={14} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#1A1A1A] bg-[#050505]/95 backdrop-blur-sm">
      <div className="container py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#00FF99]/10 border border-[#00FF99]/20">
            <Terminal size={18} className="text-[#00FF99]" />
          </div>
          <div>
            <div className="text-[#00FF99] font-black text-xs tracking-[0.3em]">EMPIRE_OS_V1.0</div>
            <div className="text-[8px] text-[#444] font-bold tracking-widest uppercase">System Core / Active</div>
          </div>
        </div>
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`nav-tab flex items-center gap-2 ${currentView === tab.id ? 'active' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
