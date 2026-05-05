import React, { useState } from 'react';
import { BarChart2, Calendar, X, Plus } from 'lucide-react';

const Progress = ({ data, update }) => {
  const metrics = data?.metrics ?? [];
  const reviews = data?.reviews ?? [];
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ well:'', failed:'', improve:'', score:'' });

  const submitReview = () => {
    if (!form.score) return;
    const newReview = { ...form, date: new Date().toISOString(), score: parseInt(form.score) };
    update({ ...data, reviews: [newReview, ...reviews] });
    setForm({ well:'', failed:'', improve:'', score:'' });
    setShowForm(false);
  };

  const deleteReview = (i) => update({ ...data, reviews: reviews.filter((_, idx) => idx !== i) });

  // Build last 14 days of bar chart data from metrics
  const barData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dayStr = d.toDateString();
    const metric = metrics.find(m => new Date(m.date).toDateString() === dayStr);
    return { label: d.getDate(), hours: metric?.studyHours ?? 0, tasks: metric?.tasksCompleted ?? 0 };
  });
  const maxHours = Math.max(...barData.map(b => b.hours), 1);

  const totalHours   = metrics.reduce((s, m) => s + (m.studyHours ?? 0), 0);
  const totalTasks   = metrics.reduce((s, m) => s + (m.tasksCompleted ?? 0), 0);
  const avgScore     = reviews.length ? Math.round(reviews.reduce((s, r) => s + r.score, 0) / reviews.length) : 0;
  const currentStreak = metrics.length > 0 ? metrics[metrics.length - 1].streak ?? 0 : 0;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">System Analytics</div>
          <div className="page-subtitle">Performance data and review logs.</div>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={14} /> Weekly Review</button>
      </div>

      {/* STAT CARDS */}
      <div className="analytics-grid">
        <div className="stat-card">
          <div className="stat-label">Total Study Hours</div>
          <div className="stat-value" style={{ color:'#4D7CFE' }}>{totalHours.toFixed(1)}</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tasks Completed</div>
          <div className="stat-value" style={{ color:'#34C759' }}>{totalTasks}</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Best Streak</div>
          <div className="stat-value" style={{ color:'#FF9500' }}>{currentStreak} 🔥</div>
          <div className="stat-sub">Consecutive days</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Review Score</div>
          <div className="stat-value">{avgScore > 0 ? `${avgScore}/10` : '—'}</div>
          <div className="stat-sub">{reviews.length} reviews logged</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>
        {/* BAR CHART */}
        <div className="card">
          <div className="section-header" style={{ marginBottom:20 }}>
            <span style={{ fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
              <BarChart2 size={16} color="#4D7CFE" /> 14-Day Activity
            </span>
            <div style={{ display:'flex', gap:16 }}>
              <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text-secondary)' }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'#4D7CFE', display:'inline-block' }}/> Hours
              </span>
            </div>
          </div>
          {metrics.length === 0 ? (
            <div style={{ height:180, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-dim)', fontSize:13 }}>
              Data populates daily. Come back tomorrow!
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:180, paddingBottom:24, borderBottom:'1px solid var(--border)', position:'relative' }}>
              {barData.map((b, i) => (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', justifyContent:'flex-end', position:'relative' }}>
                  <div title={`${b.hours}h`}
                    style={{ width:'100%', background: b.hours > 0 ? '#4D7CFE' : 'rgba(255,255,255,0.04)', borderRadius:'4px 4px 0 0', height:`${(b.hours / maxHours) * 140}px`, minHeight:4, transition:'height 0.5s ease', cursor:'default' }} />
                  <span style={{ position:'absolute', bottom:0, fontSize:9, color:'var(--text-dim)', fontWeight:600 }}>{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* REVIEW LOG */}
        <div className="card">
          <div className="section-header" style={{ marginBottom:14 }}>
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
              <Calendar size={16} color="#4D7CFE" /> Weekly Reviews
            </span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:250, overflowY:'auto' }}>
            {reviews.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)' }}>No reviews yet. Add your first weekly review!</div>}
            {reviews.map((r, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:'var(--bg-panel-hover)', borderRadius:10 }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:700 }}>{new Date(r.date).toLocaleDateString()}</div>
                  <div style={{ fontSize:10, color:'var(--text-secondary)', marginTop:2, maxWidth:180 }} title={r.well}>{r.well?.slice(0,40) || 'No notes'}{r.well?.length > 40 ? '...' : ''}</div>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <div style={{ fontSize:18, fontWeight:900, color: r.score >= 7 ? '#34C759' : r.score >= 4 ? '#FF9500' : '#FF3B30' }}>{r.score}/10</div>
                  <button onClick={() => deleteReview(i)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}><X size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
          <div className="card" style={{ width:'100%', maxWidth:540, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontSize:16, fontWeight:800 }}>Weekly Review</div>
              <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>What went well?</label>
                <textarea value={form.well} onChange={e => setForm(f => ({ ...f, well: e.target.value }))} rows={3}
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px', fontSize:13, color:'#fff', resize:'none' }} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>What failed?</label>
                <textarea value={form.failed} onChange={e => setForm(f => ({ ...f, failed: e.target.value }))} rows={3}
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px', fontSize:13, color:'#fff', resize:'none' }} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>Core improvement?</label>
                <textarea value={form.improve} onChange={e => setForm(f => ({ ...f, improve: e.target.value }))} rows={2}
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px', fontSize:13, color:'#fff', resize:'none' }} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>Score (1-10)</label>
                <input type="number" min={1} max={10} value={form.score} onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
                  style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:16, fontWeight:800, color:'#fff', width:100 }} />
              </div>
              <button className="btn-primary" style={{ justifyContent:'center', padding:'13px' }} onClick={submitReview}>Save Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
