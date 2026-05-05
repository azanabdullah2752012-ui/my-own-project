import React, { useState } from 'react';
import { Search, Plus, BookOpen, X, Tag, Trash2, Filter } from 'lucide-react';

const CATEGORIES = ['General','Study','Ideas','Reference','Reflection','Projects'];

const Vault = ({ data, update }) => {
  const notes = data?.notes ?? [];
  const [query, setQuery]       = useState('');
  const [activeId, setActiveId] = useState(null);
  const [showNew, setShowNew]   = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [newForm, setNewForm]   = useState({ title:'', category:'General', content:'' });

  const filtered = notes.filter(n => {
    const matchQ = !query || n.title.toLowerCase().includes(query.toLowerCase()) || n.content.toLowerCase().includes(query.toLowerCase());
    const matchC = filterCat === 'All' || n.category === filterCat;
    return matchQ && matchC;
  });

  const active = notes.find(n => n.id === activeId);

  const addNote = () => {
    if (!newForm.title.trim()) return;
    const note = { id: crypto.randomUUID(), ...newForm, tags:[], createdAt: new Date().toISOString() };
    update({ ...data, notes: [note, ...notes] });
    setNewForm({ title:'', category:'General', content:'' });
    setShowNew(false);
    setActiveId(note.id);
  };

  const updateNote = (id, field, val) => {
    update({ ...data, notes: notes.map(n => n.id === id ? { ...n, [field]: val } : n) });
  };

  const deleteNote = (id) => {
    update({ ...data, notes: notes.filter(n => n.id !== id) });
    if (activeId === id) setActiveId(null);
  };

  const badgeColors = {
    General:'#4D7CFE', Study:'#34C759', Ideas:'#FF9500', Reference:'#7B5BFB', Reflection:'#FF3B30', Projects:'#00C9FF'
  };

  return (
    <div className="fade-in">
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <div className="page-title">Knowledge Vault</div>
          <div className="page-subtitle">Your second brain — capture everything.</div>
        </div>
        <button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={14} /> New Entry</button>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px' }}>
          <Search size={15} color="var(--text-dim)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search notes..."
            style={{ background:'none', border:'none', fontSize:13, color:'#fff', flex:1 }} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['All', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              style={{ padding:'8px 12px', borderRadius:8, border: filterCat === c ? '1px solid #4D7CFE' : '1px solid var(--border)', background: filterCat === c ? 'rgba(77,124,254,0.1)' : 'var(--bg-panel)', color: filterCat === c ? '#4D7CFE' : 'var(--text-secondary)', fontSize:11, fontWeight:700, cursor:'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* NOTES GRID */}
      <div className="vault-grid">
        {filtered.length === 0 && (
          <div style={{ gridColumn:'1/-1', color:'var(--text-dim)', fontSize:13, padding:'20px 0' }}>
            {notes.length === 0 ? 'No notes yet. Click "New Entry" to start your knowledge base.' : 'No notes match your search.'}
          </div>
        )}
        {filtered.map(note => (
          <div className="vault-card" key={note.id} onClick={() => setActiveId(note.id)}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div className="vault-card-icon"><BookOpen size={18} /></div>
              <div style={{ display:'flex', gap:6 }}>
                <span style={{ fontSize:10, fontWeight:700, background:`${badgeColors[note.category]}22`, color: badgeColors[note.category] ?? '#4D7CFE', padding:'3px 8px', borderRadius:6 }}>{note.category}</span>
                <button onClick={e => { e.stopPropagation(); deleteNote(note.id); }} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', padding:2 }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="vault-card-title">{note.title}</div>
            <div className="vault-card-preview">{note.content?.slice(0, 90) || 'Empty...'}{note.content?.length > 90 ? '...' : ''}</div>
            <div style={{ marginTop:14, paddingTop:12, borderTop:'1px solid var(--border)', fontSize:10, color:'var(--text-dim)' }}>
              {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* NOTE EDITOR OVERLAY */}
      {active && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(16px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
          <div className="card" style={{ width:'100%', maxWidth:820, height:'82vh', display:'flex', flexDirection:'column', background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
            {/* Editor Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, paddingBottom:14, borderBottom:'1px solid var(--border)' }}>
              <div style={{ flex:1 }}>
                <input value={active.title} onChange={e => updateNote(active.id,'title',e.target.value)}
                  style={{ background:'none', border:'none', fontSize:22, fontWeight:800, color:'#fff', width:'100%', marginBottom:10 }} />
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <select value={active.category} onChange={e => updateNote(active.id,'category',e.target.value)}
                    style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:8, padding:'4px 10px', fontSize:11, fontWeight:700, color: badgeColors[active.category] ?? '#fff' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span style={{ fontSize:11, color:'var(--text-dim)' }}>{new Date(active.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => deleteNote(active.id)} style={{ background:'rgba(255,59,48,0.1)', border:'1px solid rgba(255,59,48,0.2)', borderRadius:8, padding:'8px 12px', color:'#FF3B30', cursor:'pointer', fontSize:12, fontWeight:700 }}>Delete</button>
                <button onClick={() => setActiveId(null)} style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:8, padding:'8px', color:'var(--text-secondary)', cursor:'pointer' }}>
                  <X size={18} />
                </button>
              </div>
            </div>
            {/* Editor Body */}
            <textarea value={active.content} onChange={e => updateNote(active.id,'content',e.target.value)}
              placeholder="Start writing..."
              style={{ flex:1, background:'none', border:'none', fontSize:15, color:'var(--text-secondary)', lineHeight:1.75, resize:'none', overflow:'auto' }} autoFocus />
          </div>
        </div>
      )}

      {/* NEW NOTE MODAL */}
      {showNew && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
          <div className="card" style={{ width:'100%', maxWidth:480, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontSize:16, fontWeight:800 }}>New Knowledge Entry</div>
              <button onClick={() => setShowNew(false)} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <input value={newForm.title} onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Title" style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }} />
              <select value={newForm.category} onChange={e => setNewForm(f => ({ ...f, category: e.target.value }))}
                style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea value={newForm.content} onChange={e => setNewForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Start writing (you can continue in the editor)..." rows={4}
                style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#fff', resize:'none' }} />
              <button className="btn-primary" style={{ justifyContent:'center', padding:'13px' }} onClick={addNote}>Create Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vault;
