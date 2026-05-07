import React, { useState } from 'react';
import { 
  Target, TrendingUp, Trophy, CheckCircle2, Circle, 
  ChevronRight, Plus, Trash2, X, Star, Flag, 
  Compass, Zap, Briefcase, Heart, Sparkles, Activity
} from 'lucide-react';

const Goals = ({ data, update, setView }) => {
  const obj = data?.objectives || { sprints: [], monthly: [], ultimate: [], roadmap: [] };

  const patch = (newObj) => update({ ...data, objectives: newObj });

  // ── Tactical (7 Days) ──
  const [showSprint, setShowSprint] = useState(false);
  const [sprintForm, setSprintForm] = useState({ title:'' });

  const addSprint = () => {
    if (!sprintForm.title.trim()) return;
    patch({ ...obj, sprints: [...(obj.sprints || []), { id: Date.now(), title: sprintForm.title, done: false }] });
    setSprintForm({ title:'' });
    setShowSprint(false);
  };
  const toggleSprint = (id) => patch({ ...obj, sprints: (obj.sprints || []).map(g => g.id === id ? { ...g, done: !g.done } : g) });
  const deleteSprint = (id) => patch({ ...obj, sprints: (obj.sprints || []).filter(g => g.id !== id) });

  // ── Strategic (Monthly) ──
  const [showMonthly, setShowMonthly] = useState(false);
  const [monthlyForm, setMonthlyForm] = useState({ title:'' });

  const addMonthly = () => {
    if (!monthlyForm.title.trim()) return;
    patch({ ...obj, monthly: [...(obj.monthly || []), { id: Date.now(), title: monthlyForm.title, done: false }] });
    setMonthlyForm({ title:'' });
    setShowMonthly(false);
  };
  const toggleMonthly = (id) => patch({ ...obj, monthly: (obj.monthly || []).map(g => g.id === id ? { ...g, done: !g.done } : g) });
  const deleteMonthly = (id) => patch({ ...obj, monthly: (obj.monthly || []).filter(g => g.id !== id) });

  // ── Ultimate Goal ──
  const [showUltimate, setShowUltimate] = useState(false);
  const [ultimateForm, setUltimateForm] = useState({ title:'' });

  const addUltimate = () => {
    if (!ultimateForm.title.trim()) return;
    patch({ ...obj, ultimate: [...(obj.ultimate || []), { id: Date.now(), title: ultimateForm.title, done: false }] });
    setUltimateForm({ title:'' });
    setShowUltimate(false);
  };
  const toggleUltimate = (id) => patch({ ...obj, ultimate: (obj.ultimate || []).map(g => g.id === id ? { ...g, done: !g.done } : g) });
  const deleteUltimate = (id) => patch({ ...obj, ultimate: (obj.ultimate || []).filter(g => g.id !== id) });

  const tacticalAccuracy = Math.round(((obj.sprints || []).filter(g => g.done).length / (obj.sprints?.length || 1)) * 100);
  const monthlyProgress = Math.round(((obj.monthly || []).filter(g => g.done).length / (obj.monthly?.length || 1)) * 100);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-title">Roadmap & Objectives</div>
          <div className="page-subtitle">Strategic alignment for the Empire.</div>
        </div>
        <div style={{ display:'flex', gap:20 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--text-dim)', textTransform:'uppercase' }}>Tactical Accuracy</div>
            <div style={{ fontSize:24, fontWeight:900, color:'#34C759' }}>{tacticalAccuracy}%</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--text-dim)', textTransform:'uppercase' }}>Monthly Progress</div>
            <div style={{ fontSize:24, fontWeight:900, color:'#4D7CFE' }}>{monthlyProgress}%</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(77,124,254,0.1) 0%, rgba(123,91,251,0.1) 100%)', border: '1px solid rgba(77,124,254,0.2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:50, height:50, borderRadius:14, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 16px rgba(77,124,254,0.3)' }}>
            <Zap size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Current Strategic Spotlight</div>
            <h2 style={{ fontSize:20, fontWeight:900, marginTop:4 }}>{obj.monthly?.find(g => !g.done)?.title || 'Establish New Strategic Base'}</h2>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>Status: Active</div>
          <button className="btn-primary" style={{ marginTop:8, padding:'6px 16px', fontSize:11 }} onClick={() => setView('dashboard')}>View Dashboard</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
        {/* 7-DAY SPRINTS */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:800, fontSize:15 }}>
              <Flag size={18} color="#34C759" /> 7-Day Sprints
            </span>
            <button className="btn-ghost" onClick={() => setShowSprint(true)} style={{ color:'var(--accent)', padding:0 }}><Plus size={18} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {(obj.sprints || []).map(g => (
              <div key={g.id} style={{ display:'flex', gap:12, padding:12, background:'var(--bg-panel-hover)', borderRadius:12, border:'1px solid var(--border)' }}>
                <button onClick={() => toggleSprint(g.id)} style={{ background:'none', border:'none', cursor:'pointer' }}>
                  {g.done ? <CheckCircle2 size={18} color="#34C759" /> : <Circle size={18} color="var(--text-dim)" />}
                </button>
                <div style={{ flex:1, fontSize:13, fontWeight:600, color: g.done ? 'var(--text-dim)' : '#fff', textDecoration: g.done ? 'line-through' : 'none' }}>{g.title}</div>
                <button onClick={() => deleteSprint(g.id)} style={{ background:'none', border:'none', opacity:0.3 }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* MONTHLY FOCUS */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:800, fontSize:15 }}>
              <Target size={18} color="#4D7CFE" /> Monthly Focus
            </span>
            <button className="btn-ghost" onClick={() => setShowMonthly(true)} style={{ color:'var(--accent)', padding:0 }}><Plus size={18} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {(obj.monthly || []).map(g => (
              <div key={g.id} style={{ display:'flex', gap:12, padding:12, background:'var(--bg-panel-hover)', borderRadius:12, border:'1px solid var(--border)' }}>
                <button onClick={() => toggleMonthly(g.id)} style={{ background:'none', border:'none', cursor:'pointer' }}>
                  {g.done ? <CheckCircle2 size={18} color="#34C759" /> : <Circle size={18} color="var(--text-dim)" />}
                </button>
                <div style={{ flex:1, fontSize:13, fontWeight:600, color: g.done ? 'var(--text-dim)' : '#fff', textDecoration: g.done ? 'line-through' : 'none' }}>{g.title}</div>
                <button onClick={() => deleteMonthly(g.id)} style={{ background:'none', border:'none', opacity:0.3 }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* ULTIMATE GOAL */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:800, fontSize:15 }}>
              <Trophy size={18} color="#FF9500" /> Ultimate Goal
            </span>
            <button className="btn-ghost" onClick={() => setShowUltimate(true)} style={{ color:'var(--accent)', padding:0 }}><Plus size={18} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {(obj.ultimate || []).map(g => (
              <div key={g.id} style={{ display:'flex', gap:12, padding:12, background:'rgba(255,149,0,0.05)', borderRadius:12, border:'1px solid rgba(255,149,0,0.2)' }}>
                <button onClick={() => toggleUltimate(g.id)} style={{ background:'none', border:'none', cursor:'pointer' }}>
                  {g.done ? <CheckCircle2 size={18} color="#FF9500" /> : <Circle size={18} color="rgba(255,149,0,0.3)" />}
                </button>
                <div style={{ flex:1, fontSize:13, fontWeight:800, color: g.done ? 'var(--text-dim)' : '#FF9500' }}>{g.title}</div>
                <button onClick={() => deleteUltimate(g.id)} style={{ background:'none', border:'none', opacity:0.3 }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showSprint && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="card" style={{ width:400 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <div style={{ fontWeight:900 }}>New 7-Day Sprint</div>
              <button onClick={() => setShowSprint(false)} style={{ background:'none', border:'none', color:'#fff' }}><X size={20} /></button>
            </div>
            <input value={sprintForm.title} onChange={e => setSprintForm({ title: e.target.value })} autoFocus
              placeholder="e.g. Master Differentiation" style={{ width:'100%', padding:12, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, color:'#fff', marginBottom:20 }} />
            <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={addSprint}>Start Sprint</button>
          </div>
        </div>
      )}

      {showMonthly && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="card" style={{ width:400 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <div style={{ fontWeight:900 }}>New Monthly Focus</div>
              <button onClick={() => setShowMonthly(false)} style={{ background:'none', border:'none', color:'#fff' }}><X size={20} /></button>
            </div>
            <input value={monthlyForm.title} onChange={e => setMonthlyForm({ title: e.target.value })} autoFocus
              placeholder="e.g. Build Empire OS v1" style={{ width:'100%', padding:12, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, color:'#fff', marginBottom:20 }} />
            <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={addMonthly}>Commit Focus</button>
          </div>
        </div>
      )}

      {showUltimate && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="card" style={{ width:400 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <div style={{ fontWeight:900 }}>Set Ultimate Goal</div>
              <button onClick={() => setShowUltimate(false)} style={{ background:'none', border:'none', color:'#fff' }}><X size={20} /></button>
            </div>
            <input value={ultimateForm.title} onChange={e => setUltimateForm({ title: e.target.value })} autoFocus
              placeholder="e.g. High Performance Self" style={{ width:'100%', padding:12, background:'rgba(255,149,0,0.1)', border:'1px solid rgba(255,149,0,0.3)', borderRadius:10, color:'#FF9500', marginBottom:20 }} />
            <button className="btn-primary" style={{ width:'100%', justifyContent:'center', background:'#FF9500' }} onClick={addUltimate}>Confirm Vision</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
