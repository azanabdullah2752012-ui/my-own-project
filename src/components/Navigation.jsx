import React from 'react';
import { LayoutDashboard, Target, Settings, BarChart2, BookOpen, FolderKanban, Layers, Grid, Zap, Plus } from 'lucide-react';

const Navigation = ({ currentView, setView, onQuickAdd }) => {
  const mainItems = [
    { id: 'dashboard', label: 'Overview',    icon: <LayoutDashboard size={16} /> },
    { id: 'goals',     label: 'Objectives',  icon: <Target          size={16} /> },
    { id: 'system',    label: 'Protocol',    icon: <Settings        size={16} /> },
  ];
  const intelItems = [
    { id: 'progress', label: 'Analytics',       icon: <BarChart2    size={16} /> },
    { id: 'vault',    label: 'Knowledge Vault', icon: <BookOpen     size={16} /> },
    { id: 'projects', label: 'Missions',        icon: <FolderKanban size={16} /> },
  ];

  // Strip icons — each navigates to a section
  const stripItems = [
    { id: 'dashboard', icon: <Grid    size={20} />, title: 'Dashboard' },
    { id: 'projects',  icon: <Layers  size={20} />, title: 'Missions'  },
    { id: 'vault',     icon: <Zap     size={20} />, title: 'Vault'     },
  ];

  return (
    <>
      {/* FAR LEFT ICON STRIP */}
      <aside className="sidebar-strip">
        <div className="strip-logo" title="Empire OS">E</div>

        {stripItems.map(item => (
          <button
            key={item.id}
            className={`strip-app ${currentView === item.id ? 'active' : ''}`}
            title={item.title}
            onClick={() => setView(item.id)}
          >
            {item.icon}
          </button>
        ))}

        {/* QUICK ADD */}
        <button
          className="strip-add"
          title="Quick Add (⌘K)"
          onClick={onQuickAdd}
        >
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

        <button className="nav-create-btn" style={{ marginTop: 24 }} onClick={onQuickAdd}>
          <Plus size={14} />
          Quick Add  ⌘K
        </button>
      </aside>
    </>
  );
};

export default Navigation;
