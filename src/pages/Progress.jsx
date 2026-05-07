import React, { useState } from 'react';
import { BarChart2, Calendar, X, Plus, Zap, Target, Flame, CheckCircle2, TrendingUp } from 'lucide-react';

const Progress = ({ data, update }) => {
  const metrics = data?.progress?.metrics ?? [];
  const reviews = data?.progress?.reviews ?? [];
  const habits  = data?.habits?.list ?? [];
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ well:'', failed:'', improve:'', score:'' });

  const submitReview = () => {
    if (!form.score) return;
    const newReview = { ...form, date: new Date().toISOString(), score: parseInt(form.score) };
    update({ ...data, progress: { ...data.progress, reviews: [newReview, ...reviews] } });
    setForm({ well:'', failed:'', improve:'', score:'' });
    setShowForm(false);
  };

  const deleteReview = (i) => update({ ...data, progress: { ...data.progress, reviews: reviews.filter((_, idx) => idx !== i) } });

  // 14-DAY ANALYTICS
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });

  const barData = last14.map(dateStr => {
    const metric = metrics.find(m => m.date.startsWith(dateStr));
    return { 
      label: dateStr.slice(8), 
      full: dateStr,
      hours: metric?.studyHours ?? 0, 
      tasks: metric?.tasksCompleted ?? 0 
    };
  });

  const maxHours = Math.max(...barData.map(b => b.hours), 1);

  // CALCULATE DISCIPLINE SCORE (Average of last 7 days)
  const last7 = last14.slice(7);
  const getDailyScore = (date) => {
    const routineHistory = data?.system?.routineHistory?.[date] || {};
    const routineTotal = (data?.settings?.activeRoutine === 'school' ? data?.schoolRoutine : data?.holidayRoutine)?.length || 1;
    const routineDone = Object.values(routineHistory).filter(Boolean).length;
    const routineScore = (routineDone / routineTotal) * 100;

    const habitsDone = habits.filter(h => h.history?.[date]).length;
    const habitsScore = (habitsDone / (habits.length || 1)) * 100;

    const prayers = data?.system?.prayers?.[date] || {};
    const prayerScore = (Object.values(prayers).filter(Boolean).length / 5) * 100;

    return Math.round((routineScore + habitsScore + prayerScore) / 3);
  };

  const avgDiscipline = Math.round(last7.reduce((acc, date) => acc + getDailyScore(date), 0) / 7);

  // HABIT MATRIX (Success rate per habit)
  const habitStats = habits.map(h => {
    const completed = last14.filter(date => h.history?.[date]).length;
    return { ...h, rate: Math.round((completed / 14) * 100) };
  });

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
        <div>
          <div className="page-title">Intelligence Analytics</div>
          <div className="page-subtitle">Historical performance and discipline trends.</div>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={14} /> Weekly Review</button>
      </div>

      {/* TOP LEVEL STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:24 }}>
        <div className="card" style={{ padding:20, borderLeft:'4px solid var(--accent)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-dim)', fontSize:11, fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>
            <Zap size={14} /> Discipline Score
          </div>
          <div style={{ fontSize:32, fontWeight:900 }}>{avgDiscipline}%</div>
          <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:4 }}>Last 7 days avg</div>
        </div>
        <div className="card" style={{ padding:20, borderLeft:'4px solid #34C759' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-dim)', fontSize:11, fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>
            <TrendingUp size={14} /> Study Hours
          </div>
          <div style={{ fontSize:32, fontWeight:900 }}>{barData.reduce((acc, b) => acc + b.hours, 0).toFixed(1)}</div>
          <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:4 }}>Total last 14 days</div>
        </div>
        <div className="card" style={{ padding:20, borderLeft:'4px solid #FF9500' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-dim)', fontSize:11, fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>
            <Flame size={14} /> Best Habit
          </div>
          <div style={{ fontSize:22, fontWeight:900, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {habitStats.length > 0 ? [...habitStats].sort((a,b) => b.rate - a.rate)[0].name : 'N/A'}
          </div>
          <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:4 }}>Highest consistency</div>
        </div>
        <div className="card" style={{ padding:20, borderLeft:'4px solid #AF52DE' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-dim)', fontSize:11, fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>
            <Target size={14} /> Avg Success
          </div>
          <div style={{ fontSize:32, fontWeight:900 }}>{habitStats.length ? Math.round(habitStats.reduce((acc, h) => acc + h.rate, 0) / habitStats.length) : 0}%</div>
          <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:4 }}>Global habit rate</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* CHART: STUDY PERFORMANCE */}
          <div className="card" style={{ padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <span style={{ fontWeight:800, fontSize:15, display:'flex', alignItems:'center', gap:10 }}>
                <BarChart2 size={18} color="var(--accent)" /> 14-Day Study Velocity
              </span>
              <div style={{ display:'flex', gap:16, fontSize:11, color:'var(--text-dim)' }}>
                <span style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ width:8, height:8, borderRadius:2, background:'var(--accent)' }}/> Study Hours</span>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:180, position:'relative', borderBottom:'1px solid var(--border)', paddingBottom:20 }}>
              {barData.map((b, i) => (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', height:'100%', gap:8 }}>
                  <div title={`${b.hours}h`} style={{ width:'100%', background: b.hours > 0 ? 'var(--accent)' : 'rgba(255,255,255,0.03)', borderRadius:'4px 4px 2px 2px', height:`${(b.hours / maxHours) * 100}%`, minHeight:4, transition:'all 0.3s ease' }} />
                  <span style={{ fontSize:9, fontWeight:700, color: b.full === new Date().toISOString().slice(0, 10) ? 'var(--accent)' : 'var(--text-dim)' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* HABIT CONSISTENCY MATRIX */}
          <div className="card" style={{ padding:24 }}>
            <div style={{ fontWeight:800, fontSize:15, display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <CheckCircle2 size={18} color="#34C759" /> Habit Consistency Matrix
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {habitStats.length === 0 ? (
                <div style={{ textAlign:'center', color:'var(--text-dim)', padding:'20px 0', fontSize:13 }}>No habits tracked. Start building streaks!</div>
              ) : (
                habitStats.map(h => (
                  <div key={h.id} style={{ display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ width:120, fontSize:12, fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{h.icon} {h.name}</div>
                    <div style={{ flex:1, height:10, background:'var(--bg-panel-hover)', borderRadius:5, overflow:'hidden', position:'relative' }}>
                      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${h.rate}%`, background:h.color, borderRadius:5 }} />
                    </div>
                    <div style={{ width:40, fontSize:12, fontWeight:800, textAlign:'right' }}>{h.rate}%</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* DISCIPLINE RADAR (Last 7 Days) */}
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontWeight:800, fontSize:14, marginBottom:16 }}>Discipline Breakdown</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {last7.map(date => {
                const score = getDailyScore(date);
                return (
                  <div key={date} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:11, fontWeight:700, color:'var(--text-secondary)' }}>
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday:'short', day:'numeric' })}
                    </span>
                    <div style={{ height:6, width:180, background:'var(--bg-panel-hover)', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${score}%`, background: score >= 80 ? '#34C759' : score >= 50 ? '#FF9500' : '#FF3B30' }} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:800, width:30, textAlign:'right' }}>{score}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* REVIEWS LOG */}
          <div className="card" style={{ padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ fontWeight:800, fontSize:14 }}>Weekly Reviews</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:400, overflowY:'auto' }}>
              {reviews.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)', textAlign:'center', padding:'20px 0' }}>No reviews yet.</div>}
              {reviews.map((r, i) => (
                <div key={i} style={{ padding:14, background:'var(--bg-panel-hover)', borderRadius:12, border:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:11, fontWeight:800 }}>{new Date(r.date).toLocaleDateString()}</span>
                    <span style={{ fontSize:14, fontWeight:900, color: r.score >= 7 ? '#34C759' : r.score >= 4 ? '#FF9500' : '#FF3B30' }}>{r.score}/10</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-secondary)', lineHeight:1.4 }}>{r.well}</div>
                  <button onClick={() => deleteReview(i)} style={{ background:'none', border:'none', color:'var(--text-dim)', fontSize:10, marginTop:10, cursor:'pointer' }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: WEEKLY REVIEW */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
          <div className="card" style={{ width:'100%', maxWidth:540, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontSize:18, fontWeight:900 }}>Submit Intelligence Review</div>
              <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:8 }}>Execution Summary</label>
                <textarea value={form.well} onChange={e => setForm(f => ({ ...f, well: e.target.value }))} rows={4} placeholder="What was achieved this week? What worked?"
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:12, padding:14, fontSize:13, color:'#fff', resize:'none' }} />
              </div>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:8 }}>Bottlenecks & Failures</label>
                <textarea value={form.failed} onChange={e => setForm(f => ({ ...f, failed: e.target.value }))} rows={2} placeholder="What held you back?"
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:12, padding:14, fontSize:13, color:'#fff', resize:'none' }} />
              </div>
              <div style={{ display:'flex', gap:20 }}>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:8 }}>System Score (1-10)</label>
                  <input type="number" min={1} max={10} value={form.score} onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
                    style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:12, padding:14, fontSize:16, fontWeight:900, color:'#fff' }} />
                </div>
                <div style={{ flex:1, display:'flex', alignItems:'flex-end' }}>
                  <button className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:14 }} onClick={submitReview}>Confirm Review</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
