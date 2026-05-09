import React, { useState } from 'react';
import { Plus, Trash2, X, CheckCircle2, Circle, Flame, Award, History } from 'lucide-react';

const COLORS  = ['#4D7CFE','#34C759','#FF9500','#FF3B30','#7B5BFB','#00C9FF','#FF6B6B','#FFE66D'];
const ICONS   = ['💪','📚','🏃','🧘','💧','🎯','🌙','✍️','🥗','📖','🛑','🎵'];
const todayStr = () => new Date().toISOString().slice(0, 10);
const getLast = (n) => Array.from({ length: n }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (n - 1 - i));
  return d.toISOString().slice(0, 10);
});

const getStreak = (history) => {
  if (!history) return 0;
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
  // data here is the entire system data
  const habitsObj = data?.habits || { list: [] };
  const list = habitsObj.list || [];
  
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]       = useState({ name: '', icon: '💪', color: '#4D7CFE' });
  const [mode, setMode]       = useState('habits'); // 'habits' or 'routine'
  
  const last14 = getLast(14);
  const today = todayStr();

  const patchHabits = (newList) => {
    update({ ...data, habits: { ...habitsObj, list: newList } });
  };

  const toggle = (id, date) => {
    const updated = list.map(h => {
      if (h.id !== id) return h;
      const history = { ...(h.history ?? {}) };
      history[date] = !history[date];
      return { ...h, history };
    });
    patchHabits(updated);
  };

  const addHabit = () => {
    if (!form.name.trim()) return;
    patchHabits([...list, { id: Date.now(), ...form, history: {} }]);
    setForm({ name: '', icon: '💪', color: '#4D7CFE' });
    setShowAdd(false);
  };

  const deleteHabit = (id) => patchHabits(list.filter(h => h.id !== id));

  const activeRoutineMode = data?.settings?.activeRoutine || 'school';
  const routine = activeRoutineMode === 'school' ? (data?.schoolRoutine || []) : (data?.holidayRoutine || []);
  const routineHistory = data?.system?.routineHistory || {};

  return (
    <div className="fade-in" style={{ paddingBottom: 100 }}>
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
        <div>
          <h1 className="page-title">{mode === 'habits' ? 'Discipline Tracker' : 'Routine Consistency'}</h1>
          <p className="page-subtitle">{mode === 'habits' ? 'Build streaks, build character.' : 'Your daily rhythm, visualized.'}</p>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ display:'flex', background:'var(--bg-sidebar)', padding:4, borderRadius:12, border:'1px solid var(--border)' }}>
            <button onClick={() => setMode('habits')} style={{ padding:'6px 16px', borderRadius:10, border:'none', background: mode === 'habits' ? 'var(--accent)' : 'transparent', color:'#fff', fontSize:11, fontWeight:800, cursor:'pointer' }}>Habits</button>
            <button onClick={() => setMode('routine')} style={{ padding:'6px 16px', borderRadius:10, border:'none', background: mode === 'routine' ? 'var(--accent)' : 'transparent', color:'#fff', fontSize:11, fontWeight:800, cursor:'pointer' }}>Routine</button>
          </div>
          {mode === 'habits' && <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Habit</button>}
        </div>
      </div>

      {/* COLUMN HEADERS */}
      <div style={{ display:'grid', gridTemplateColumns:'240px 1fr 100px', gap:12, marginBottom:12, padding:'0 16px' }}>
        <div style={{ fontSize:10, fontWeight:900, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
          {mode === 'habits' ? 'Habit Definition' : 'Operation Name'}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:`repeat(14, 1fr)`, gap:4 }}>
          {last14.map(d => {
            const day = new Date(d + 'T00:00:00');
            return (
              <div key={d} style={{ textAlign:'center', fontSize:9, fontWeight:900, color: d === today ? 'var(--accent)' : 'var(--text-dim)' }}>
                {['S','M','T','W','T','F','S'][day.getDay()]}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize:10, fontWeight:900, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', textAlign:'center' }}>Streak</div>
      </div>

      {/* ROWS */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {mode === 'habits' ? (
          list.length === 0 ? (
            <div style={{ background:'var(--bg-sidebar)', border:'1px dashed var(--border)', borderRadius:20, padding:'80px 40px', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:20 }}>💎</div>
              <div style={{ fontSize:16, fontWeight:800, marginBottom:8 }}>No habits established</div>
              <p style={{ fontSize:12, color:'var(--text-dim)', marginBottom:24 }}>Start your first streak to begin building discipline.</p>
              <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add First Habit</button>
            </div>
          ) : (
            list.map(habit => {
              const streak = getStreak(habit.history ?? {});
              return (
                <div key={habit.id} className="card" style={{ display:'grid', gridTemplateColumns:'240px 1fr 100px', gap:12, alignItems:'center', padding:'16px 20px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:38, height:38, borderRadius:12, background:`${habit.color}15`, color:habit.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{habit.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:800 }}>{habit.name}</div>
                      <div style={{ fontSize:10, color:'var(--text-dim)', fontWeight:700 }}>{streak > 0 ? `${streak} DAY STREAK` : 'NO STREAK'}</div>
                    </div>
                    <button onClick={() => deleteHabit(habit.id)} style={{ background:'none', border:'none', color:'var(--text-dim)', opacity:0.3, cursor:'pointer' }}><Trash2 size={14} /></button>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:`repeat(14, 1fr)`, gap:4 }}>
                    {last14.map(d => (
                      <button key={d} onClick={() => toggle(habit.id, d)} 
                        style={{ 
                          aspectRatio:'1', 
                          borderRadius:8, 
                          border: d === today ? `2px solid ${habit.color}` : '1px solid var(--border)', 
                          background: habit.history?.[d] ? habit.color : 'var(--bg-panel)', 
                          opacity: habit.history?.[d] ? 1 : 0.3,
                          cursor:'pointer',
                          transition:'0.2s'
                        }} />
                    ))}
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:24, fontWeight:900, color: streak > 5 ? '#FF9500' : streak > 0 ? 'var(--accent)' : 'var(--text-dim)' }}>{streak}</div>
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
              <div key={item.id} className="card" style={{ display:'grid', gridTemplateColumns:'240px 1fr 100px', gap:12, alignItems:'center', padding:'16px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:12, background:'rgba(77,124,254,0.1)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}><History size={18} /></div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800 }}>{item.task}</div>
                    <div style={{ fontSize:10, color:'var(--text-dim)', fontWeight:700 }}>{item.time}</div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:`repeat(14, 1fr)`, gap:4 }}>
                  {last14.map(d => {
                    const done = routineHistory[d]?.[item.id];
                    return (
                      <div key={d} style={{ aspectRatio:'1', borderRadius:8, border: d === today ? '2px solid var(--accent)' : '1px solid var(--border)', background: done ? 'var(--accent)' : 'var(--bg-panel)', opacity: done ? 1 : 0.1 }} />
                    );
                  })}
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:24, fontWeight:900, color: streak > 0 ? 'var(--accent)' : 'var(--text-dim)' }}>{streak}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD HABIT MODAL */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(16px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
          <div className="card" style={{ width:'100%', maxWidth:440, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 style={{ fontSize:18, fontWeight:900 }}>Create New Habit</h2>
              <button onClick={() => setShowAdd(false)} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="What is your new discipline?"
                style={{ background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px', fontSize:15, color:'#fff' }} />

              <div>
                <label style={{ fontSize:10, fontWeight:900, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:10 }}>SELECT ICON</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8 }}>
                  {ICONS.map(ic => (
                    <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                      style={{ height:44, borderRadius:12, border: form.icon === ic ? '2px solid var(--accent)' : '1px solid var(--border)', background: form.icon === ic ? 'rgba(77,124,254,0.1)' : 'var(--bg-panel)', fontSize:20, cursor:'pointer' }}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize:10, fontWeight:900, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:10 }}>SELECT THEME</label>
                <div style={{ display:'flex', gap:10 }}>
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                      style={{ width:32, height:32, borderRadius:'50%', background:c, border: form.color === c ? '3px solid #fff' : '2px solid transparent', cursor:'pointer', outline: form.color === c ? `2px solid ${c}` : 'none', outlineOffset:2 }} />
                  ))}
                </div>
              </div>

              <button className="btn-primary" style={{ justifyContent:'center', padding:'16px', fontSize:14, fontWeight:800 }} onClick={addHabit}>
                Establish Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;
