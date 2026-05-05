import React, { useState } from 'react';
import { FolderKanban, Clock, ChevronRight, Plus, MoreHorizontal, X, Trash2, Edit2, Layers, Grid } from 'lucide-react';

const STATUSES   = ['idea','building','paused','finished'];
const PRIORITIES = ['High','Medium','Low'];
const STATUS_COLORS = { idea:'#8F8FA3', building:'#4D7CFE', paused:'#FF9500', finished:'#34C759' };
const STATUS_LABELS = { idea:'💡 Idea', building:'🔨 Building', paused:'⏸ Paused', finished:'✅ Done' };
const emptyForm = { name:'', status:'idea', priority:'Medium', nextStep:'', deadline:'', notes:'', progress:0 };

/* ── SHARED: FORM MODAL ── */
const ProjectForm = ({ form, setForm, onSave, onClose, editing }) => (
  <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
    <div className="card" style={{ width:'100%', maxWidth:520, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)', maxHeight:'92vh', overflowY:'auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:800 }}>{editing ? 'Edit Mission' : 'New Mission'}</div>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Mission name" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:14, fontWeight:700, color:'#fff' }} autoFocus />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }}>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
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
          <input type="range" min={0} max={100} value={form.progress} onChange={e => setForm(f => ({ ...f, progress: parseInt(e.target.value) }))}
            style={{ width:'100%', accentColor:'#4D7CFE' }} />
        </div>
        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="Notes (optional)..." rows={3}
          style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff', resize:'none' }} />
        <button className="btn-primary" style={{ justifyContent:'center', padding:'13px' }} onClick={onSave}>
          {editing ? 'Save Changes' : 'Create Mission'}
        </button>
      </div>
    </div>
  </div>
);

/* ── PROJECT CARD (shared) ── */
const ProjectCard = ({ p, onEdit, onDelete, onProgress, kanban }) => (
  <div style={{ background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:16, padding: kanban ? '14px' : '20px', transition:'border-color 0.15s', cursor: kanban ? 'grab' : 'default' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = `${STATUS_COLORS[p.status]}55`}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: kanban ? 10 : 14 }}>
      <div style={{ width: kanban ? 36 : 44, height: kanban ? 36 : 44, borderRadius:12, background:`${STATUS_COLORS[p.status]}22`, display:'flex', alignItems:'center', justifyContent:'center', color: STATUS_COLORS[p.status], flexShrink:0 }}>
        <FolderKanban size={kanban ? 18 : 22} />
      </div>
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        <span style={{ fontSize:9, fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase', padding:'3px 8px', borderRadius:6, background:`${STATUS_COLORS[p.status]}22`, color: STATUS_COLORS[p.status] }}>
          {p.priority}
        </span>
        <button onClick={() => onEdit(p)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', padding:2 }}><Edit2 size={13} /></button>
        <button onClick={() => onDelete(p.id)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', padding:2 }}><Trash2 size={13} /></button>
      </div>
    </div>
    <div style={{ fontSize: kanban ? 13 : 16, fontWeight:800, marginBottom:4, lineHeight:1.2 }}>{p.name}</div>
    <div style={{ fontSize:11, color:'var(--text-secondary)', marginBottom: kanban ? 10 : 14, display:'flex', gap:10, flexWrap:'wrap' }}>
      <span><Clock size={10} style={{ marginRight:3 }} />{p.deadline || 'No deadline'}</span>
    </div>
    <div style={{ fontSize:11, fontWeight:700, display:'flex', justifyContent:'space-between', marginBottom:4 }}>
      <span style={{ color:'var(--text-dim)' }}>Progress</span>
      <span style={{ color: STATUS_COLORS[p.status] }}>{p.progress}%</span>
    </div>
    <input type="range" min={0} max={100} value={p.progress} onChange={e => onProgress(p.id, e.target.value)}
      style={{ width:'100%', accentColor: STATUS_COLORS[p.status], marginBottom: kanban ? 8 : 12 }} />
    {p.nextStep && (
      <div style={{ padding:'8px 10px', background:'var(--bg-sidebar)', borderRadius:8, display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid var(--border)' }}>
        <span style={{ fontSize:11, color:'var(--text-secondary)' }}>{p.nextStep}</span>
        <ChevronRight size={12} color="#4D7CFE" />
      </div>
    )}
  </div>
);

const Projects = ({ data, update }) => {
  const list = data?.list ?? [];
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban'
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyForm);

  const patchList = (newList) => update({ ...data, list: newList });
  const openNew   = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit  = (p)  => { setForm({ ...p }); setEditId(p.id); setShowForm(true); };
  const onDelete  = (id) => patchList(list.filter(p => p.id !== id));
  const onProgress = (id, val) => patchList(list.map(p => p.id === id ? { ...p, progress: parseInt(val) } : p));

  const onSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      patchList(list.map(p => p.id === editId ? { ...form, id: editId, progress: parseInt(form.progress) } : p));
    } else {
      patchList([...list, { ...form, id: crypto.randomUUID(), progress: parseInt(form.progress) }]);
    }
    setShowForm(false); setEditId(null);
  };

  // Summary stats
  const total    = list.length;
  const building = list.filter(p => p.status === 'building').length;
  const done     = list.filter(p => p.status === 'finished').length;

  return (
    <div className="fade-in">
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20 }}>
        <div>
          <div className="page-title">Missions</div>
          <div className="page-subtitle">{total} missions · {building} active · {done} complete</div>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {/* VIEW TOGGLE */}
          <div style={{ display:'flex', background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
            <button onClick={() => setViewMode('grid')}
              style={{ padding:'8px 14px', background: viewMode === 'grid' ? 'var(--accent)' : 'transparent', border:'none', color: viewMode === 'grid' ? '#fff' : 'var(--text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700 }}>
              <Grid size={14} /> Grid
            </button>
            <button onClick={() => setViewMode('kanban')}
              style={{ padding:'8px 14px', background: viewMode === 'kanban' ? 'var(--accent)' : 'transparent', border:'none', color: viewMode === 'kanban' ? '#fff' : 'var(--text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700 }}>
              <Layers size={14} /> Kanban
            </button>
          </div>
          <button className="btn-primary" onClick={openNew}><Plus size={14} /> New Mission</button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {list.length === 0 && (
        <div style={{ background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:20, padding:'60px 40px', textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
          <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>No missions yet</div>
          <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:24 }}>Define your first mission to start tracking progress.</div>
          <button className="btn-primary" onClick={openNew}><Plus size={14} /> Create First Mission</button>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && list.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
          {list.map(p => (
            <ProjectCard key={p.id} p={p} onEdit={openEdit} onDelete={onDelete} onProgress={onProgress} kanban={false} />
          ))}
        </div>
      )}

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && list.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, alignItems:'start' }}>
          {STATUSES.map(status => {
            const col = list.filter(p => p.status === status);
            return (
              <div key={status}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, padding:'10px 12px', background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:10 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background: STATUS_COLORS[status] }} />
                  <span style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>{STATUS_LABELS[status]}</span>
                  <span style={{ marginLeft:'auto', fontSize:11, fontWeight:800, color: STATUS_COLORS[status] }}>{col.length}</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {col.map(p => (
                    <ProjectCard key={p.id} p={p} onEdit={openEdit} onDelete={onDelete} onProgress={onProgress} kanban={true} />
                  ))}
                  <button onClick={() => { setForm({ ...emptyForm, status }); setEditId(null); setShowForm(true); }}
                    style={{ padding:'10px', borderRadius:10, border:'1px dashed var(--border)', background:'transparent', color:'var(--text-dim)', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = STATUS_COLORS[status]; e.currentTarget.style.color = STATUS_COLORS[status]; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}>
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <ProjectForm form={form} setForm={setForm} onSave={onSave} onClose={() => setShowForm(false)} editing={!!editId} />}
    </div>
  );
};

export default Projects;
