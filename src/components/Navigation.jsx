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
    <aside className="sidebar">
      <div className="mb-12 px-4">
        <h1 className="text-xl font-black tracking-tighter text-white">EMPIRE <span className="text-[#00FF99]">OS</span></h1>
        <div className="text-[10px] text-secondary font-bold tracking-[0.2em] mt-1 opacity-50 uppercase">Private Command Center</div>
      </div>
      
      <nav className="flex-grow">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`w-full nav-item ${currentView === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="pt-8 border-t border-white/5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00FF99] to-[#00CC7A]" />
          <div>
            <div className="text-xs font-bold text-white">ADMIN_USER</div>
            <div className="text-[10px] text-secondary">System Online</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
