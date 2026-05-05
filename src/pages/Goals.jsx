import React, { useState } from 'react';
import { Target, TrendingUp, Trophy, CheckCircle2, Circle, ChevronRight, Plus, Trash2, X, Edit2 } from 'lucide-react';

/* ── reusable modal ── */
const Modal = ({ title, onClose, children }) => (
  <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
    <div className="card" style={{ width:'100%', maxWidth:480, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:800 }}>{title}</div>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Goals = ({ data, update }) => {
  const goals = data ?? { shortTerm: [], midTerm: [], longTerm: { vision: '', milestones: [] } };

  const patch = (newGoals) => update(newGoals);

  // ── Short Term ──
  const [showShort, setShowShort] = useState(false);
  const [shortForm, setShortForm] = useState({ title:'', deadline:'' });

  const addShort = () => {
    if (!shortForm.title.trim()) return;
    patch({ ...goals, shortTerm: [...goals.shortTerm, { id: crypto.randomUUID(), ...shortForm, done: false }] });
    setShortForm({ title:'', deadline:'' });
    setShowShort(false);
  };
  const toggleShort = (id) => patch({ ...goals, shortTerm: goals.shortTerm.map(g => g.id === id ? { ...g, done: !g.done } : g) });
  const deleteShort = (id) => patch({ ...goals, shortTerm: goals.shortTerm.filter(g => g.id !== id) });

  // ── Mid Term ──
  const [showMid, setShowMid] = useState(false);
  const [midForm, setMidForm] = useState({ title:'', progress:0, nextAction:'' });

  const addMid = () => {
    if (!midForm.title.trim()) return;
    patch({ ...goals, midTerm: [...goals.midTerm, { id: crypto.randomUUID(), ...midForm, progress: Number(midForm.progress) }] });
    setMidForm({ title:'', progress:0, nextAction:'' });
    setShowMid(false);
  };
  const updateMidProgress = (id, progress) =>
    patch({ ...goals, midTerm: goals.midTerm.map(g => g.id === id ? { ...g, progress: Number(progress) } : g) });
  const deleteMid = (id) => patch({ ...goals, midTerm: goals.midTerm.filter(g => g.id !== id) });

  // ── Long Term ──
  const patchLong = (field, val) => patch({ ...goals, longTerm: { ...goals.longTerm, [field]: val } });
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');

  const addMilestone = () => {
    if (!milestoneTitle.trim()) return;
    patchLong('milestones', [...(goals.longTerm?.milestones ?? []), { id: crypto.randomUUID(), title: milestoneTitle, done: false }]);
    setMilestoneTitle('');
    setShowMilestone(false);
  };
  const toggleMilestone = (id) =>
    patchLong('milestones', goals.longTerm.milestones.map(m => m.id === id ? { ...m, done: !m.done } : m));
  const deleteMilestone = (id) =>
    patchLong('milestones', goals.longTerm.milestones.filter(m => m.id !== id));

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Objectives</div>
          <div className="page-subtitle">Strategic alignment and tactical execution.</div>
        </div>
      </div>

      <div className="goals-grid">
        {/* SHORT TERM */}
        <div className="card">
          <div className="section-header">
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
              <Target size={16} color="#4D7CFE" /> Tactical (0–7 Days)
            </span>
            <button className="btn-primary" style={{ padding:'6px 12px', fontSize:11 }} onClick={() => setShowShort(true)}>
              <Plus size={12} /> Add
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {goals.shortTerm.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)', padding:'8px 0' }}>No tactical goals yet.</div>}
            {goals.shortTerm.map(g => (
              <div key={g.id} className="goal-item">
                <button onClick={() => toggleShort(g.id)} style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0 }}>
                  {g.done ? <CheckCircle2 size={16} color="#34C759" /> : <Circle size={16} color="var(--text-dim)" />}
                </button>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, textDecoration: g.done ? 'line-through' : 'none', color: g.done ? 'var(--text-dim)' : '#fff' }}>{g.title}</div>
                  {g.deadline && <div style={{ fontSize:11, color:'var(--text-dim)', marginTop:2 }}>Due: {g.deadline}</div>}
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
              <TrendingUp size={16} color="#34C759" /> Strategic (1–12 Mo)
            </span>
            <button className="btn-primary" style={{ padding:'6px 12px', fontSize:11 }} onClick={() => setShowMid(true)}>
              <Plus size={12} /> Add
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {goals.midTerm.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)', padding:'8px 0' }}>No strategic goals yet.</div>}
            {goals.midTerm.map(g => (
              <div key={g.id}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>{g.title}</span>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:11, fontWeight:700, color:'#4D7CFE' }}>{g.progress}%</span>
                    <button onClick={() => deleteMid(g.id)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}><Trash2 size={13} /></button>
                  </div>
                </div>
                <input type="range" min={0} max={100} value={g.progress}
                  onChange={e => updateMidProgress(g.id, e.target.value)}
                  style={{ width:'100%', accentColor:'#4D7CFE' }} />
                {g.nextAction && (
                  <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:4, display:'flex', alignItems:'center', gap:4 }}>
                    <ChevronRight size={11} color="#4D7CFE" /> {g.nextAction}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* LONG TERM */}
        <div className="card">
          <div className="section-header">
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
              <Trophy size={16} color="#FF9500" /> Ultimate Vision
            </span>
            <button className="btn-primary" style={{ padding:'6px 12px', fontSize:11 }} onClick={() => setShowMilestone(true)}>
              <Plus size={12} /> Milestone
            </button>
          </div>
          <textarea
            value={goals.longTerm?.vision ?? ''}
            onChange={e => patchLong('vision', e.target.value)}
            placeholder="Describe your ultimate vision..."
            style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px', fontSize:14, fontStyle:'italic', color:'rgba(255,255,255,0.7)', marginBottom:16, resize:'none', minHeight:80, lineHeight:1.5 }}
          />
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {(goals.longTerm?.milestones ?? []).map(m => (
              <div key={m.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'var(--bg-panel-hover)', borderRadius:10 }}>
                <button onClick={() => toggleMilestone(m.id)} style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0 }}>
                  {m.done ? <CheckCircle2 size={15} color="#34C759" /> : <Circle size={15} color="var(--text-dim)" />}
                </button>
                <span style={{ flex:1, fontSize:12, fontWeight:500, color: m.done ? 'var(--text-dim)' : '#fff' }}>{m.title}</span>
                <button onClick={() => deleteMilestone(m.id)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showShort && (
        <Modal title="Add Tactical Goal" onClose={() => setShowShort(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input value={shortForm.title} onChange={e => setShortForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Goal title" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
            <input type="date" value={shortForm.deadline} onChange={e => setShortForm(f => ({ ...f, deadline: e.target.value }))}
              style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
            <button className="btn-primary" style={{ justifyContent:'center' }} onClick={addShort}>Add Goal</button>
          </div>
        </Modal>
      )}
      {showMid && (
        <Modal title="Add Strategic Goal" onClose={() => setShowMid(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input value={midForm.title} onChange={e => setMidForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Goal title" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
            <input value={midForm.nextAction} onChange={e => setMidForm(f => ({ ...f, nextAction: e.target.value }))}
              placeholder="Next action step" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
            <div>
              <label style={{ fontSize:11, color:'var(--text-dim)', fontWeight:700 }}>Progress: {midForm.progress}%</label>
              <input type="range" min={0} max={100} value={midForm.progress} onChange={e => setMidForm(f => ({ ...f, progress: e.target.value }))}
                style={{ width:'100%', marginTop:6, accentColor:'#4D7CFE' }} />
            </div>
            <button className="btn-primary" style={{ justifyContent:'center' }} onClick={addMid}>Add Goal</button>
          </div>
        </Modal>
      )}
      {showMilestone && (
        <Modal title="Add Milestone" onClose={() => setShowMilestone(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input value={milestoneTitle} onChange={e => setMilestoneTitle(e.target.value)}
              placeholder="Milestone title" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
            <button className="btn-primary" style={{ justifyContent:'center' }} onClick={addMilestone}>Add Milestone</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Goals;
