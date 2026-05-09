import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Plus, Trash2, CheckCircle2, 
  Circle, Clock, Zap, Coffee, Bed, Calendar,
  ChevronRight, Layout, Sparkles, Activity, Droplets,
  ChevronDown, AlertCircle
} from 'lucide-react';

const Routines = ({ data, update }) => {
  const { 
    schoolRoutine = [], 
    holidayRoutine = [], 
    settings = { activeRoutine: 'school' },
    system = { routineHistory: {}, morning: {}, water: { target: 8, history: {} } } 
  } = data || {};

  const today = new Date().toISOString().split('T')[0];
  const activeMode = settings.activeRoutine || 'school';
  const activeList = [...(activeMode === 'school' ? schoolRoutine : holidayRoutine)].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  
  const [newItem, setNewItem] = useState('');
  const [newTime, setNewTime] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const patch = (field, val) => update({ ...data, [field]: val });
  const patchSystem = (patchData) => update({ ...data, system: { ...system, ...patchData } });

  const addItem = () => {
    if (!newItem.trim() || !newTime) return;
    const item = { id: Date.now(), time: newTime, task: newItem, category: 'General' };
    if (activeMode === 'school') patch('schoolRoutine', [...schoolRoutine, item]);
    else patch('holidayRoutine', [...holidayRoutine, item]);
    setNewItem(''); setNewTime('');
  };

  const deleteItem = (id) => {
    if (activeMode === 'school') patch('schoolRoutine', schoolRoutine.filter(i => i.id !== id));
    else patch('holidayRoutine', holidayRoutine.filter(i => i.id !== id));
  };

  const toggleToday = (id) => {
    const history = { ...(system.routineHistory || {}) };
    if (!history[today]) history[today] = {};
    history[today][id] = !history[today][id];
    patchSystem({ routineHistory: history });
  };

  const completedCount = Object.keys(system.routineHistory?.[today] || {}).filter(id => system.routineHistory[today][id]).length;
  const progress = Math.round((completedCount / (activeList.length || 1)) * 100);

  return (
    <div className="fade-in" style={{ paddingBottom: 100 }}>
      {/* Header with Switcher */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ padding:'4px 12px', background:'var(--accent)', borderRadius:20, fontSize:10, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:'0.1em' }}>Operational Mode</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-dim)' }}>{currentTime}</div>
          </div>
          <h1 className="page-title">Tactical Schedule</h1>
        </div>
        <div style={{ display:'flex', background:'var(--bg-sidebar)', padding:4, borderRadius:14, border:'1px solid var(--border)' }}>
          <button onClick={() => update({ ...data, settings: { ...settings, activeRoutine: 'school' }})}
            style={{ padding:'8px 20px', borderRadius:10, background: activeMode === 'school' ? 'var(--accent)' : 'transparent', border:'none', color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'0.2s' }}>
            <Sun size={14} /> School
          </button>
          <button onClick={() => update({ ...data, settings: { ...settings, activeRoutine: 'holiday' }})}
            style={{ padding:'8px 20px', borderRadius:10, background: activeMode === 'holiday' ? 'var(--accent)' : 'transparent', border:'none', color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'0.2s' }}>
            <Sparkles size={14} /> Holiday
          </button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:32 }}>
        {/* THE TIMELINE */}
        <div>
          <div className="card" style={{ padding:0, background:'transparent', border:'none' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:0, position:'relative' }}>
              {/* Vertical line */}
              <div style={{ position:'absolute', left:80, top:0, bottom:0, width:1, background:'var(--border)', zIndex:0 }} />

              {activeList.length === 0 && (
                <div style={{ padding:40, textAlign:'center', background:'var(--bg-sidebar)', borderRadius:20, border:'1px dashed var(--border)' }}>
                  <div style={{ fontSize:32, marginBottom:16 }}>📅</div>
                  <div style={{ fontWeight:800, marginBottom:8 }}>No Blocks Defined</div>
                  <div style={{ fontSize:12, color:'var(--text-dim)' }}>Add your first time block using the form below.</div>
                </div>
              )}

              {activeList.map((item, idx) => {
                const isDone = system.routineHistory?.[today]?.[item.id];
                const isCurrent = currentTime >= item.time && (idx === activeList.length - 1 || currentTime < activeList[idx+1].time);
                
                return (
                  <div key={item.id} style={{ display:'flex', gap:32, marginBottom:idx === activeList.length - 1 ? 0 : 20, position:'relative', zIndex:1 }}>
                    {/* Time Label */}
                    <div style={{ width:80, textAlign:'right', paddingTop:12 }}>
                      <div style={{ fontSize:14, fontWeight:900, color: isCurrent ? 'var(--accent)' : 'var(--text-dim)' }}>{item.time}</div>
                    </div>

                    {/* Dot */}
                    <div style={{ marginTop:14, position:'relative' }}>
                      <div style={{ width:12, height:12, borderRadius:'50%', background: isDone ? '#34C759' : isCurrent ? 'var(--accent)' : 'var(--bg-sidebar)', border:`3px solid ${isDone ? '#34C759' : 'var(--border)'}`, boxShadow: isCurrent ? '0 0 15px var(--accent)' : 'none' }} />
                    </div>

                    {/* Content Card */}
                    <div className="card" onClick={() => toggleToday(item.id)}
                      style={{ 
                        flex:1, 
                        background: isCurrent ? 'linear-gradient(90deg, rgba(77,124,254,0.1) 0%, transparent 100%)' : 'var(--bg-sidebar)', 
                        border: isCurrent ? '1px solid var(--accent)' : '1px solid var(--border)',
                        cursor:'pointer',
                        padding:'16px 20px',
                        display:'flex',
                        justifyContent:'space-between',
                        alignItems:'center',
                        transition:'0.2s',
                        transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                        opacity: isDone ? 0.6 : 1
                      }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:800, color: isDone ? 'var(--text-dim)' : '#fff', textDecoration: isDone ? 'line-through' : 'none' }}>{item.task}</div>
                        <div style={{ fontSize:11, color:'var(--text-dim)', marginTop:4, display:'flex', alignItems:'center', gap:4 }}>
                          <Clock size={10} /> {isCurrent ? 'Happening Now' : 'Upcoming Block'}
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                        {isDone ? <CheckCircle2 size={20} color="#34C759" /> : <div style={{ width:20, height:20, borderRadius:'50%', border:'2px solid var(--border)' }} />}
                        <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} style={{ background:'none', border:'none', color:'var(--text-dim)', opacity:0.3 }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Form */}
            <div className="card" style={{ marginTop:40, background:'rgba(77,124,254,0.05)', border:'1px dashed var(--accent)' }}>
              <div style={{ display:'flex', gap:16 }}>
                <div style={{ width:100 }}>
                  <label style={{ fontSize:10, fontWeight:900, color:'var(--accent)', textTransform:'uppercase', display:'block', marginBottom:8 }}>TIME</label>
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={{ width:'100%', background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:10, padding:12, color:'#fff', fontSize:13 }} />
                </div>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:10, fontWeight:900, color:'var(--accent)', textTransform:'uppercase', display:'block', marginBottom:8 }}>OPERATION / TASK</label>
                  <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="e.g. Deep Work Block A" style={{ width:'100%', background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:10, padding:12, color:'#fff', fontSize:13 }} />
                </div>
                <button className="btn-primary" onClick={addItem} style={{ alignSelf:'flex-end', height:45, width:45, justifyContent:'center' }}><Plus size={20} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* STATS & PROTOCOLS */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {/* Progress Card */}
          <div className="card" style={{ background:'linear-gradient(135deg, #1A1A1A 0%, #000 100%)', textAlign:'center', padding:'32px 20px' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--text-dim)', textTransform:'uppercase', marginBottom:8 }}>Daily Execution</div>
            <div style={{ fontSize:48, fontWeight:900, color:'var(--accent)' }}>{progress}%</div>
            <div style={{ height:6, background:'var(--bg-panel)', borderRadius:3, overflow:'hidden', marginTop:16, marginBottom:16 }}>
              <div style={{ height:'100%', width:`${progress}%`, background:'var(--accent)', transition:'width 0.6s ease' }} />
            </div>
            <div style={{ fontSize:11, color:'var(--text-secondary)' }}>{completedCount} / {activeList.length} blocks completed</div>
          </div>

          {/* AM Protocol */}
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div className="icon-box" style={{ background:'rgba(255,149,0,0.1)', color:'#FF9500' }}><Sun size={18} /></div>
              <h3 style={{ fontSize:16, fontWeight:800 }}>AM Protocol</h3>
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:800, color:'var(--text-dim)', textTransform:'uppercase', marginBottom:8 }}>Wake Time</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', background:'var(--bg-panel-hover)', borderRadius:12, border:'1px solid var(--border)' }}>
                <span style={{ fontSize:18, fontWeight:900 }}>{system.morning?.wakeTime || '07:30'}</span>
                <Clock size={16} color="var(--text-dim)" />
              </div>
            </div>
            <div onClick={() => patchSystem({ morning: { ...(system.morning || {}), phoneUsage: !system.morning?.phoneUsage } })}
              style={{ padding:16, borderRadius:12, background: system.morning?.phoneUsage ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)', border:'1px solid var(--border)', cursor:'pointer', textAlign:'center' }}>
              <div style={{ fontSize:11, fontWeight:900, color: system.morning?.phoneUsage ? '#34C759' : '#FF3B30' }}>
                {system.morning?.phoneUsage ? '🛡️ PHONE BLOCK ACTIVE' : '⚠️ PHONE USAGE DETECTED'}
              </div>
            </div>
          </div>

          {/* Vitality */}
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div className="icon-box" style={{ background:'rgba(0,199,190,0.1)', color:'#00C7BE' }}><Droplets size={18} /></div>
              <h3 style={{ fontSize:16, fontWeight:800 }}>Vitality Engine</h3>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:'var(--text-dim)', textTransform:'uppercase' }}>Water intake</div>
                <div style={{ display:'flex', gap:4, marginTop:12 }}>
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} onClick={() => {
                      const h = { ...(system.water?.history || {}) };
                      h[today] = i;
                      patchSystem({ water: { ...(system.water || {}), history: h } });
                    }}
                      style={{ width:12, height:24, borderRadius:4, background: (system.water?.history?.[today] || 0) >= i ? '#00C7BE' : 'var(--bg-panel-hover)', cursor:'pointer' }} />
                  ))}
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:32, fontWeight:900 }}>{system.water?.history?.[today] || 0}</div>
                <div style={{ fontSize:10, color:'var(--text-dim)', fontWeight:800 }}>GLASSES</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routines;
