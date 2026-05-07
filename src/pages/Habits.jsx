import React, { useState } from 'react';
import { Plus, Trash2, X, CheckCircle2, Circle, Flame, Award } from 'lucide-react';

const COLORS  = ['#4D7CFE','#34C759','#FF9500','#FF3B30','#7B5BFB','#00C9FF','#FF6B6B','#FFE66D'];
const ICONS   = ['💪','📚','🏃','🧘','💧','🎯','🌙','✍️','🥗','📖','🛑','🎵'];
const today   = () => new Date().toISOString().slice(0, 10);
const getLast = (n) => Array.from({ length: n }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (n - 1 - i));
  return d.toISOString().slice(0, 10);
});

const getStreak = (history) => {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (history[key]) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
};

const Habits = ({ data, update }) => {
  const list = data?.list ?? [];
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]       = useState({ name: '', icon: '💪', color: '#4D7CFE' });
  const last14 = getLast(14);

  const toggle = (id, date) => {
    const updated = list.map(h => {
      if (h.id !== id) return h;
      const history = { ...(h.history ?? {}) };
      history[date] = !history[date];
      return { ...h, history };
    });
    update({ ...data, list: updated });
  };

  const addHabit = () => {
    if (!form.name.trim()) return;
    update({ ...data, list: [...list, { id: crypto.randomUUID(), ...form, history: {} }] });
    setForm({ name: '', icon: '💪', color: '#4D7CFE' });
    setShowAdd(false);
  };

  const deleteHabit = (id) => update({ ...data, list: list.filter(h => h.id !== id) });

  const todayStr = today();
  const completedToday = list.filter(h => h.history?.[todayStr]).length;
  const totalToday     = list.length;

  const [mode, setMode] = useState('habits'); // 'habits' or 'routine'
  const routine = data?.routine || [];
  const routineHistory = data?.system?.routineHistory || {};

  return (
    <div className="fade-in">
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
        <div>
          <div className="page-title">{mode === 'habits' ? 'Habit Tracker' : 'Routine Consistency'}</div>
          <div className="page-subtitle">{mode === 'habits' ? 'Build streaks, build character.' : 'Your daily rhythm, visualized.'}</div>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ display:'flex', background:'var(--bg-panel)', padding:4, borderRadius:12, border:'1px solid var(--border)' }}>
            <button onClick={() => setMode('habits')} style={{ padding:'6px 12px', borderRadius:8, border:'none', background: mode === 'habits' ? 'var(--accent)' : 'transparent', color: mode === 'habits' ? '#fff' : 'var(--text-dim)', fontSize:11, fontWeight:700, cursor:'pointer' }}>Habits</button>
            <button onClick={() => setMode('routine')} style={{ padding:'6px 12px', borderRadius:8, border:'none', background: mode === 'routine' ? 'var(--accent)' : 'transparent', color: mode === 'routine' ? '#fff' : 'var(--text-dim)', fontSize:11, fontWeight:700, cursor:'pointer' }}>Routine</button>
          </div>
          {mode === 'habits' && <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Habit</button>}
        </div>
      </div>

      {/* COLUMN HEADERS */}
      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr 80px', gap:8, marginBottom:8, paddingLeft:8 }}>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{mode === 'habits' ? 'Habit' : 'Activity'}</div>
        <div style={{ display:'grid', gridTemplateColumns:`repeat(14, 1fr)`, gap:4 }}>
          {last14.map(d => {
            const day = new Date(d + 'T00:00:00');
            return (
              <div key={d} style={{ textAlign:'center', fontSize:9, fontWeight:700, color: d === todayStr ? '#4D7CFE' : 'var(--text-dim)' }}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'][day.getDay()]}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', textAlign:'center' }}>Streak</div>
      </div>

      {/* ROWS */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {mode === 'habits' ? (
          list.length === 0 ? (
            <div style={{ background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:16, padding:'60px 40px', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🏆</div>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>No habits yet</div>
              <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add First Habit</button>
            </div>
          ) : (
            list.map(habit => {
              const streak = getStreak(habit.history ?? {});
              return (
                <div key={habit.id} style={{ display:'grid', gridTemplateColumns:'200px 1fr 80px', gap:8, alignItems:'center', background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:14, padding:'14px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:`${habit.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{habit.icon}</div>
                    <div style={{ flex:1, fontSize:13, fontWeight:700 }}>{habit.name}</div>
                    <button onClick={() => deleteHabit(habit.id)} style={{ background:'none', border:'none', color:'var(--text-dim)', opacity:0.4 }}><Trash2 size={13} /></button>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:`repeat(14, 1fr)`, gap:4 }}>
                    {last14.map(d => (
                      <button key={d} onClick={() => toggle(habit.id, d)} style={{ aspectRatio:'1', borderRadius:6, border: d === todayStr ? `2px solid ${habit.color}` : '1px solid var(--border)', background: habit.history?.[d] ? habit.color : 'var(--bg-panel-hover)', opacity: habit.history?.[d] ? 1 : 0.5 }} />
                    ))}
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:20, fontWeight:900, color: streak > 0 ? '#FF9500' : 'var(--text-dim)' }}>{streak}</div>
                  </div>
                </div>
              );
            })
          )
        ) : (
          routine.map(item => {
            const history = last14.reduce((acc, date) => {
              if (routineHistory[date]?.[item.id]) acc[date] = true;
              return acc;
            }, {});
            const streak = getStreak(history);
            return (
              <div key={item.id} style={{ display:'grid', gridTemplateColumns:'200px 1fr 80px', gap:8, alignItems:'center', background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:14, padding:'14px 16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:'rgba(77,124,254,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{item.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700 }}>{item.activity}</div>
                    <div style={{ fontSize:10, color:'var(--text-dim)' }}>{item.time}</div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:`repeat(14, 1fr)`, gap:4 }}>
                  {last14.map(d => {
                    const done = routineHistory[d]?.[item.id];
                    return (
                      <div key={d} style={{ aspectRatio:'1', borderRadius:6, border: d === todayStr ? '2px solid var(--accent)' : '1px solid var(--border)', background: done ? 'var(--accent)' : 'var(--bg-panel-hover)', opacity: done ? 1 : 0.2 }} />
                    );
                  })}
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:900, color: streak > 0 ? '#FF9500' : 'var(--text-dim)' }}>{streak}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD HABIT MODAL */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
          <div className="card" style={{ width:'100%', maxWidth:440, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontSize:16, fontWeight:800 }}>New Habit</div>
              <button onClick={() => setShowAdd(false)} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Habit name (e.g. Read 30 mins)"
                style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:14, color:'#fff' }} />

              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Icon</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {ICONS.map(ic => (
                    <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                      style={{ width:38, height:38, borderRadius:8, border: form.icon === ic ? '2px solid #4D7CFE' : '1px solid var(--border)', background: form.icon === ic ? 'rgba(77,124,254,0.1)' : 'var(--bg-panel-hover)', fontSize:20, cursor:'pointer' }}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Color</div>
                <div style={{ display:'flex', gap:8 }}>
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                      style={{ width:28, height:28, borderRadius:'50%', background:c, border: form.color === c ? '3px solid #fff' : '2px solid transparent', cursor:'pointer', outline: form.color === c ? `2px solid ${c}` : 'none', outlineOffset:2 }} />
                  ))}
                </div>
              </div>

              <button className="btn-primary" style={{ justifyContent:'center', padding:'13px' }} onClick={addHabit}>
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;
