import React, { useState } from 'react';
import { FolderKanban, Clock, ChevronRight, Plus, MoreHorizontal, X, Trash2, Edit2 } from 'lucide-react';

const STATUSES   = ['idea','building','paused','finished'];
const PRIORITIES = ['High','Medium','Low'];
const STATUS_COLORS = { idea:'#8F8FA3', building:'#4D7CFE', paused:'#FF9500', finished:'#34C759' };

const emptyForm = { name:'', status:'idea', priority:'Medium', nextStep:'', deadline:'', notes:'', progress:0 };

const Projects = ({ data, update }) => {
  const list = data?.list ?? [];
  const [showNew, setShowNew]   = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyForm);

  const patchList = (newList) => update({ ...data, list: newList });

  const openNew  = () => { setForm(emptyForm); setEditId(null); setShowNew(true); };
  const openEdit = (p)  => { setForm({ ...p }); setEditId(p.id); setShowNew(true); };

  const save = () => {
    if (!form.name.trim()) return;
    if (editId) {
      patchList(list.map(p => p.id === editId ? { ...form, id: editId } : p));
    } else {
      patchList([...list, { ...form, id: crypto.randomUUID(), progress: Number(form.progress) }]);
    }
    setShowNew(false);
    setEditId(null);
  };

  const deleteProject = (id) => patchList(list.filter(p => p.id !== id));

  const updateProgress = (id, progress) =>
    patchList(list.map(p => p.id === id ? { ...p, progress: Number(progress) } : p));

  const cycleStatus = (id) => {
    const p = list.find(l => l.id === id);
    const next = STATUSES[(STATUSES.indexOf(p.status) + 1) % STATUSES.length];
    patchList(list.map(l => l.id === id ? { ...l, status: next } : l));
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Missions</div>
          <div className="page-subtitle">All active and planned projects in one place.</div>
        </div>
        <button className="btn-primary" onClick={openNew}><Plus size={14} /> New Mission</button>
      </div>

      {list.length === 0 && (
        <div style={{ background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:20, padding:'60px 40px', textAlign:'center' }}>
          <FolderKanban size={48} color="var(--text-dim)" style={{ margin:'0 auto 16px' }} />
          <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>No missions yet</div>
          <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:24 }}>Define your first mission to start tracking progress.</div>
          <button className="btn-primary" onClick={openNew}><Plus size={14} /> Create First Mission</button>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
        {list.map(p => (
          <div className="mission-card" key={p.id} style={{ padding:22, borderRadius:20 }}>
            {/* TOP */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div style={{ width:46, height:46, borderRadius:14, background:`${STATUS_COLORS[p.status]}22`, display:'flex', alignItems:'center', justifyContent:'center', color: STATUS_COLORS[p.status] }}>
                <FolderKanban size={22} />
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <button onClick={() => cycleStatus(p.id)}
                  style={{ fontSize:10, fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase', padding:'4px 10px', borderRadius:8, background:`${STATUS_COLORS[p.status]}22`, color: STATUS_COLORS[p.status], border:`1px solid ${STATUS_COLORS[p.status]}44`, cursor:'pointer' }}>
                  {p.status}
                </button>
                <button onClick={() => openEdit(p)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}><Edit2 size={14} /></button>
                <button onClick={() => deleteProject(p.id)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}><Trash2 size={14} /></button>
              </div>
            </div>

            {/* NAME */}
            <div style={{ fontSize:17, fontWeight:800, marginBottom:4, lineHeight:1.2 }}>{p.name}</div>
            <div style={{ fontSize:11, color:'var(--text-secondary)', marginBottom:16, display:'flex', gap:12 }}>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={11} /> {p.deadline || 'No deadline'}</span>
              <span>·</span>
              <span>{p.priority} Priority</span>
            </div>

            {/* PROGRESS */}
            <div style={{ marginBottom:8, display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:700 }}>
              <span style={{ color:'var(--text-dim)' }}>Progress</span>
              <span style={{ color: STATUS_COLORS[p.status] }}>{p.progress}%</span>
            </div>
            <input type="range" min={0} max={100} value={p.progress}
              onChange={e => updateProgress(p.id, e.target.value)}
              style={{ width:'100%', accentColor: STATUS_COLORS[p.status], marginBottom:14 }} />

            {/* NEXT STEP */}
            <div style={{ padding:'10px 12px', background:'var(--bg-sidebar)', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid var(--border)' }}>
              <span style={{ fontSize:12, fontWeight:500, color:'var(--text-secondary)' }}>{p.nextStep || 'No next step set'}</span>
              <ChevronRight size={14} color="#4D7CFE" />
            </div>

            {p.notes && (
              <div style={{ marginTop:10, fontSize:12, color:'var(--text-dim)', lineHeight:1.5, borderTop:'1px solid var(--border)', paddingTop:10 }}>
                {p.notes.slice(0, 80)}{p.notes.length > 80 ? '...' : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showNew && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
          <div className="card" style={{ width:'100%', maxWidth:520, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontSize:16, fontWeight:800 }}>{editId ? 'Edit Mission' : 'New Mission'}</div>
              <button onClick={() => setShowNew(false)} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Mission name" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p} Priority</option>)}
                </select>
              </div>
              <input value={form.nextStep} onChange={e => setForm(f => ({ ...f, nextStep: e.target.value }))}
                placeholder="Next action step" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>Progress: {form.progress}%</label>
                <input type="range" min={0} max={100} value={form.progress} onChange={e => setForm(f => ({ ...f, progress: e.target.value }))}
                  style={{ width:'100%', accentColor:'#4D7CFE' }} />
              </div>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Notes (optional)..." rows={3}
                style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff', resize:'none' }} />
              <button className="btn-primary" style={{ justifyContent:'center', padding:'13px' }} onClick={save}>
                {editId ? 'Save Changes' : 'Create Mission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
