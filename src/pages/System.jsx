import React, { useState } from 'react';
import { 
  Moon, Sun, Zap, Clock, Plus, Trash2, CheckCircle2, 
  Circle, Shield, Target, Coffee, Calendar, Star,
  Droplets, Book, Activity, Bed, Timer, Heart, Sparkles
} from 'lucide-react';

const System = ({ data: systemData, update, fullData }) => {
  const { 
    prayers = {}, 
    quran = { lastSurah: '', lastAyah: '', history: {} },
    dhikr = { history: {} },
    sunnah = { history: {} },
    water = { history: {} },
    sleep = { history: {} }
  } = systemData || {};
  
  const [quranInput, setQuranInput] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const patchSystem = (patch) => update({ ...systemData, ...patch });

  const patchHistory = (moduleKey, date, value) => {
    const newModule = { ...(systemData[moduleKey] || { history: {} }) };
    if (!newModule.history) newModule.history = {};
    newModule.history[date] = value;
    patchSystem({ [moduleKey]: newModule });
  };

  const prayerNames = [
    { key: 'fajr', label: 'Fajr', icon: '🌅', color: '#FFD700' },
    { key: 'dhuhr', label: 'Dhuhr', icon: '☀️', color: '#FFA500' },
    { key: 'asr', label: 'Asr', icon: '🌤️', color: '#FF8C00' },
    { key: 'maghrib', label: 'Maghrib', icon: '🌇', color: '#FF4500' },
    { key: 'isha', label: 'Isha', icon: '🌙', color: '#4D7CFE' }
  ];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const togglePrayer = (date, prayerKey) => {
    const newPrayers = { ...prayers };
    if (!newPrayers[date]) newPrayers[date] = {};
    newPrayers[date][prayerKey] = !newPrayers[date][prayerKey];
    patchSystem({ prayers: newPrayers });
  };

  const updateQuran = () => {
    if (!quranInput.trim()) return;
    const newQuran = { ...quran, history: { ...(quran.history || {}), [today]: quranInput } };
    patchSystem({ quran: newQuran });
    setQuranInput('');
  };

  const calculateScore = () => {
    let score = 0, total = 6;
    const todayPrayers = prayers[today] || {};
    score += Object.values(todayPrayers).filter(Boolean).length === 5 ? 1 : 0;
    if ((water.history?.[today] || 0) >= 8) score += 1;
    if (quran.history?.[today]) score += 1;
    if (dhikr.history?.[today]?.tasbih >= 33) score += 1;
    if (Object.values(sunnah.history?.[today] || {}).filter(Boolean).length >= 2) score += 1;
    return Math.round((score / total) * 100);
  };

  const score = calculateScore();

  return (
    <div className="fade-in" style={{ paddingBottom: 100 }}>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Empire Protocol</h1>
          <p className="page-subtitle">The operating system for your faith and vitality.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Protocol Score</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#4D7CFE' }}>{score}%</div>
        </div>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
        
        {/* SPIRITUAL ENGINE */}
        <section className="card" style={{ gridColumn: 'span 12' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="icon-box" style={{ background: 'rgba(52, 199, 89, 0.1)', color: '#34C759' }}>
                <Activity size={18} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800 }}>Prayer Tracker (Salah)</h2>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {prayerNames.map(p => (
                <div key={p.key} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, marginBottom: 2 }}>{p.icon}</div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-dim)' }}>{p.label}</div>
                  <button onClick={() => togglePrayer(today, p.key)}
                    style={{ marginTop: 6, width: 24, height: 24, borderRadius: 6, background: prayers[today]?.[p.key] ? p.color : 'var(--bg-panel-hover)', border: '1px solid var(--border)', cursor: 'pointer', transition: '0.2s' }}>
                    {prayers[today]?.[p.key] && <CheckCircle2 size={12} color="#fff" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '8px' }}>
              <tbody>
                {last7Days.map(date => (
                  <tr key={date}>
                    <td style={{ width: 60 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: date === today ? '#4D7CFE' : 'var(--text-dim)', textTransform: 'uppercase' }}>{new Date(date + 'T00:00:00').toLocaleDateString('en-US',{weekday:'short'})}</div>
                    </td>
                    {prayerNames.map(p => (
                      <td key={p.key}>
                        <div style={{ height: 8, borderRadius: 4, background: prayers[date]?.[p.key] ? p.color : 'var(--bg-panel-hover)', opacity: date === today ? 1 : 0.6 }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card" style={{ gridColumn: 'span 6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="icon-box" style={{ background: 'rgba(123, 91, 251, 0.1)', color: '#7B5BFB' }}>
              <Book size={18} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Quran & Dhikr</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input type="text" placeholder="Quran progress..." value={quranInput} onChange={(e) => setQuranInput(e.target.value)}
              style={{ flex: 1, background: 'var(--bg-panel-hover)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 14 }} />
            <button onClick={updateQuran} className="btn-primary" style={{ padding: '12px' }}><Plus size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {['tasbih', 'tahmid', 'takbir'].map(k => (
              <div key={k} onClick={() => {
                const cur = dhikr.history?.[today]?.[k] || 0;
                patchHistory('dhikr', today, { ...(dhikr.history?.[today] || {}), [k]: cur + 33 });
              }}
              style={{ background: 'var(--bg-panel-hover)', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 4 }}>{k.toUpperCase()}</div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>{dhikr.history?.[today]?.[k] || 0}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ gridColumn: 'span 6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="icon-box" style={{ background: 'rgba(255, 45, 85, 0.1)', color: '#FF2D55' }}>
              <Heart size={18} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Sunnah Habits</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Miswak', 'Charity', 'Fasting', 'Adhkar'].map(s => (
              <div key={s} onClick={() => patchHistory('sunnah', today, { ...(sunnah.history?.[today] || {}), [s]: !sunnah.history?.[today]?.[s] })}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: sunnah.history?.[today]?.[s] ? 'rgba(255, 45, 85, 0.1)' : 'var(--bg-panel-hover)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                {sunnah.history?.[today]?.[s] ? <CheckCircle2 size={18} color="#FF2D55" /> : <Circle size={18} color="var(--text-dim)" />}
                <span style={{ fontSize: 13, fontWeight: 600 }}>{s}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default System;
