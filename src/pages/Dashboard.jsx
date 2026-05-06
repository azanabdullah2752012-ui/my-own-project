import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2, Circle, Plus, Trash2,
  FileText, BookOpen, Activity, Zap, Clipboard,
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw,
  Smile, Meh, Frown, Sun, Ghost, Lock, Unlock,
  Droplets, Bed, Moon, Coffee, ShieldCheck
} from 'lucide-react';

/* ───────────────────────────────────────────────
   CALENDAR
 ─────────────────────────────────────────────── */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_OF_WEEK = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const Calendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();
  const prevDays    = new Date(year, month, 0).getDate();

  const prev = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  const next = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1);

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - firstDay - daysInMonth + 1, cur: false });

  return (
    <div className="calendar-card">
      <div className="cal-header">
        <span className="cal-month">{MONTHS[month]} {year}</span>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prev}><ChevronLeft size={14} /></button>
          <button className="cal-nav-btn" onClick={next}><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="cal-grid">
        {DAYS_OF_WEEK.map(d => <div key={d} className="cal-dow">{d}</div>)}
        {cells.map((c, i) => {
          const isToday = c.cur && c.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div key={i} className={`cal-day${isToday ? ' today' : ''}${!c.cur ? ' other-month' : ''}`}>{c.day}</div>
          );
        })}
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────
   FOCUS TIMER
 ─────────────────────────────────────────────── */
const FocusTimer = ({ sessionLength, onSessionComplete }) => {
  const [seconds, setSeconds]   = useState(sessionLength * 60);
  const [running, setRunning]   = useState(false);
  const [done,    setDone]      = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSeconds(sessionLength * 60);
    setRunning(false);
    setDone(false);
  }, [sessionLength]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            onSessionComplete?.();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const reset = () => { setSeconds(sessionLength * 60); setRunning(false); setDone(false); };
  const mm = String(Math.floor(seconds / 60)).padStart(2,'0');
  const ss = String(seconds % 60).padStart(2,'0');

  return (
    <div className="schedule-item" style={{ borderLeftColor: done ? '#34C759' : running ? '#FF9500' : '#4D7CFE', marginBottom: 12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div className="schedule-type">{done ? 'Complete ✓' : running ? 'In Session' : 'Focus Timer'}</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: done ? '#34C759' : '#fff', letterSpacing: '0.05em', marginTop: 2 }}>
            {mm}:{ss}
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => setRunning(!running)} className="topbar-icon-btn" style={{ background: running ? 'rgba(255,149,0,0.1)' : 'rgba(77,124,254,0.1)', color: running ? '#FF9500' : '#4D7CFE' }}>
            {running ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={reset} className="topbar-icon-btn"><RotateCcw size={16} /></button>
        </div>
      </div>
      {running && <div style={{ height:2, background:'var(--accent)', marginTop:12, width:`${((sessionLength*60-seconds)/(sessionLength*60))*100}%`, transition:'width 1s linear' }} />}
    </div>
  );
};

/* ───────────────────────────────────────────────
   DASHBOARD MAIN
 ─────────────────────────────────────────────── */
const Dashboard = ({ data, update }) => {
  const db       = data?.dashboard   ?? {};
  const system   = data?.system      ?? {};
  const projects = data?.projects    ?? [];
  
  const [newTask, setNewTask] = useState('');

  const patchDash = (key, val) => {
    update({ ...data, dashboard: { ...db, [key]: val } });
  };

  const addTask = () => {
    const t = newTask.trim();
    if (!t || db.secondaryTasks?.length >= 5) return;
    patchDash('secondaryTasks', [...(db.secondaryTasks ?? []), { id: Date.now(), title: t, done: false }]);
    setNewTask('');
  };

  const toggleTask = (id) =>
    patchDash('secondaryTasks', db.secondaryTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const deleteTask = (id) =>
    patchDash('secondaryTasks', db.secondaryTasks.filter(t => t.id !== id));

  const onSessionComplete = () => {
    const cur = db.focusSessions ?? 0;
    patchDash('focusSessions', cur + 1);
    const curHours = db.studyHours ?? 0;
    const addedTime = (system?.study?.sessionLength ?? 25) / 60;
    patchDash('studyHours', curHours + addedTime);
  };

  const ghostMode = db.ghostMode ?? false;
  const gate = db.gatekeeper ?? { fajr: false, water: false, bed: false, dhikr: false };
  const gateCleared = Object.values(gate).every(Boolean);

  const moodIcons = [
    { label: 'Focused 🔥', icon: <Smile size={14} />, color: '#34C759' },
    { label: 'Normal 😐',  icon: <Meh   size={14} />, color: '#4D7CFE' },
    { label: 'Tired 😔',   icon: <Frown size={14} />, color: '#FF9500' },
  ];

  return (
    <div className="dash-grid" style={{ width: '100%' }}>
      {/* ── LEFT COLUMN ── */}
      <div style={{ gridColumn: ghostMode ? 'span 12' : 'span 8' }}>
        
        {/* HEADER & CONTROLS */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, padding:'0 4px' }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h1 style={{ fontSize:32, fontWeight:900, letterSpacing:'-0.02em' }}>
              Welcome Back, <span style={{ color:'var(--accent)' }}>{data?.settings?.name || 'Azan'}</span>
            </h1>
          </div>
          <div style={{ textAlign:'right', display:'flex', flexDirection:'column', gap:8 }}>
            <button 
              onClick={() => patchDash('ghostMode', !ghostMode)}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:12, background: ghostMode ? 'rgba(255,59,48,0.1)' : 'var(--bg-panel)', border:'1px solid var(--border)', color: ghostMode ? '#FF3B30' : '#fff', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
              {ghostMode ? <Unlock size={14} /> : <Ghost size={14} />} {ghostMode ? 'Exit Ghost Mode' : 'Ghost Mode (Focus Lock)'}
            </button>
            {!ghostMode && (
              <button 
                onClick={() => {
                  if(window.confirm('Reset for new day?')) {
                    patchDash('focusSessions', 0);
                    patchDash('secondaryTasks', (db.secondaryTasks || []).map(t => ({ ...t, done: false })));
                    patchDash('gatekeeper', { fajr: false, water: false, bed: false, dhikr: false });
                    patchDash('mainMission', '');
                  }
                }}
                style={{ background:'rgba(77,124,254,0.1)', border:'1px solid rgba(77,124,254,0.2)', color:'#4D7CFE', fontSize:11, fontWeight:700, padding:'6px 12px', borderRadius:8, cursor:'pointer' }}>
                New Day Reset
              </button>
            )}
          </div>
        </div>

        {/* GATEKEEPER CHECKLIST */}
        {!gateCleared && !ghostMode && (
          <div className="card" style={{ marginBottom: 24, border:'1px solid rgba(77,124,254,0.3)', background:'rgba(77,124,254,0.05)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <ShieldCheck size={18} color="var(--accent)" />
              <h2 style={{ fontSize:16, fontWeight:800 }}>Morning Gatekeeper</h2>
              <span style={{ fontSize:11, color:'var(--text-dim)', marginLeft:'auto' }}>Complete these to unlock today's mission</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
              {[
                { key:'fajr', label:'Fajr Prayed', icon:<Sun size={14} /> },
                { key:'water', label:'Hydrated', icon:<Droplets size={14} /> },
                { key:'bed', label:'Bed Made', icon:<Bed size={14} /> },
                { key:'dhikr', label:'Morning Adhkar', icon:<Moon size={14} /> }
              ].map(item => (
                <button key={item.key} 
                  onClick={() => patchDash('gatekeeper', { ...gate, [item.key]: !gate[item.key] })}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'12px', borderRadius:12, border:`1px solid ${gate[item.key] ? 'var(--accent)' : 'var(--border)'}`, background: gate[item.key] ? 'rgba(77,124,254,0.1)' : 'var(--bg-panel)', color: gate[item.key] ? '#fff' : 'var(--text-secondary)', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  {gate[item.key] ? <CheckCircle2 size={14} color="var(--accent)" /> : item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HERO — Mission */}
        <div className="hero-banner" style={{ opacity: (!gateCleared && !ghostMode) ? 0.4 : 1, pointerEvents: (!gateCleared && !ghostMode) ? 'none' : 'auto' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(77,124,254,0.8)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
              Today's Main Mission {!gateCleared && !ghostMode && '(Locked)'}
            </div>
            <textarea
              value={db.mainMission ?? ''}
              onChange={e => patchDash('mainMission', e.target.value)}
              placeholder="Write your #1 mission for today..."
              style={{ background:'none', border:'none', fontSize: 24, fontWeight: 800, color:'#fff', width:'100%', resize:'none', lineHeight:1.3, height: 70, marginBottom: 16 }}
            />
            <div style={{ display:'flex', gap: 10, alignItems:'center', flexWrap:'wrap' }}>
              {moodIcons.map(m => (
                <button key={m.label} onClick={() => patchDash('mood', m.label)}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:20, border:`1px solid ${db.mood === m.label ? m.color : 'var(--border)'}`, background: db.mood === m.label ? `${m.color}22` : 'transparent', color: db.mood === m.label ? m.color : 'var(--text-secondary)', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4, paddingLeft: 24 }}>
            <div style={{ fontSize: 40, fontWeight: 900, color:'#4D7CFE', lineHeight:1 }}>{db.focusSessions ?? 0}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', textAlign:'center' }}>Sessions<br/>Today</div>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="card" style={{ marginBottom: 16, display:'flex', alignItems:'center', gap: 20 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Study Hours Today</div>
            <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
              <button onClick={() => patchDash('studyHours', Math.max(0, (db.studyHours ?? 0) - 0.5))} style={{ width:30, height:30, borderRadius:8, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', color:'#fff', cursor:'pointer' }}>−</button>
              <span style={{ fontSize:32, fontWeight:900 }}>{(db.studyHours ?? 0).toFixed(1)}</span>
              <span style={{ fontSize:14, color:'var(--text-secondary)' }}>hrs</span>
              <button onClick={() => patchDash('studyHours', (db.studyHours ?? 0) + 0.5)} style={{ width:30, height:30, borderRadius:8, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', color:'#fff', cursor:'pointer' }}>+</button>
            </div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Streak</div>
            <div style={{ fontSize:32, fontWeight:900, color:'#FF9500' }}>{db.streak ?? 0} 🔥</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Protocol Score</div>
            <div style={{ fontSize:32, fontWeight:900, color: '#4D7CFE' }}>
               {(() => {
                let s = 0, t = 8;
                const today = new Date().toISOString().split('T')[0];
                const prayersObj = data?.system?.prayers?.[today] || {};
                s += Object.values(prayersObj).filter(Boolean).length;
                if ((data?.system?.water?.history?.[today] || 0) >= (data?.system?.water?.target || 8)) s += 1;
                if ((data?.system?.sleep?.history?.[today]?.hours || 0) >= 7) s += 1;
                if ((db.focusSessions || 0) >= 4) s += 1;
                return Math.round((s/t)*100);
              })()}%
            </div>
          </div>
        </div>

        {/* FOCUS TIMER & SUBJECT */}
        <div style={{ display:'grid', gridTemplateColumns: ghostMode ? '1fr 1.5fr' : '1fr 1fr', gap:16, marginBottom:24 }}>
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase' }}>Current Focus</div>
              <select 
                value={db.currentSubject ?? 'General'}
                onChange={e => patchDash('currentSubject', e.target.value)}
                style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:6, color:'#fff', fontSize:11, padding:'2px 8px' }}>
                <option value="General">General</option>
                <option value="Math">Math</option>
                <option value="Programming">Programming</option>
                <option value="Islamic">Islamic Studies</option>
              </select>
            </div>
            <FocusTimer sessionLength={system?.study?.sessionLength ?? 25} onSessionComplete={onSessionComplete} />
          </div>

          <div className="card" style={{ display:'flex', flexDirection:'column' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', marginBottom:12 }}>Sub-Tasks</div>
            <div style={{ flex:1 }}>
              {(db.secondaryTasks ?? []).map(task => (
                <div className="activity-item" key={task.id} style={{ padding:'8px 12px', marginBottom:6 }}>
                  <button onClick={() => toggleTask(task.id)} style={{ background:'none', border:'none', cursor:'pointer' }}>
                    {task.done ? <CheckCircle2 size={16} color="#34C759" /> : <Circle size={16} color="var(--text-dim)" />}
                  </button>
                  <span style={{ flex:1, fontSize:13, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text-dim)' : '#fff' }}>{task.title}</span>
                  <button onClick={() => deleteTask(task.id)} style={{ background:'none', border:'none', opacity:0.3 }}><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="Add task..." style={{ flex:1, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#fff' }} />
              <button onClick={addTask} className="btn-primary" style={{ padding:'8px' }}><Plus size={16} /></button>
            </div>
          </div>
        </div>

        {/* QUICK LINKS (Hidden in Ghost Mode) */}
        {!ghostMode && (
          <div style={{ display:'flex', gap:12 }}>
            {[
              { label: 'Google', icon: '🔍', url: 'https://google.com' },
              { label: 'Gmail', icon: '📧', url: 'https://mail.google.com' },
              { label: 'GitHub', icon: '💻', url: 'https://github.com' },
              { label: 'ChatGPT', icon: '🤖', url: 'https://chat.openai.com' }
            ].map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noreferrer" 
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:12, color:'#fff', textDecoration:'none', fontSize:12, fontWeight:600 }}>
                {link.icon} {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN (Hidden in Ghost Mode) ── */}
      {!ghostMode && (
        <div style={{ gridColumn: 'span 4' }}>
          <Calendar />
          
          <div className="section-header" style={{ marginTop: 24, marginBottom:10 }}>
            <span className="section-title">Today's Salah</span>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {[
                { key: 'fajr', label: 'Fajr', icon: '🌅', color: '#FFD700' },
                { key: 'dhuhr', label: 'Dhuhr', icon: '☀️', color: '#FFA500' },
                { key: 'asr', label: 'Asr', icon: '🌤️', color: '#FF8C00' },
                { key: 'maghrib', label: 'Maghrib', icon: '🌇', color: '#FF4500' },
                { key: 'isha', label: 'Isha', icon: '🌙', color: '#4D7CFE' }
              ].map(p => {
                const date = new Date().toISOString().split('T')[0];
                const completed = data?.system?.prayers?.[date]?.[p.key];
                return (
                  <div key={p.key} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, marginBottom: 6 }}>{p.icon}</div>
                    <button onClick={() => {
                        const newPr = { ...(data.system.prayers || {}) };
                        if (!newPr[date]) newPr[date] = {};
                        newPr[date][p.key] = !newPr[date][p.key];
                        update({ ...data, system: { ...data.system, prayers: newPr } });
                      }}
                      style={{ width: '100%', aspectRatio: '1', borderRadius: 12, background: completed ? p.color : 'var(--bg-panel-hover)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {completed ? <CheckCircle2 size={16} color="#fff" /> : <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)' }} />}
                    </button>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-dim)', marginTop: 6, textTransform: 'uppercase' }}>{p.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="section-header" style={{ marginTop: 24, marginBottom:10 }}>
            <span className="section-title">Today's Schedule</span>
          </div>
          <div className="schedule-item">
            <div className="schedule-type">Morning Block</div>
            <div className="schedule-title">{db.mainMission || 'Set your mission'}</div>
          </div>
          <div className="schedule-item" style={{ borderLeftColor:'#34C759' }}>
            <div className="schedule-type">Midday</div>
            <div className="schedule-title">Protocol Check-In</div>
          </div>
          <div className="schedule-item" style={{ borderLeftColor:'#FF9500' }}>
            <div className="schedule-type">Evening</div>
            <div className="schedule-title">Nightly Reflection</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
