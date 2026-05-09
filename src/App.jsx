import React, { useState, useRef, useEffect } from 'react';
import { useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import System from './pages/System';
import Routines from './pages/Routines';
import Vault from './pages/Vault';
import Projects from './pages/Projects';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, HelpCircle, Settings, X, Plus,
  CheckCircle2, Circle, Target, BookOpen, FolderKanban,
  Download, Trash2, User, ChevronRight, Keyboard, BarChart2,
  Zap, Layers, Grid
} from 'lucide-react';

/* ── click-outside hook ── */
const useClickOutside = (ref, cb) => {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, cb]);
};

/* ── NOTIFICATIONS PANEL ── */
const NotificationsPanel = ({ data, onClose }) => {
  const tasks   = data?.dashboard?.secondaryTasks ?? [];
  const pending = tasks.filter(t => !t.done);
  const mission = data?.dashboard?.mainMission;
  const streak  = data?.dashboard?.streak ?? 0;

  return (
    <div style={{ position:'absolute', top:52, right:0, width:340, background:'var(--bg-sidebar)', border:'1px solid var(--border)', borderRadius:16, boxShadow:'0 20px 60px rgba(0,0,0,0.5)', zIndex:500, overflow:'hidden' }}>
      <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontWeight:700, fontSize:14 }}>Notifications</span>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={16} /></button>
      </div>
      <div style={{ maxHeight:380, overflowY:'auto' }}>
        {!mission && (
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#FF9500', marginTop:5, flexShrink:0 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>No main mission set</div>
              <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>Head to Dashboard and define today's #1 goal.</div>
            </div>
          </div>
        )}
        {pending.length > 0 && (
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#4D7CFE', marginTop:5, flexShrink:0 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{pending.length} task{pending.length > 1 ? 's' : ''} remaining</div>
              <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>{pending.map(t => t.title).join(', ')}</div>
            </div>
          </div>
        )}
        {streak > 0 && (
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#34C759', marginTop:5, flexShrink:0 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>🔥 {streak}-day streak active</div>
              <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>Don't break it — confirm your day before midnight.</div>
            </div>
          </div>
        )}
        {!mission && pending.length === 0 && streak === 0 && (
          <div style={{ padding:'30px 18px', textAlign:'center', color:'var(--text-dim)', fontSize:13 }}>All clear — nothing to flag.</div>
        )}
      </div>
    </div>
  );
};

/* ── HELP MODAL ── */
const HelpModal = ({ onClose }) => {
  const shortcuts = [
    { key: 'Tab', desc: 'Cycle through navigation' },
    { key: 'Enter', desc: 'Confirm inputs / add items' },
    { key: 'Esc', desc: 'Close modals' },
  ];
  const features = [
    { icon: <Grid size={14} />, label: 'Dashboard', desc: 'Set mission, tasks, run focus timer' },
    { icon: <Target size={14} />, label: 'Objectives', desc: 'Track goals across 3 time horizons' },
    { icon: <Settings size={14} />, label: 'Protocol', desc: 'Configure AM/PM routines and study engine' },
    { icon: <BarChart2 size={14} />, label: 'Analytics', desc: 'View study history and weekly reviews' },
    { icon: <BookOpen size={14} />, label: 'Vault', desc: 'Write and search your knowledge base' },
    { icon: <FolderKanban size={14} />, label: 'Missions', desc: 'Manage all active and planned projects' },
  ];
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
      <div className="card" style={{ width:'100%', maxWidth:540, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:800 }}>Help & Features</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ fontSize:12, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Module Guide</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
          {features.map(f => (
            <div key={f.label} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 12px', background:'var(--bg-panel-hover)', borderRadius:10 }}>
              <div style={{ color:'#4D7CFE', marginTop:1 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700 }}>{f.label}</div>
                <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:12, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Keyboard Shortcuts</div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {shortcuts.map(s => (
            <div key={s.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background:'var(--bg-panel-hover)', borderRadius:8 }}>
              <span style={{ fontSize:12, color:'var(--text-secondary)' }}>{s.desc}</span>
              <kbd style={{ background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700, color:'#4D7CFE' }}>{s.key}</kbd>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, padding:'14px', background:'rgba(77,124,254,0.06)', borderRadius:12, border:'1px solid rgba(77,124,254,0.15)', fontSize:12, color:'var(--text-secondary)', lineHeight:1.6 }}>
          💾 All data is saved locally in your browser. Use <strong style={{ color:'#fff' }}>Settings → Export</strong> to back up your data as JSON.
        </div>
      </div>
    </div>
  );
};

/* ── SETTINGS MODAL ── */
const SettingsModal = ({ data, updateModule, onClose }) => {
  const [name, setName] = useState(data?.settings?.name ?? 'Azan');

  const saveSettings = () => {
    updateModule('settings', { ...data.settings, name });
    onClose();
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `empire-os-backup-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          updateModule(null, parsed);
          onClose();
          alert('Data imported successfully!');
        } catch { alert('Invalid backup file.'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const resetData = () => {
    if (window.confirm('This will erase ALL your Empire OS data. Are you sure?')) {
      localStorage.clear(); window.location.reload();
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
      <div className="card" style={{ width:'100%', maxWidth:440, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div style={{ fontSize:16, fontWeight:800 }}>Settings</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Profile</div>
        <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:24 }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#4D7CFE,#7B5BFB)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800 }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <input value={name} onChange={e => setName(e.target.value)}
            style={{ flex:1, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'11px 14px', fontSize:14, fontWeight:700, color:'#fff' }} />
        </div>

        <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Data Management</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
          <button onClick={exportData} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', textAlign:'left' }}>
            <Download size={16} color="#4D7CFE" /> Export Backup (JSON)
          </button>
          <button onClick={importData} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', textAlign:'left' }}>
            <ChevronRight size={16} color="#34C759" /> Import Backup
          </button>
          <button onClick={resetData} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'rgba(255,59,48,0.06)', border:'1px solid rgba(255,59,48,0.2)', borderRadius:10, color:'#FF3B30', fontSize:13, fontWeight:600, cursor:'pointer', textAlign:'left' }}>
            <Trash2 size={16} /> Reset All Data
          </button>
        </div>

        <button className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'13px' }} onClick={saveSettings}>Save Settings</button>
      </div>
    </div>
  );
};

/* ── QUICK ADD PANEL ── */
const QuickAdd = ({ data, updateModule, onClose }) => {
  const [type, setType]   = useState('task');
  const [value, setValue] = useState('');

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    if (type === 'task') {
      const tasks = data.dashboard?.secondaryTasks ?? [];
      if (tasks.length < 5)
        updateModule('dashboard', { ...data.dashboard, secondaryTasks: [...tasks, { id: crypto.randomUUID(), title: v, done: false }] });
    } else if (type === 'note') {
      const notes = data.vault?.notes ?? [];
      updateModule('vault', { ...data.vault, notes: [{ id: crypto.randomUUID(), title: v, category:'General', content:'', tags:[], createdAt: new Date().toISOString() }, ...notes] });
    } else if (type === 'mission') {
      const list = data.projects?.list ?? [];
      updateModule('projects', { ...data.projects, list: [...list, { id: crypto.randomUUID(), name: v, status:'idea', priority:'Medium', nextStep:'', deadline:'', notes:'', progress:0 }] });
    }
    setValue(''); onClose();
  };

  const types = [
    { id:'task',    label:'Task',    icon:<CheckCircle2 size={14} />, color:'#4D7CFE' },
    { id:'note',    label:'Note',    icon:<BookOpen     size={14} />, color:'#34C759' },
    { id:'mission', label:'Mission', icon:<FolderKanban size={14} />, color:'#FF9500' },
  ];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(12px)', display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:120 }}>
      <div className="card" style={{ width:'100%', maxWidth:520, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.25)' }}>
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {types.map(t => (
            <button key={t.id} onClick={() => setType(t.id)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8, border: type === t.id ? `1px solid ${t.color}` : '1px solid var(--border)', background: type === t.id ? `${t.color}22` : 'var(--bg-panel-hover)', color: type === t.id ? t.color : 'var(--text-secondary)', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={onClose} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <input autoFocus value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' ? submit() : e.key === 'Escape' && onClose()}
            placeholder={type === 'task' ? 'Add a sub-task...' : type === 'note' ? 'Note title...' : 'Mission name...'}
            style={{ flex:1, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'13px 16px', fontSize:14, color:'#fff' }} />
          <button className="btn-primary" onClick={submit} style={{ padding:'13px 20px' }}><Plus size={16} /></button>
        </div>
        <div style={{ marginTop:12, fontSize:11, color:'var(--text-dim)' }}>Press Enter to add · Esc to close</div>
      </div>
    </div>
  );
};

/* ── PROFILE DROPDOWN ── */
const ProfileMenu = ({ data, setView, onClose }) => {
  const name   = data?.settings?.name ?? 'Azan';
  const tasks  = data?.dashboard?.secondaryTasks ?? [];
  const done   = tasks.filter(t => t.done).length;
  const streak = data?.dashboard?.streak ?? 0;

  return (
    <div style={{ position:'absolute', top:52, right:0, width:240, background:'var(--bg-sidebar)', border:'1px solid var(--border)', borderRadius:14, boxShadow:'0 20px 60px rgba(0,0,0,0.5)', zIndex:500, overflow:'hidden' }}>
      <div style={{ padding:'16px', borderBottom:'1px solid var(--border)', display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#4D7CFE,#7B5BFB)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800 }}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:14 }}>{name}</div>
          <div style={{ fontSize:11, color:'var(--text-secondary)' }}>Empire Commander</div>
        </div>
      </div>
      <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', display:'flex', gap:20 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:18, fontWeight:800, color:'#4D7CFE' }}>{done}</div>
          <div style={{ fontSize:10, color:'var(--text-dim)', fontWeight:600 }}>Done today</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:18, fontWeight:800, color:'#FF9500' }}>{streak}🔥</div>
          <div style={{ fontSize:10, color:'var(--text-dim)', fontWeight:600 }}>Streak</div>
        </div>
      </div>
      <div style={{ padding:8 }}>
        <button onClick={() => { setView('progress'); onClose(); }} style={{ width:'100%', textAlign:'left', padding:'10px 10px', borderRadius:8, background:'none', border:'none', color:'var(--text-secondary)', fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
          <BarChart2 size={15} /> View My Analytics
        </button>
        <button onClick={() => { setView('settings'); onClose(); }} style={{ width:'100%', textAlign:'left', padding:'10px 10px', borderRadius:8, background:'none', border:'none', color:'var(--text-secondary)', fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
          <Settings size={15} /> Settings
        </button>
      </div>
    </div>
  );
};

/* ── MAIN APP ── */
const App = () => {
  const { data, updateModule } = useApp();
  const [view, setView] = useState('dashboard');

  // ── SELF-HEALING: Ensure elite data exists in data ──
  useEffect(() => {
    if (!data) return;

    // Check if we already initialized the elite package v3
    const hasLatestElite = data.shortTerm?.some(h => h.title === 'Complete Algebra Reinforcement');
    const hasEliteVault = data.vault?.notes?.some(n => n.id === 'rule1');

    if (!hasLatestElite || !hasEliteVault) {
      console.log('Self-healing: Injecting Elite Initialization Package v3...');
      import('./services/storage').then(({ INITIAL_DATA }) => {
        updateModule(null, {
          ...data,
          // Merge lists carefully
          habits: { 
            list: [...(data.habits?.list || []), ...INITIAL_DATA.habits.list.filter(h => !data.habits?.list?.find(eh => eh.id === h.id))] 
          },
          shortTerm: [
            ...INITIAL_DATA.shortTerm.filter(s => !data.shortTerm?.find(es => es.title === s.title)),
            ...(data.shortTerm || [])
          ],
          midTerm: [
            ...INITIAL_DATA.midTerm.filter(m => !data.midTerm?.find(em => em.title === m.title)),
            ...(data.midTerm || [])
          ],
          longTerm: data.longTerm?.vision && data.longTerm.vision !== INITIAL_DATA.longTerm.vision ? data.longTerm : INITIAL_DATA.longTerm,
          vault: {
            notes: [...(data.vault?.notes || []), ...INITIAL_DATA.vault.notes.filter(n => !data.vault?.notes?.find(en => en.id === n.id))]
          },
          schoolRoutine: data.schoolRoutine?.length > 1 ? data.schoolRoutine : INITIAL_DATA.schoolRoutine,
          holidayRoutine: data.holidayRoutine?.length > 1 ? data.holidayRoutine : INITIAL_DATA.holidayRoutine,
          settings: {
            ...data.settings,
            activeRoutine: data.settings?.activeRoutine || 'school'
          }
        });
      });
    }
  }, [data]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showHelp,   setShowHelp]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showProfile,  setShowProfile]  = useState(false);
  const [search, setSearch] = useState('');

  const notifRef   = useRef(null);
  const profileRef = useRef(null);
  useClickOutside(notifRef,   () => setShowNotifs(false));
  useClickOutside(profileRef, () => setShowProfile(false));

  // Global keyboard shortcut: Ctrl/Cmd + K = quick add
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowQuickAdd(true); }
      if (e.key === 'Escape') { setShowQuickAdd(false); setShowHelp(false); setShowSettings(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const renderView = () => {
    const props = { data: data[view], update: (val) => updateModule(view, val) };
    switch (view) {
      case 'dashboard': return <Dashboard  data={data} update={(val) => updateModule(null, val)} />;
      case 'goals':     return <Goals      data={data} update={(val) => updateModule(null, val)} setView={setView} />;
      case 'system':    return <System     {...props} fullData={data} />;
      case 'routines':  return <Routines   data={data} update={(val) => updateModule(null, val)} />;
      case 'vault':     return <Vault      {...props} />;
      case 'projects':  return <Projects   {...props} />;
      case 'habits':    return <Habits     {...props} />;
      case 'journal':   return <Journal    {...props} />;
      default:          return <Dashboard  data={data} update={(val) => updateModule(null, val)} />;
    }
  };

  const name = data?.settings?.name ?? 'Azan';

  // Unread notif count
  const pending = (data?.dashboard?.secondaryTasks ?? []).filter(t => !t.done).length;
  const noMission = !data?.dashboard?.mainMission;
  const notifCount = pending + (noMission ? 1 : 0);

  const ghostMode = data?.dashboard?.ghostMode ?? false;

  return (
    <div className="app-shell">
      {!ghostMode && (
        <Navigation currentView={view} setView={setView} onQuickAdd={() => setShowQuickAdd(true)} />
      )}

      <div className="content-area">
        {/* TOP BAR */}
        {!ghostMode && (
          <header className="topbar">
          <div className="topbar-search">
            <Search size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search for missions, notes, etc  (⌘K to quick-add)" />
          </div>

          <div className="topbar-actions">
            {/* BELL */}
            <div ref={notifRef} style={{ position:'relative' }}>
              <button className="topbar-icon-btn" onClick={() => { setShowNotifs(s => !s); setShowProfile(false); }} style={{ position:'relative' }}>
                <Bell size={17} />
                {notifCount > 0 && (
                  <span style={{ position:'absolute', top:4, right:4, width:8, height:8, borderRadius:'50%', background:'#FF3B30', border:'2px solid var(--bg-main)' }} />
                )}
              </button>
              {showNotifs && <NotificationsPanel data={data} onClose={() => setShowNotifs(false)} />}
            </div>

            {/* HELP */}
            <button className="topbar-icon-btn" onClick={() => setShowHelp(true)}>
              <HelpCircle size={17} />
            </button>

            {/* SETTINGS */}
            <button className="topbar-icon-btn" onClick={() => setShowSettings(true)}>
              <Settings size={17} />
            </button>

            {/* AVATAR / PROFILE */}
            <div ref={profileRef} style={{ position:'relative' }}>
              <div className="topbar-avatar" onClick={() => { setShowProfile(s => !s); setShowNotifs(false); }}>
                <div className="topbar-avatar-img">{name.charAt(0).toUpperCase()}</div>
                <span className="topbar-avatar-name">{name}</span>
              </div>
              {showProfile && <ProfileMenu data={data} setView={setView} onClose={() => setShowProfile(false)} />}
            </div>
          </div>
        </header>
        )}

        {/* PAGE CONTENT */}
        <div className="page-scroll">
          <AnimatePresence mode="wait">
            <motion.div key={view} className="fade-in"
              style={{ width: '100%' }}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }} transition={{ duration:0.18 }}>
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* GLOBAL MODALS */}
      {showHelp      && <HelpModal     onClose={() => setShowHelp(false)} />}
      {showSettings  && <SettingsModal data={data} updateModule={updateModule} onClose={() => setShowSettings(false)} />}
      {showQuickAdd  && <QuickAdd      data={data} updateModule={updateModule} onClose={() => setShowQuickAdd(false)} />}
    </div>
  );
};

export default App;
