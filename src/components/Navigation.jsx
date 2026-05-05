import React from 'react';
import { LayoutDashboard, Target, Settings, BarChart2, BookOpen, FolderKanban, Layers, Grid, Zap, Plus } from 'lucide-react';

const Navigation = ({ currentView, setView }) => {
  const mainItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'goals',     label: 'Objectives', icon: <Target size={16} /> },
    { id: 'system',   label: 'Protocol',   icon: <Settings size={16} /> },
  ];
  const intelItems = [
    { id: 'progress', label: 'Analytics',       icon: <BarChart2 size={16} /> },
    { id: 'vault',    label: 'Knowledge Vault', icon: <BookOpen size={16} /> },
    { id: 'projects', label: 'Missions',        icon: <FolderKanban size={16} /> },
  ];

  return (
    <>
      {/* FAR LEFT ICON STRIP */}
      <aside className="sidebar-strip">
        <div className="strip-logo">E</div>
        <button className={`strip-app ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
          <Grid size={20} />
        </button>
        <button className="strip-app"><Layers size={20} /></button>
        <button className="strip-app"><Zap size={20} /></button>
        <button className="strip-add" style={{ marginTop: 'auto' }}>
          <Plus size={18} />
        </button>
      </aside>

      {/* MAIN NAV PANEL */}
      <aside className="sidebar-nav">
        <span className="nav-section-label">System Main</span>
        {mainItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <span className="nav-section-label" style={{ marginTop: 20 }}>Intelligence</span>
        {intelItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <button className="nav-create-btn" style={{ marginTop: 24 }}>
          <Plus size={14} />
          Create Mission
        </button>
      </aside>
    </>
  );
};

export default Navigation;
