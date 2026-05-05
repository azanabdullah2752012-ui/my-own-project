import React from 'react';
import { 
  LayoutDashboard, Target, Settings, BarChart2, Book, FolderKanban, 
  MessageSquare, Bell, HelpCircle, User, Plus, Layers, Grid, Zap 
} from 'lucide-react';

const Navigation = ({ currentView, setView }) => {
  const mainTabs = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'goals', label: 'Objectives', icon: <Target size={18} /> },
    { id: 'system', label: 'Protocol', icon: <Settings size={18} /> },
  ];

  const contentTabs = [
    { id: 'progress', label: 'Analytics', icon: <BarChart2 size={18} /> },
    { id: 'vault', label: 'Knowledge Vault', icon: <Book size={18} /> },
    { id: 'projects', label: 'Missions', icon: <FolderKanban size={18} /> },
  ];

  return (
    <>
      {/* FAR LEFT STRIP */}
      <aside className="sidebar-strip">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl mb-6">E</div>
        
        <div className="flex flex-col gap-4 flex-grow">
          <button className="strip-item active"><Grid size={22} /></button>
          <button className="strip-item"><Layers size={22} /></button>
          <button className="strip-item"><Zap size={22} /></button>
        </div>
        
        <button className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-secondary hover:text-white">
          <Plus size={20} />
        </button>
      </aside>

      {/* MAIN NAV PANEL */}
      <aside className="sidebar-nav">
        <div className="nav-group-label">System Main</div>
        <div className="flex flex-col gap-1">
          {mainTabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`nav-link ${currentView === tab.id ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="nav-group-label">Intelligence</div>
        <div className="flex flex-col gap-1">
          {contentTabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`nav-link ${currentView === tab.id ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <button className="btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={16} />
            Create Mission
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
