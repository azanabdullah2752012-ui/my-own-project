import React, { useState } from 'react';
import { 
  Moon, Sun, Zap, Clock, Plus, Trash2, CheckCircle2, 
  Circle, Shield, Target, Coffee, Calendar, Star,
  Droplets, Book, Activity, Bed, Timer
} from 'lucide-react';

const System = ({ data, update }) => {
  const { 
    morning, study, night, 
    prayers = {}, sleep = { target: 8, history: {} }, 
    water = { target: 8, history: {} }, 
    quran = { lastSurah: '', lastAyah: '', history: {} } 
  } = data || {};
  
  const [newPriority, setNewPriority] = useState('');
  const [quranInput, setQuranInput] = useState('');

  const patchMorning = (key, val) => update({ ...data, morning: { ...morning, [key]: val } });
  const patchStudy   = (key, val) => update({ ...data, study: { ...study, [key]: val } });
  const patchNight   = (key, val) => update({ ...data, night: { ...night, [key]: val } });

  const today = new Date().toISOString().split('T')[0];

  // Helper to update history-based modules
  const patchHistory = (moduleKey, date, value) => {
    const newModule = { ...data[moduleKey] };
    if (!newModule.history) newModule.history = {};
    newModule.history[date] = value;
    update({ ...data, [moduleKey]: newModule });
  };

  const prayerNames = [
    { key: 'fajr', label: 'Fajr', icon: '🌅', color: '#FFD700' },
    { key: 'dhuhr', label: 'Dhuhr', icon: '☀️', color: '#FFA500' },
    { key: 'asr', label: 'Asr', icon: '🌤️', color: '#FF8C00' },
    { key: 'maghrib', label: 'Maghrib', icon: '🌇', color: '#FF4500' },
    { key: 'isha', label: 'Isha', icon: '🌙', color: '#4D7CFE' }
  ];

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

  const updateWater = (val) => {
    const current = water.history?.[today] || 0;
    patchHistory('water', today, Math.max(0, current + val));
  };

  const updateQuran = () => {
    if (!quranInput.trim()) return;
    const newQuran = { ...quran, history: { ...quran.history, [today]: quranInput } };
    update({ ...data, quran: newQuran });
    setQuranInput('');
  };

  return (
    <div className="fade-in" style={{ paddingBottom: 100 }}>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Empire Protocol</h1>
          <p className="page-subtitle">The operating system for your life. Balance productivity, vitality, and faith.</p>
        </div>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
        
        {/* --- CORE ENGINES --- */}
        <div style={{ gridColumn: 'span 12' }}>
          <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={14} /> Core Engines
          </h3>
        </div>

        {/* AM PROTOCOL */}
        <section className="card" style={{ gridColumn: 'span 6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="icon-box" style={{ background: 'rgba(255, 149, 0, 0.1)', color: '#FF9500' }}>
              <Sun size={18} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>AM Protocol</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div className="input-group">
              <label>Wake Time</label>
              <input type="time" value={morning.wakeTime} onChange={(e) => patchMorning('wakeTime', e.target.value)}
                style={{ width: '100%', background: 'var(--bg-panel-hover)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 16, fontWeight: 700 }} />
            </div>
            <div className="input-group">
              <label>First Action</label>
              <input type="text" placeholder="e.g. Cold Shower" value={morning.firstAction} onChange={(e) => patchMorning('firstAction', e.target.value)}
                style={{ width: '100%', background: 'var(--bg-panel-hover)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 14 }} />
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
            <button onClick={() => patchMorning('phoneUsage', !morning.phoneUsage)} className={morning.phoneUsage ? 'btn-danger' : 'btn-primary'} style={{ padding: '8px 16px', fontSize: 12 }}>
              {morning.phoneUsage ? 'Broken' : 'Active'}
            </button>
          </div>
        </section>

        {/* COGNITIVE ENGINE */}
        <section className="card" style={{ gridColumn: 'span 6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="icon-box" style={{ background: 'rgba(77, 124, 254, 0.1)', color: '#4D7CFE' }}>
              <Timer size={18} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Study Engine</h2>
          </div>

          <div className="input-group" style={{ marginBottom: 16 }}>
            <label>Deep Work Session Length</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[25, 45, 60, 90].map(len => (
                <button key={len} onClick={() => patchStudy('sessionLength', len)}
                  style={{ flex: 1, padding: '12px', borderRadius: 10, background: study.sessionLength === len ? '#4D7CFE' : 'var(--bg-panel-hover)', border: '1px solid var(--border)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
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

        {/* --- SPIRITUAL ENGINE --- */}
        <div style={{ gridColumn: 'span 12', marginTop: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={14} /> Spiritual Engine
          </h3>
        </div>

        {/* PRAYER TRACKER */}
        <section className="card" style={{ gridColumn: 'span 8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="icon-box" style={{ background: 'rgba(52, 199, 89, 0.1)', color: '#34C759' }}>
                <Activity size={18} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800 }}>Prayer Tracker (Salah)</h2>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Track your daily prayers
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
                            <button onClick={() => togglePrayer(date, p.key)}
                              style={{ width: '100%', aspectRatio: '1', minHeight: '44px', borderRadius: 10, background: completed ? p.color : 'var(--bg-panel-hover)', border: '1px solid var(--border)', color: '#fff', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

        {/* QURAN TRACKER */}
        <section className="card" style={{ gridColumn: 'span 4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="icon-box" style={{ background: 'rgba(123, 91, 251, 0.1)', color: '#7B5BFB' }}>
              <Book size={18} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Quran Journey</h2>
          </div>
          
          <div className="input-group" style={{ marginBottom: 16 }}>
            <label>Current Surah / Page</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" placeholder="e.g. Al-Baqarah, p. 12" value={quranInput} onChange={(e) => setQuranInput(e.target.value)}
                style={{ flex: 1, background: 'var(--bg-panel-hover)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 14 }} />
              <button onClick={updateQuran} className="btn-primary" style={{ padding: '12px' }}><Plus size={18} /></button>
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Recent Progress</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(quran.history || {}).sort().reverse().slice(0, 3).map(([date, val]) => (
              <div key={date} style={{ background: 'var(--bg-panel-hover)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{date === today ? 'Today' : date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- VITALITY ENGINE --- */}
        <div style={{ gridColumn: 'span 12', marginTop: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Coffee size={14} /> Vitality Engine
          </h3>
        </div>

        {/* SLEEP TRACKER */}
        <section className="card" style={{ gridColumn: 'span 6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="icon-box" style={{ background: 'rgba(77, 124, 254, 0.1)', color: '#4D7CFE' }}>
              <Bed size={18} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Sleep Quality</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="input-group">
              <label>Last Night's Sleep</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="range" min="4" max="12" step="0.5" value={sleep.history?.[today]?.hours || 8} 
                  onChange={(e) => patchHistory('sleep', today, { ...sleep.history?.[today], hours: parseFloat(e.target.value) })}
                  style={{ flex: 1 }} />
                <span style={{ fontSize: 16, fontWeight: 800, width: 40 }}>{sleep.history?.[today]?.hours || 8}h</span>
              </div>
            </div>
            <div className="input-group">
              <label>Quality</label>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map(lvl => (
                  <button key={lvl} onClick={() => patchHistory('sleep', today, { ...sleep.history?.[today], quality: lvl })}
                    style={{ flex: 1, padding: '8px 0', borderRadius: 8, background: (sleep.history?.[today]?.quality || 3) >= lvl ? '#4D7CFE' : 'var(--bg-panel-hover)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                    <Star size={10} fill={(sleep.history?.[today]?.quality || 3) >= lvl ? '#fff' : 'none'} color="#fff" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WATER TRACKER */}
        <section className="card" style={{ gridColumn: 'span 6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="icon-box" style={{ background: 'rgba(0, 199, 190, 0.1)', color: '#00C7BE' }}>
              <Droplets size={18} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Hydration</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} onClick={() => patchHistory('water', today, i + 1)}
                  style={{ width: 24, height: 32, borderRadius: 6, border: '2px solid', borderColor: (water.history?.[today] || 0) > i ? '#00C7BE' : 'var(--border)', background: (water.history?.[today] || 0) > i ? 'rgba(0, 199, 190, 0.2)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }} />
              ))}
            </div>
            <div style={{ textAlign: 'right', marginLeft: 20 }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#00C7BE' }}>{water.history?.[today] || 0}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Glasses</div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default System;
