import React, { useState } from 'react';
import { 
  Sun, Moon, Plus, Trash2, CheckCircle2, 
  Circle, Clock, Zap, Coffee, Bed, Calendar,
  ChevronRight, Layout, Sparkles, Activity, Droplets
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
  const activeList = activeMode === 'school' ? schoolRoutine : holidayRoutine;
  
  const [newItem, setNewItem] = useState('');
  const [newTime, setNewTime] = useState('');

  const patch = (field, val) => update({ ...data, [field]: val });
  const patchSystem = (patch) => update({ ...data, system: { ...system, ...patch } });

  const addItem = () => {
    if (!newItem.trim()) return;
    const item = { id: Date.now(), time: newTime, task: newItem, done: false };
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
    <div className="fade-in" style={{ paddingBottom: 60 }}>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Operational Routines</h1>
          <p className="page-subtitle">Your daily structure for peak execution.</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button 
            onClick={() => update({ ...data, settings: { ...settings, activeRoutine: 'school' }})}
            className={activeMode === 'school' ? 'btn-primary' : 'btn-ghost'}
            style={{ padding: '8px 16px' }}>
            🏫 School Mode
          </button>
          <button 
            onClick={() => update({ ...data, settings: { ...settings, activeRoutine: 'holiday' }})}
            className={activeMode === 'holiday' ? 'btn-primary' : 'btn-ghost'}
            style={{ padding: '8px 16px' }}>
            🏝️ Holiday Mode
          </button>
        </div>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* MAIN LIST */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
              {activeMode === 'school' ? <Layout size={20} color="#4D7CFE" /> : <Sparkles size={20} color="#FF9500" />}
              {activeMode === 'school' ? 'School Day Structure' : 'Holiday Optimization'}
            </h2>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{progress}% Done</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeList.map(item => {
              const isDone = system.routineHistory?.[today]?.[item.id];
              return (
                <div key={item.id} className="goal-item" style={{ borderLeft: `3px solid ${isDone ? '#34C759' : 'var(--accent)'}` }}>
                  <button onClick={() => toggleToday(item.id)} style={{ background:'none', border:'none', cursor:'pointer' }}>
                    {isDone ? <CheckCircle2 size={18} color="#34C759" /> : <Circle size={18} color="var(--text-dim)" />}
                  </button>
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isDone ? 'var(--text-dim)' : '#fff' }}>{item.task}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{item.time || 'Unscheduled'}</div>
                  </div>
                  <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', opacity: 0.3 }}><Trash2 size={14} /></button>
                </div>
              );
            })}

            <div style={{ display: 'flex', gap: 10, marginTop: 12, padding: 12, background: 'var(--bg-panel-hover)', borderRadius: 12 }}>
              <input value={newTime} onChange={e => setNewTime(e.target.value)} placeholder="07:00" style={{ width: 80, background: 'none', border: 'none', borderBottom: '1px solid var(--border)', color: '#fff', fontSize: 13 }} />
              <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Add routine block..." style={{ flex: 1, background: 'none', border: 'none', borderBottom: '1px solid var(--border)', color: '#fff', fontSize: 13 }} />
              <button onClick={addItem} className="btn-primary" style={{ padding: '8px' }}><Plus size={16} /></button>
            </div>
          </div>
        </div>

        {/* SIDEBAR: PROTOCOL RULES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* AM PROTOCOL */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Sun size={16} color="#FF9500" />
              <h4 style={{ fontSize: 14, fontWeight: 700 }}>AM Protocol</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 800 }}>WAKE TIME</label>
                <input type="time" value={system.morning?.wakeTime || ''} onChange={e => patchSystem({ morning: { ...(system.morning || {}), wakeTime: e.target.value } })}
                  style={{ width: '100%', background: 'var(--bg-panel-hover)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px', color: '#fff', marginTop: 4 }} />
              </div>
              <button onClick={() => patchSystem({ morning: { ...(system.morning || {}), phoneUsage: !system.morning?.phoneUsage } })}
                style={{ height: 40, borderRadius: 10, background: system.morning?.phoneUsage ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)', border: '1px solid var(--border)', color: system.morning?.phoneUsage ? '#34C759' : '#FF3B30', fontSize: 10, fontWeight: 800, cursor:'pointer' }}>
                PHONE BLOCK: {system.morning?.phoneUsage ? 'ACTIVE' : 'FAIL'}
              </button>
            </div>
          </div>

          {/* VITALITY ENGINE */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Activity size={18} color="#00C7BE" />
              <h2 style={{ fontSize: 16, fontWeight: 800 }}>Vitality Engine</h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 800 }}>WATER INTAKE</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} onClick={() => {
                      const h = { ...(system.water?.history || {}) };
                      h[today] = i;
                      patchSystem({ water: { ...(system.water || {}), history: h } });
                    }}
                      style={{ width: 12, height: 20, borderRadius: 4, background: (system.water?.history?.[today] || 0) >= i ? '#00C7BE' : 'var(--bg-panel-hover)', cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 900 }}>{system.water?.history?.[today] || 0}</div>
                <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>GLASSES</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 16 }}>Rules of Engagement</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Coffee size={16} color="#4D7CFE" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>AM: Deep Focus</div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>No external inputs for first 60 mins.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Bed size={16} color="#FF9500" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>PM: Reset</div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>Journal and reflection before sleep.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routines;
