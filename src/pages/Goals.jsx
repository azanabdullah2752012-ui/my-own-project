import React, { useState } from 'react';
import { 
  Target, TrendingUp, Trophy, CheckCircle2, Circle, 
  ChevronRight, Plus, Trash2, X, Star, Flag, 
  Compass, Zap, Briefcase, Heart, Sparkles 
} from 'lucide-react';

/* ── reusable modal ── */
const Modal = ({ title, onClose, children }) => (
  <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
    <div className="card" style={{ width:'100%', maxWidth:480, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:800 }}>{title}</div>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Goals = ({ data, update, setView }) => {
  const goals = data ?? { shortTerm: [], midTerm: [], longTerm: { vision: '', milestones: [], values: [] } };

  const patch = (newGoals) => update(newGoals);

  // ── Short Term ──
  const [showShort, setShowShort] = useState(false);
  const [shortForm, setShortForm] = useState({ title:'', deadline:'', priority: 'Mid' });

  const addShort = () => {
    if (!shortForm.title.trim()) return;
    patch({ ...goals, shortTerm: [...goals.shortTerm, { id: Date.now(), ...shortForm, done: false }] });
    setShortForm({ title:'', deadline:'', priority: 'Mid' });
    setShowShort(false);
  };
  const toggleShort = (id) => patch({ ...goals, shortTerm: goals.shortTerm.map(g => g.id === id ? { ...g, done: !g.done } : g) });
  const deleteShort = (id) => patch({ ...goals, shortTerm: goals.shortTerm.filter(g => g.id !== id) });

  // ── Mid Term ──
  const [showMid, setShowMid] = useState(false);
  const [midForm, setMidForm] = useState({ title:'', progress:0, nextAction:'', category: 'General' });

  const addMid = () => {
    if (!midForm.title.trim()) return;
    patch({ ...goals, midTerm: [...goals.midTerm, { id: Date.now(), ...midForm, progress: Number(midForm.progress) }] });
    setMidForm({ title:'', progress:0, nextAction:'', category: 'General' });
    setShowMid(false);
  };
  const updateMidProgress = (id, progress) =>
    patch({ ...goals, midTerm: goals.midTerm.map(g => g.id === id ? { ...g, progress: Number(progress) } : g) });
  const deleteMid = (id) => patch({ ...goals, midTerm: goals.midTerm.filter(g => g.id !== id) });

  // ── Long Term ──
  const patchLong = (field, val) => patch({ ...goals, longTerm: { ...goals.longTerm, [field]: val } });
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  
  const [newValue, setNewValue] = useState('');

  const addValue = () => {
    if (!newValue.trim()) return;
    patchLong('values', [...(goals.longTerm?.values ?? []), newValue.trim()]);
    setNewValue('');
  };

  const deleteValue = (idx) => {
    const v = [...(goals.longTerm?.values ?? [])];
    v.splice(idx, 1);
    patchLong('values', v);
  };

  const addMilestone = () => {
    if (!milestoneTitle.trim()) return;
    patchLong('milestones', [...(goals.longTerm?.milestones ?? []), { id: Date.now(), title: milestoneTitle, done: false }]);
    setMilestoneTitle('');
    setShowMilestone(false);
  };

  const categories = {
    General: { icon: <Star size={12} />, color: '#4D7CFE' },
    Wealth: { icon: <Briefcase size={12} />, color: '#34C759' },
    Health: { icon: <Zap size={12} />, color: '#FF3B30' },
    Soul: { icon: <Sparkles size={12} />, color: '#FF9500' },
    Career: { icon: <TrendingUp size={12} />, color: '#7B5BFB' }
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-title">Objectives</div>
          <div className="page-subtitle">Strategic alignment and tactical execution.</div>
        </div>
        <div style={{ display:'flex', gap:20 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--text-dim)', textTransform:'uppercase' }}>Tactical Accuracy</div>
            <div style={{ fontSize:24, fontWeight:900, color:'#34C759' }}>
              {Math.round((goals.shortTerm.filter(g => g.done).length / (goals.shortTerm.length || 1)) * 100)}%
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--text-dim)', textTransform:'uppercase' }}>Strategic Momentum</div>
            <div style={{ fontSize:24, fontWeight:900, color:'#4D7CFE' }}>
              {Math.round(goals.midTerm.reduce((acc, g) => acc + g.progress, 0) / (goals.midTerm.length || 1))}%
            </div>
          </div>
        </div>
      </div>

      {/* MONTHLY FOCUS SPOTLIGHT */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(77,124,254,0.1) 0%, rgba(123,91,251,0.1) 100%)', border: '1px solid rgba(77,124,254,0.2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:50, height:50, borderRadius:14, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 16px rgba(77,124,254,0.3)' }}>
            <Zap size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Current Monthly Focus</div>
            <h2 style={{ fontSize:20, fontWeight:900, marginTop:4 }}>{goals.midTerm.find(g => g.progress < 100)?.title || 'Establish New Strategic Base'}</h2>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>Status: Active</div>
          <button className="btn-primary" style={{ marginTop:8, padding:'6px 16px', fontSize:11 }} onClick={() => setView('projects')}>Go to Missions</button>
        </div>
      </div>

      <div className="goals-grid">
        {/* SHORT TERM */}
        <div className="card">
          <div className="section-header">
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
              <Flag size={16} color="#4D7CFE" /> Tactical (7 Days)
            </span>
            <button className="btn-primary" style={{ padding:'6px 12px', fontSize:11 }} onClick={() => setShowShort(true)}>
              <Plus size={12} /> Add
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {goals.shortTerm.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)', padding:'8px 0' }}>No tactical goals.</div>}
            {goals.shortTerm.map(g => (
              <div key={g.id} className="goal-item" style={{ borderLeft: `3px solid ${g.priority === 'High' ? '#FF3B30' : g.priority === 'Mid' ? '#FF9500' : '#34C759'}` }}>
                <button onClick={() => toggleShort(g.id)} style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0 }}>
                  {g.done ? <CheckCircle2 size={16} color="#34C759" /> : <Circle size={16} color="var(--text-dim)" />}
                </button>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, textDecoration: g.done ? 'line-through' : 'none', color: g.done ? 'var(--text-dim)' : '#fff' }}>
                    {g.title}
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:4 }}>
                    {g.deadline && <span style={{ fontSize:10, color:'var(--text-dim)' }}>📅 {g.deadline}</span>}
                    <span style={{ fontSize:10, fontWeight:700, color: g.priority === 'High' ? '#FF3B30' : 'var(--text-dim)' }}>
                      [{g.priority.toUpperCase()}]
                    </span>
                  </div>
                </div>
                <button onClick={() => deleteShort(g.id)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* MID TERM */}
        <div className="card">
          <div className="section-header">
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
              <Compass size={16} color="#34C759" /> Strategic (1–12 Mo)
            </span>
            <button className="btn-primary" style={{ padding:'6px 12px', fontSize:11 }} onClick={() => setShowMid(true)}>
              <Plus size={12} /> Add
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {goals.midTerm.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)', padding:'8px 0' }}>No strategic goals.</div>}
            {goals.midTerm.map(g => (
              <div key={g.id} style={{ background:'var(--bg-panel-hover)', padding:'14px', borderRadius:12, border:'1px solid var(--border)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                      {categories[g.category]?.icon} {g.title}
                    </div>
                    <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', marginTop:2, textTransform:'uppercase' }}>Category: {g.category}</div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:11, fontWeight:800, color:categories[g.category]?.color }}>{g.progress}%</span>
                    <button onClick={() => deleteMid(g.id)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}><Trash2 size={12} /></button>
                  </div>
                </div>
                <input type="range" min={0} max={100} value={g.progress}
                  onChange={e => updateMidProgress(g.id, e.target.value)}
                  style={{ width:'100%', accentColor: categories[g.category]?.color || '#4D7CFE' }} />
                {g.nextAction && (
                  <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:8, display:'flex', alignItems:'center', gap:6, padding:'6px 8px', background:'rgba(255,255,255,0.03)', borderRadius:6 }}>
                    <ChevronRight size={12} color={categories[g.category]?.color} /> {g.nextAction}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* LONG TERM & VALUES */}
        <div className="card">
          <div className="section-header">
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
              <Trophy size={16} color="#FF9500" /> Ultimate Vision
            </span>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', display:'block', marginBottom:8 }}>Core Values</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
              {(goals.longTerm?.values ?? []).map((v, i) => (
                <span key={i} style={{ fontSize:11, fontWeight:600, padding:'4px 10px', background:'rgba(77,124,254,0.1)', color:'#4D7CFE', borderRadius:20, display:'flex', alignItems:'center', gap:6 }}>
                  {v} <X size={10} style={{ cursor:'pointer' }} onClick={() => deleteValue(i)} />
                </span>
              ))}
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <input value={newValue} onChange={e => setNewValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && addValue()}
                placeholder="Add value (e.g. Discipline)" style={{ flex:1, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 10px', fontSize:11, color:'#fff' }} />
              <button onClick={addValue} style={{ background:'var(--accent)', border:'none', color:'#fff', padding:'0 8px', borderRadius:8 }}><Plus size={14} /></button>
            </div>
          </div>
          
          <label style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', display:'block', marginBottom:8 }}>Vision Statement</label>
          <textarea
            value={goals.longTerm?.vision ?? ''}
            onChange={e => patchLong('vision', e.target.value)}
            placeholder="Describe your ultimate life mission..."
            style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px', fontSize:13, color:'rgba(255,255,255,0.8)', marginBottom:16, resize:'none', minHeight:100, lineHeight:1.5 }}
          />

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <label style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase' }}>Major Milestones</label>
            <button onClick={() => setShowMilestone(true)} style={{ background:'none', border:'none', color:'var(--accent)', fontSize:11, fontWeight:700, cursor:'pointer' }}>+ Add</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {(goals.longTerm?.milestones ?? []).map(m => (
              <div key={m.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'var(--bg-panel-hover)', borderRadius:10 }}>
                <span style={{ flex:1, fontSize:12, fontWeight:600 }}>{m.title}</span>
                <button onClick={() => patchLong('milestones', goals.longTerm.milestones.filter(x => x.id !== m.id))} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STRATEGY ROADMAP */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="section-header">
          <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
            <Activity size={16} color="var(--accent)" /> System Roadmap
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:20, padding:'10px 0' }}>
          <div style={{ flex:1, textAlign:'center', padding:16, background:'var(--bg-panel-hover)', borderRadius:12 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', marginBottom:4 }}>TACTICAL</div>
            <div style={{ fontSize:14, fontWeight:800 }}>Weekly Execution</div>
          </div>
          <ChevronRight size={20} color="var(--text-dim)" />
          <div style={{ flex:1, textAlign:'center', padding:16, background:'rgba(77,124,254,0.1)', borderRadius:12, border:'1px solid rgba(77,124,254,0.2)' }}>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--accent)', marginBottom:4 }}>STRATEGIC</div>
            <div style={{ fontSize:14, fontWeight:800 }}>Quarterly Outcomes</div>
          </div>
          <ChevronRight size={20} color="var(--text-dim)" />
          <div style={{ flex:1, textAlign:'center', padding:16, background:'var(--bg-panel-hover)', borderRadius:12 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', marginBottom:4 }}>VISION</div>
            <div style={{ fontSize:14, fontWeight:800 }}>Ultimate Legacy</div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showShort && (
        <Modal title="Tactical Goal" onClose={() => setShowShort(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input value={shortForm.title} onChange={e => setShortForm(f => ({ ...f, title: e.target.value }))}
              placeholder="What needs to be done?" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
            <div style={{ display:'flex', gap:12 }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:11, color:'var(--text-dim)', fontWeight:700 }}>Deadline</label>
                <input type="date" value={shortForm.deadline} onChange={e => setShortForm(f => ({ ...f, deadline: e.target.value }))}
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'10px', fontSize:12, color:'#fff', marginTop:4 }} />
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:11, color:'var(--text-dim)', fontWeight:700 }}>Priority</label>
                <select value={shortForm.priority} onChange={e => setShortForm(f => ({ ...f, priority: e.target.value }))}
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'10px', fontSize:12, color:'#fff', marginTop:4 }}>
                  <option value="Low">Low</option>
                  <option value="Mid">Mid</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <button className="btn-primary" style={{ justifyContent:'center', marginTop:10 }} onClick={addShort}>Save Goal</button>
          </div>
        </Modal>
      )}

      {showMid && (
        <Modal title="Strategic Objective" onClose={() => setShowMid(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input value={midForm.title} onChange={e => setMidForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Objective name" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
            <input value={midForm.nextAction} onChange={e => setMidForm(f => ({ ...f, nextAction: e.target.value }))}
              placeholder="Next immediate step..." style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
            <div style={{ display:'flex', gap:12 }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:11, color:'var(--text-dim)', fontWeight:700 }}>Category</label>
                <select value={midForm.category} onChange={e => setMidForm(f => ({ ...f, category: e.target.value }))}
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'10px', fontSize:12, color:'#fff', marginTop:4 }}>
                  {Object.keys(categories).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:11, color:'var(--text-dim)', fontWeight:700 }}>Initial Progress (%)</label>
                <input type="number" value={midForm.progress} onChange={e => setMidForm(f => ({ ...f, progress: e.target.value }))}
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'10px', fontSize:12, color:'#fff', marginTop:4 }} />
              </div>
            </div>
            <button className="btn-primary" style={{ justifyContent:'center', marginTop:10 }} onClick={addMid}>Save Objective</button>
          </div>
        </Modal>
      )}

      {showMilestone && (
        <Modal title="Vision Milestone" onClose={() => setShowMilestone(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input value={milestoneTitle} onChange={e => setMilestoneTitle(e.target.value)}
              placeholder="What's a major marker of success?" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
            <button className="btn-primary" style={{ justifyContent:'center' }} onClick={addMilestone}>Add Milestone</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Goals;
