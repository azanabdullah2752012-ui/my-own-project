import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2, Circle, Plus, Trash2,
  FileText, BookOpen, Activity, Zap, Clipboard,
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw,
  Smile, Meh, Frown, Sun
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
  const pct = ((sessionLength * 60 - seconds) / (sessionLength * 60)) * 100;

  return (
    <div className="schedule-item" style={{ borderLeftColor: done ? '#34C759' : running ? '#FF9500' : '#4D7CFE', marginBottom: 12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div className="schedule-type">{done ? 'Complete ✓' : running ? 'In Session' : 'Focus Timer'}</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: done ? '#34C759' : '#fff', letterSpacing: '0.05em', marginTop: 2 }}>
            {mm}:{ss}
          </div>
          <div className="progress-bar-track" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill" style={{ width:`${pct}%`, background: done ? '#34C759' : '#FF9500' }} />
          </div>
        </div>
        <div style={{ display:'flex', gap: 8 }}>
          <button onClick={() => setRunning(r => !r)} className="btn-primary" style={{ padding:'9px 16px' }}>
            {running ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={reset} style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius: 8, padding:'9px 12px', color:'var(--text-secondary)', cursor:'pointer' }}>
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────
   DASHBOARD
─────────────────────────────────────────────── */
const Dashboard = ({ data, update }) => {
  const db       = data?.dashboard   ?? {};
  const system   = data?.system      ?? {};
  const projects = data?.projects?.list ?? [];
  const [newTask, setNewTask] = useState('');

  const patchDash = (field, val) =>
    update({ ...data, dashboard: { ...db, [field]: val } });

  const addTask = () => {
    const t = newTask.trim();
    if (!t || db.secondaryTasks?.length >= 5) return;
    patchDash('secondaryTasks', [...(db.secondaryTasks ?? []), { id: crypto.randomUUID(), title: t, done: false }]);
    setNewTask('');
  };

  const toggleTask = (id) =>
    patchDash('secondaryTasks', db.secondaryTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const deleteTask = (id) =>
    patchDash('secondaryTasks', db.secondaryTasks.filter(t => t.id !== id));

  const onSessionComplete = () => {
    patchDash('focusSessions', (db.focusSessions ?? 0) + 1);
  };

  const moodIcons = [
    { label: 'Focused 🔥', icon: <Smile size={14} />, color: '#34C759' },
    { label: 'Normal 😐',  icon: <Meh   size={14} />, color: '#4D7CFE' },
    { label: 'Tired 😔',   icon: <Frown size={14} />, color: '#FF9500' },
  ];

  return (
    <div className="dash-grid">
      {/* ── LEFT COLUMN ── */}
      <div>
        {/* HERO — editable mission */}
        <div className="hero-banner">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(77,124,254,0.8)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
              Today's Main Mission
            </div>
            <textarea
              value={db.mainMission ?? ''}
              onChange={e => patchDash('mainMission', e.target.value)}
              maxLength={120}
              placeholder="Write your #1 mission for today..."
              style={{ background:'none', border:'none', fontSize: 24, fontWeight: 800, color:'#fff', width:'100%', resize:'none', lineHeight:1.3, height: 70, marginBottom: 16 }}
            />
            <div style={{ display:'flex', gap: 10, alignItems:'center', flexWrap:'wrap' }}>
              {moodIcons.map(m => (
                <button key={m.label} onClick={() => patchDash('mood', m.label)}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:20, border:`1px solid ${db.mood === m.label ? m.color : 'var(--border)'}`, background: db.mood === m.label ? `${m.color}22` : 'transparent', color: db.mood === m.label ? m.color : 'var(--text-secondary)', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}>
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

        {/* STUDY HOURS TRACKER */}
        <div className="card" style={{ marginBottom: 16, display:'flex', alignItems:'center', gap: 20 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Study Hours Today</div>
            <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
              <button onClick={() => patchDash('studyHours', Math.max(0, (db.studyHours ?? 0) - 0.5))} style={{ width:30, height:30, borderRadius:8, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
              <span style={{ fontSize:32, fontWeight:900 }}>{(db.studyHours ?? 0).toFixed(1)}</span>
              <span style={{ fontSize:14, color:'var(--text-secondary)', fontWeight:600 }}>hrs</span>
              <button onClick={() => patchDash('studyHours', (db.studyHours ?? 0) + 0.5)} style={{ width:30, height:30, borderRadius:8, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
            </div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Daily Streak</div>
            <div style={{ fontSize:32, fontWeight:900, color:'#FF9500' }}>
              {db.streak ?? 0} <span style={{ fontSize:20 }}>🔥</span>
            </div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Daily Note</div>
            <textarea value={db.dailyNote ?? ''} onChange={e => patchDash('dailyNote', e.target.value)}
              placeholder="Quick thought..." rows={2}
              style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 10px', fontSize:12, color:'#fff', width:'100%', resize:'none' }} />
          </div>
        </div>

        {/* FOCUS TIMER */}
        <FocusTimer sessionLength={system?.study?.sessionLength ?? 25} onSessionComplete={onSessionComplete} />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
          {/* TASK LIST */}
          <div>
            <div className="section-header">
              <span className="section-title">Sub-Tasks <span style={{ color:'var(--text-dim)', fontSize:12 }}>({db.secondaryTasks?.length ?? 0}/5)</span></span>
            </div>
            {(db.secondaryTasks ?? []).map(task => (
              <div className="activity-item" key={task.id} style={{ cursor:'pointer' }}>
                <button style={{ background:'none', border:'none', display:'flex', cursor:'pointer' }} onClick={() => toggleTask(task.id)}>
                  {task.done ? <CheckCircle2 size={18} color="#34C759" /> : <Circle size={18} color="var(--text-dim)" />}
                </button>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text-dim)' : '#fff' }}>{task.title}</div>
                </div>
                <button onClick={() => deleteTask(task.id)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', opacity:0.5, padding:'2px' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {(db.secondaryTasks?.length ?? 0) < 5 && (
              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()}
                  placeholder="Add task... (Enter)" style={{ flex:1, background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#fff' }} />
                <button onClick={addTask} className="btn-primary" style={{ padding:'8px 12px' }}><Plus size={14} /></button>
              </div>
            )}
          </div>

          {/* ACTIVE MISSIONS */}
          <div>
            <div className="section-header">
              <span className="section-title">Active Missions</span>
            </div>
            {projects.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)', padding:'12px 0' }}>No missions yet — create one in Missions tab.</div>}
            {projects.slice(0, 3).map(p => (
              <div className="mission-card" key={p.id}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>{p.name}</div>
                  <span className={`mission-badge ${p.status === 'building' ? 'badge-blue' : p.status === 'finished' ? 'badge-green' : 'badge-orange'}`}>{p.status}</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width:`${p.progress}%` }} />
                </div>
                <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:6 }}>{p.progress}% · {p.deadline || 'No deadline'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div>
        <Calendar />
        <div className="section-header" style={{ marginBottom:10 }}>
          <span className="section-title">Today's Schedule</span>
        </div>
        <div className="schedule-item">
          <div className="schedule-type">Deep Work</div>
          <div className="schedule-title">{db.mainMission || 'Set your main mission ↑'}</div>
          <div className="schedule-time">Morning Block</div>
        </div>
        <div className="schedule-item" style={{ borderLeftColor:'#34C759' }}>
          <div className="schedule-type">Review</div>
          <div className="schedule-title">Protocol Check-In</div>
          <div className="schedule-time">Midday</div>
        </div>
        <div className="schedule-item" style={{ borderLeftColor:'#FF9500' }}>
          <div className="schedule-type">Planning</div>
          <div className="schedule-title">Tomorrow's Setup</div>
          <div className="schedule-time">Evening</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
