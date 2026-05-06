import React from 'react';
import {
  LayoutDashboard, Target, Settings, BarChart2,
  BookOpen, FolderKanban, Repeat2, BookMarked,
  Layers, Grid, Zap, Plus
} from 'lucide-react';

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
    { id: 'habits',   label: 'Habits',          icon: <Repeat2      size={16} /> },
    { id: 'journal',  label: 'Journal',         icon: <BookMarked   size={16} /> },
  ];

  const stripItems = [
    { id: 'dashboard', icon: <Grid    size={20} />, title: 'Dashboard' },
    { id: 'projects',  icon: <Layers  size={20} />, title: 'Missions'  },
    { id: 'habits',    icon: <Repeat2 size={20} />, title: 'Habits'    },
    { id: 'journal',   icon: <BookMarked size={20} />, title: 'Journal' },
  ];

  return (
    <>
      <aside className="sidebar-strip">
        <div style={{ height:60, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#34C759', boxShadow:'0 0 10px rgba(52, 199, 89, 0.4)' }} />
        </div>
        {stripItems.map(item => (
          <button key={item.id} className={`strip-app ${currentView === item.id ? 'active' : ''}`}
            title={item.title} onClick={() => setView(item.id)}>
            {item.icon}
          </button>
        ))}
        <button className="strip-add" title="Quick Add (⌘K)" onClick={onQuickAdd}>
          <Plus size={18} />
        </button>
      </aside>

      <aside className="sidebar-nav">
        <span className="nav-section-label">System Main</span>
        {mainItems.map(item => (
          <button key={item.id} onClick={() => setView(item.id)}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}>
            {item.icon} {item.label}
          </button>
        ))}

        <span className="nav-section-label" style={{ marginTop:20 }}>Intelligence</span>
        {intelItems.map(item => (
          <button key={item.id} onClick={() => setView(item.id)}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}>
            {item.icon} {item.label}
          </button>
        ))}

        <button className="nav-create-btn" style={{ marginTop:24 }} onClick={onQuickAdd}>
          <Plus size={14} /> Quick Add ⌘K
        </button>
      </aside>
    </>
  );
};

export default Navigation;
