import React, { useState } from 'react';
import { 
  Target, TrendingUp, Trophy, CheckCircle2, Circle, 
  ChevronRight, Plus, Trash2, X, Star, Flag, 
  Compass, Zap, Briefcase, Heart, Sparkles, Activity
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

const Goals = ({ data: rawData, update, setView }) => {
  // Ensure we have all properties even if data is old
  const goals = {
    shortTerm: [],
    midTerm: [],
    longTerm: { vision: '', milestones: [], values: [] },
    ...(rawData || {})
  };

  const patch = (newGoals) => update(newGoals);

  // ── Short Term ──
  const [showShort, setShowShort] = useState(false);
  const [shortForm, setShortForm] = useState({ title:'', deadline:'', priority: 'Mid' });

  const addShort = () => {
    if (!shortForm.title.trim()) return;
    patch({ ...goals, shortTerm: [...(goals.shortTerm || []), { id: Date.now(), ...shortForm, done: false }] });
    setShortForm({ title:'', deadline:'', priority: 'Mid' });
    setShowShort(false);
  };
  const toggleShort = (id) => patch({ ...goals, shortTerm: (goals.shortTerm || []).map(g => g.id === id ? { ...g, done: !g.done } : g) });
  const deleteShort = (id) => patch({ ...goals, shortTerm: (goals.shortTerm || []).filter(g => g.id !== id) });

  // ── Mid Term ──
  const [showMid, setShowMid] = useState(false);
  const [midForm, setMidForm] = useState({ title:'', progress:0, nextAction:'', category: 'General' });

  const addMid = () => {
    if (!midForm.title.trim()) return;
    patch({ ...goals, midTerm: [...(goals.midTerm || []), { id: Date.now(), ...midForm, progress: Number(midForm.progress) }] });
    setMidForm({ title:'', progress:0, nextAction:'', category: 'General' });
    setShowMid(false);
  };
  const updateMidProgress = (id, progress) =>
    patch({ ...goals, midTerm: (goals.midTerm || []).map(g => g.id === id ? { ...g, progress: Number(progress) } : g) });
  const deleteMid = (id) => patch({ ...goals, midTerm: (goals.midTerm || []).filter(g => g.id !== id) });

  // ── Long Term ──
  const patchLong = (field, val) => patch({ ...goals, longTerm: { ...(goals.longTerm || {}), [field]: val } });
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

  const shortTerm = goals.shortTerm || [];
  const midTerm = goals.midTerm || [];
  const longTerm = goals.longTerm || { vision: '', milestones: [], values: [] };

  const tacticalAccuracy = Math.round((shortTerm.filter(g => g.done).length / (shortTerm.length || 1)) * 100);
  const strategicMomentum = Math.round(midTerm.reduce((acc, g) => acc + (g.progress || 0), 0) / (midTerm.length || 1));

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
            <div style={{ fontSize:24, fontWeight:900, color:'#34C759' }}>{tacticalAccuracy}%</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--text-dim)', textTransform:'uppercase' }}>Strategic Momentum</div>
            <div style={{ fontSize:24, fontWeight:900, color:'#4D7CFE' }}>{strategicMomentum}%</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(77,124,254,0.1) 0%, rgba(123,91,251,0.1) 100%)', border: '1px solid rgba(77,124,254,0.2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:50, height:50, borderRadius:14, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 16px rgba(77,124,254,0.3)' }}>
            <Zap size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Current Monthly Focus</div>
            <h2 style={{ fontSize:20, fontWeight:900, marginTop:4 }}>{midTerm.find(g => g.progress < 100)?.title || 'Establish New Strategic Base'}</h2>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>Status: Active</div>
          <button className="btn-primary" style={{ marginTop:8, padding:'6px 16px', fontSize:11 }} onClick={() => setView('dashboard')}>View Dashboard</button>
        </div>
      </div>

      <div className="goals-grid">
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
            {shortTerm.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)', padding:'8px 0' }}>No tactical goals.</div>}
            {shortTerm.map(g => (
              <div key={g.id} className="goal-item" style={{ borderLeft: `3px solid ${g.priority === 'High' ? '#FF3B30' : g.priority === 'Mid' ? '#FF9500' : '#34C759'}` }}>
                <button onClick={() => toggleShort(g.id)} style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0 }}>
                  {g.done ? <CheckCircle2 size={16} color="#34C759" /> : <Circle size={16} color="var(--text-dim)" />}
                </button>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color: g.done ? 'var(--text-dim)' : '#fff', textDecoration: g.done ? 'line-through' : 'none' }}>{g.title}</div>
                  <div style={{ fontSize:10, color:'var(--text-dim)', marginTop:2 }}>Deadline: {g.deadline || 'ASAP'}</div>
                </div>
                <button onClick={() => deleteShort(g.id)} style={{ background:'none', border:'none', opacity:0.3, cursor:'pointer' }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
              <Compass size={16} color="#34C759" /> Strategic (Monthly)
            </span>
            <button className="btn-primary" style={{ padding:'6px 12px', fontSize:11 }} onClick={() => setShowMid(true)}>
              <Plus size={12} /> Add
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {midTerm.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)', padding:'8px 0' }}>No strategic goals.</div>}
            {midTerm.map(g => (
              <div key={g.id} className="goal-item" style={{ borderLeft: `3px solid ${categories[g.category]?.color || '#4D7CFE'}` }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <div style={{ fontSize:13, fontWeight:700 }}>{g.title}</div>
                    <div style={{ fontSize:11, fontWeight:800, color:categories[g.category]?.color }}>{g.progress}%</div>
                  </div>
                  <div style={{ height:6, background:'var(--bg-panel-hover)', borderRadius:3, overflow:'hidden', marginBottom:8 }}>
                    <div style={{ height:'100%', width:`${g.progress}%`, background:categories[g.category]?.color, transition:'width 0.5s ease' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontSize:10, color:'var(--text-dim)', display:'flex', alignItems:'center', gap:4 }}>
                      {categories[g.category]?.icon} Next: {g.nextAction || 'TBD'}
                    </div>
                    <input type="range" value={g.progress} onChange={e => updateMidProgress(g.id, e.target.value)} style={{ width:60, height:4 }} />
                  </div>
                </div>
                <button onClick={() => deleteMid(g.id)} style={{ background:'none', border:'none', opacity:0.3, cursor:'pointer', marginLeft:10 }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
              <Trophy size={16} color="#FF9500" /> Ultimate Goal
            </span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
             <textarea value={longTerm.vision} onChange={e => patchLong('vision', e.target.value)} 
               placeholder="Write your long-term vision..."
               style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:12, padding:12, fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, resize:'none' }} rows={3} />
             
             <div>
               <div style={{ fontSize:11, fontWeight:800, color:'var(--text-dim)', textTransform:'uppercase', marginBottom:10 }}>Core Milestones</div>
               <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                 {longTerm.milestones?.map(m => (
                   <div key={m.id} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color: m.done ? 'var(--text-dim)' : 'var(--text-secondary)' }}>
                     <CheckCircle2 size={14} color={m.done ? '#34C759' : 'var(--border)'} />
                     {m.title}
                   </div>
                 ))}
                 <button onClick={() => setShowMilestone(true)} style={{ display:'flex', alignItems:'center', gap:8, fontSize:11, color:'var(--accent)', background:'none', border:'none', cursor:'pointer', marginTop:4 }}>
                   <Plus size={12} /> Add Milestone
                 </button>
               </div>
             </div>

             <div>
               <div style={{ fontSize:11, fontWeight:800, color:'var(--text-dim)', textTransform:'uppercase', marginBottom:10 }}>Governing Values</div>
               <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                 {longTerm.values?.map((v, i) => (
                   <span key={i} onClick={() => deleteValue(i)} style={{ fontSize:10, fontWeight:700, background:'rgba(77,124,254,0.1)', color:'var(--accent)', padding:'4px 10px', borderRadius:20, cursor:'pointer' }}>{v}</span>
                 ))}
                 <input value={newValue} onChange={e => setNewValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && addValue()}
                   placeholder="+ Add Value" style={{ background:'none', border:'none', fontSize:10, color:'var(--text-dim)', outline:'none', width:80 }} />
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showShort && (
        <Modal title="Add Tactical Goal" onClose={() => setShowShort(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <input value={shortForm.title} onChange={e => setShortForm({...shortForm, title: e.target.value})} placeholder="Title (e.g. Master Differentiation)" style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:12, color:'#fff' }} />
            <div style={{ display:'flex', gap:10 }}>
              <input type="date" value={shortForm.deadline} onChange={e => setShortForm({...shortForm, deadline: e.target.value})} style={{ flex:1, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:12, color:'#fff' }} />
              <select value={shortForm.priority} onChange={e => setShortForm({...shortForm, priority: e.target.value})} style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:12, color:'#fff' }}>
                <option value="High">🔴 High</option>
                <option value="Mid">🟠 Mid</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>
            <button className="btn-primary" style={{ justifyContent:'center', padding:14, fontWeight:800 }} onClick={addShort}>Create Tactical Objective</button>
          </div>
        </Modal>
      )}

      {showMid && (
        <Modal title="Add Strategic Objective" onClose={() => setShowMid(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <input value={midForm.title} onChange={e => setMidForm({...midForm, title: e.target.value})} placeholder="Title" style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:12, color:'#fff' }} />
            <input value={midForm.nextAction} onChange={e => setMidForm({...midForm, nextAction: e.target.value})} placeholder="Next Action" style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:12, color:'#fff' }} />
            <select value={midForm.category} onChange={e => setMidForm({...midForm, category: e.target.value})} style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:12, color:'#fff' }}>
              {Object.keys(categories).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="btn-primary" style={{ justifyContent:'center', padding:14 }} onClick={addMid}>Create Objective</button>
          </div>
        </Modal>
      )}

      {showMilestone && (
        <Modal title="Add Vision Milestone" onClose={() => setShowMilestone(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <input value={milestoneTitle} onChange={e => setMilestoneTitle(e.target.value)} placeholder="Milestone Title" style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:12, color:'#fff' }} />
            <button className="btn-primary" style={{ justifyContent:'center', padding:14 }} onClick={addMilestone}>Add Milestone</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Goals;
