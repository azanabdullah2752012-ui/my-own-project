import React, { useState } from 'react';
import { 
  Moon, Sun, Zap, Clock, Plus, Trash2, CheckCircle2, 
  Circle, Shield, Target, Coffee, Calendar, Star
} from 'lucide-react';

const System = ({ data, update }) => {
  const { morning, study, night, prayers = {} } = data || {};
  const [newPriority, setNewPriority] = useState('');

  const patchMorning = (key, val) => update({ ...data, morning: { ...morning, [key]: val } });
  const patchStudy   = (key, val) => update({ ...data, study: { ...study, [key]: val } });
  const patchNight   = (key, val) => update({ ...data, night: { ...night, [key]: val } });

  const addPriority = () => {
    if (!newPriority.trim()) return;
    const current = night.tomorrowPlan || [];
    if (current.length >= 5) return;
    patchNight('tomorrowPlan', [...current, { id: crypto.randomUUID(), title: newPriority, done: false }]);
    setNewPriority('');
  };

  const removePriority = (id) => {
    patchNight('tomorrowPlan', night.tomorrowPlan.filter(p => p.id !== id));
  };

  const togglePriority = (id) => {
    patchNight('tomorrowPlan', night.tomorrowPlan.map(p => p.id === id ? { ...p, done: !p.done } : p));
  };

  // --- PRAYER TRACKER LOGIC ---
  const prayerNames = [
    { key: 'fajr', label: 'Fajr', icon: '🌅', color: '#FFD700' },
    { key: 'dhuhr', label: 'Dhuhr', icon: '☀️', color: '#FFA500' },
    { key: 'asr', label: 'Asr', icon: '🌤️', color: '#FF8C00' },
    { key: 'maghrib', label: 'Maghrib', icon: '🌇', color: '#FF4500' },
    { key: 'isha', label: 'Isha', icon: '🌙', color: '#483D8B' }
  ];

  const today = new Date().toISOString().split('T')[0];
  const getLastNDays = (n) => {
    return Array.from({ length: n }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
  };

  const last7Days = getLastNDays(7);

  const togglePrayer = (date, prayerKey) => {
    const newPrayers = { ...prayers };
    if (!newPrayers[date]) newPrayers[date] = {};
    newPrayers[date][prayerKey] = !newPrayers[date][prayerKey];
    update({ ...data, prayers: newPrayers });
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Daily Protocol</h1>
          <p className="page-subtitle">Configure your AM routine, prayer habits, and study engine.</p>
        </div>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        
        {/* AM PROTOCOL */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="icon-box" style={{ background: 'rgba(255, 149, 0, 0.1)', color: '#FF9500' }}>
              <Sun size={18} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>AM Protocol</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div className="input-group">
              <label>Wake Time</label>
              <input 
                type="time" 
                value={morning.wakeTime} 
                onChange={(e) => patchMorning('wakeTime', e.target.value)}
                style={{ width: '100%', background: 'var(--bg-panel-hover)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 16, fontWeight: 700 }}
              />
            </div>
            <div className="input-group">
              <label>First Action</label>
              <input 
                type="text" 
                placeholder="e.g. Cold Shower"
                value={morning.firstAction} 
                onChange={(e) => patchMorning('firstAction', e.target.value)}
                style={{ width: '100%', background: 'var(--bg-panel-hover)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 14 }}
              />
            </div>
          </div>

          <div style={{ padding: 16, background: morning.phoneUsage ? 'rgba(255, 59, 48, 0.1)' : 'rgba(52, 199, 89, 0.1)', borderRadius: 12, border: `1px solid ${morning.phoneUsage ? 'rgba(255, 59, 48, 0.2)' : 'rgba(52, 199, 89, 0.2)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Shield size={20} color={morning.phoneUsage ? '#FF3B30' : '#34C759'} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Electronic Blockade</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>No screens for first 60 minutes</div>
              </div>
            </div>
            <button 
              onClick={() => patchMorning('phoneUsage', !morning.phoneUsage)}
              className={morning.phoneUsage ? 'btn-danger' : 'btn-primary'}
              style={{ padding: '8px 16px', fontSize: 12 }}
            >
              {morning.phoneUsage ? 'Broken' : 'Active'}
            </button>
          </div>
        </section>

        {/* COGNITIVE ENGINE */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="icon-box" style={{ background: 'rgba(77, 124, 254, 0.1)', color: '#4D7CFE' }}>
              <Zap size={18} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Cognitive Engine</h2>
          </div>

          <div className="input-group" style={{ marginBottom: 16 }}>
            <label>Deep Work Session Length</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[25, 45, 60, 90].map(len => (
                <button 
                  key={len}
                  onClick={() => patchStudy('sessionLength', len)}
                  style={{ 
                    flex: 1, padding: '12px', borderRadius: 10, 
                    background: study.sessionLength === len ? '#4D7CFE' : 'var(--bg-panel-hover)',
                    border: '1px solid var(--border)', color: '#fff', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {len}m
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label>Daily Sessions Target</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-panel-hover)', padding: '4px 12px', borderRadius: 10, border: '1px solid var(--border)' }}>
                <button onClick={() => patchStudy('sessionsPerDay', Math.max(1, study.sessionsPerDay - 1))} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 20, cursor: 'pointer' }}>−</button>
                <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16 }}>{study.sessionsPerDay}</span>
                <button onClick={() => patchStudy('sessionsPerDay', study.sessionsPerDay + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 20, cursor: 'pointer' }}>+</button>
              </div>
            </div>
            <div className="input-group">
              <label>Break Duration</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-panel-hover)', padding: '4px 12px', borderRadius: 10, border: '1px solid var(--border)' }}>
                <button onClick={() => patchStudy('breakDuration', Math.max(1, study.breakDuration - 1))} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 20, cursor: 'pointer' }}>−</button>
                <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16 }}>{study.breakDuration}m</span>
                <button onClick={() => patchStudy('breakDuration', study.breakDuration + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 20, cursor: 'pointer' }}>+</button>
              </div>
            </div>
          </div>
        </section>

        {/* PRAYER TRACKER (NEW) */}
        <section className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="icon-box" style={{ background: 'rgba(52, 199, 89, 0.1)', color: '#34C759' }}>
                <Star size={18} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800 }}>Prayer Tracker (Salah)</h2>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Consistency is key
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '8px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: 12, color: 'var(--text-dim)', padding: '8px' }}>Day</th>
                  {prayerNames.map(p => (
                    <th key={p.key} style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', padding: '8px' }}>
                      <div style={{ fontSize: 16, marginBottom: 4 }}>{p.icon}</div>
                      <div>{p.label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {last7Days.map(date => {
                  const isToday = date === today;
                  const d = new Date(date + 'T00:00:00');
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum  = d.getDate();
                  
                  return (
                    <tr key={date}>
                      <td style={{ padding: '8px' }}>
                        <div style={{ background: isToday ? 'rgba(77, 124, 254, 0.15)' : 'var(--bg-panel-hover)', borderRadius: 10, padding: '8px 12px', border: isToday ? '1px solid #4D7CFE' : '1px solid var(--border)', textAlign: 'center' }}>
                          <div style={{ fontSize: 10, fontWeight: 800, color: isToday ? '#4D7CFE' : 'var(--text-dim)', textTransform: 'uppercase' }}>{dayName}</div>
                          <div style={{ fontSize: 14, fontWeight: 900 }}>{dayNum}</div>
                        </div>
                      </td>
                      {prayerNames.map(p => {
                        const completed = prayers[date]?.[p.key];
                        return (
                          <td key={p.key} style={{ textAlign: 'center' }}>
                            <button 
                              onClick={() => togglePrayer(date, p.key)}
                              style={{ 
                                width: '100%', aspectRatio: '1', minHeight: '44px', borderRadius: 10, 
                                background: completed ? p.color : 'var(--bg-panel-hover)',
                                border: '1px solid var(--border)', color: '#fff',
                                cursor: 'pointer', transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >
                              {completed ? <CheckCircle2 size={20} /> : <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--border)' }} />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* PM PROTOCOL & TOMORROW'S PLAN */}
        <section className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div className="icon-box" style={{ background: 'rgba(123, 91, 251, 0.1)', color: '#7B5BFB' }}>
                  <Moon size={18} />
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>PM Protocol</h2>
              </div>
              
              <div className="input-group">
                <label>Daily Reflection</label>
                <textarea 
                  placeholder="What was the highlight? What could be better?"
                  value={night.reflection}
                  onChange={(e) => patchNight('reflection', e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-panel-hover)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', color: '#fff', fontSize: 14, minHeight: 120, resize: 'none' }}
                />
              </div>

              <div style={{ marginTop: 20 }}>
                <button 
                  onClick={() => patchNight('streakConfirmed', !night.streakConfirmed)}
                  className={night.streakConfirmed ? 'btn-primary' : 'btn-ghost'}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', border: night.streakConfirmed ? 'none' : '1px solid var(--border)', background: night.streakConfirmed ? '#34C759' : 'transparent' }}
                >
                  <CheckCircle2 size={16} style={{ marginRight: 8 }} />
                  {night.streakConfirmed ? 'Day Confirmed ✓' : 'Confirm Day Success'}
                </button>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="icon-box" style={{ background: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30' }}>
                    <Calendar size={18} />
                  </div>
                  <h2 style={{ fontSize: 16, fontWeight: 800 }}>Tomorrow's Priorities</h2>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)' }}>{night.tomorrowPlan?.length || 0}/5</span>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input 
                  type="text" 
                  placeholder="Top mission for tomorrow..."
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPriority()}
                  style={{ flex: 1, background: 'var(--bg-panel-hover)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#fff' }}
                />
                <button onClick={addPriority} className="btn-primary" style={{ padding: '10px' }}>
                  <Plus size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {night.tomorrowPlan?.map(p => (
                  <div key={p.id} className="nav-item" style={{ cursor: 'default', background: 'var(--bg-panel-hover)', border: '1px solid var(--border)', padding: '12px 14px' }}>
                    <button onClick={() => togglePriority(p.id)} style={{ background: 'none', border: 'none', color: p.done ? '#34C759' : 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                      {p.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </button>
                    <span style={{ flex: 1, fontSize: 13, textDecoration: p.done ? 'line-through' : 'none', color: p.done ? 'var(--text-dim)' : '#fff' }}>{p.title}</span>
                    <button onClick={() => removePriority(p.id)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', opacity: 0.5 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {(!night.tomorrowPlan || night.tomorrowPlan.length === 0) && (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-dim)', fontSize: 13 }}>
                    No priorities set for tomorrow.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default System;
