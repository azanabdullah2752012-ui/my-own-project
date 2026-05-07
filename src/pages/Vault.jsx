import React, { useState } from 'react';
import { Search, Plus, BookOpen, X, Trash2, Shield, Code, Languages, Calculator, GraduationCap, Quote } from 'lucide-react';

const CATEGORIES = ['General','Study','Ideas','Reference','Principles','Projects'];

const SUBJECTS = [
  { id: 'math', name: 'Mathematics', icon: <Calculator size={24} />, color: '#4D7CFE', desc: 'Logic, problem solving, and practice.' },
  { id: 'french', name: 'French', icon: <Languages size={24} />, color: '#AF52DE', desc: 'Fluency, vocabulary, and culture.' },
  { id: 'coding', name: 'Coding', icon: <Code size={24} />, color: '#34C759', desc: 'Architecture, logic, and building.' }
];

const Vault = ({ data, update }) => {
  const notes = data?.vault?.notes ?? [];
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
    const note = { id: crypto.randomUUID(), ...newForm, createdAt: new Date().toISOString() };
    update({ ...data, vault: { ...data.vault, notes: [note, ...notes] } });
    setNewForm({ title:'', category:'General', content:'' });
    setShowNew(false);
    setActiveId(note.id);
  };

  const updateNote = (id, field, val) => {
    update({ ...data, vault: { ...data.vault, notes: notes.map(n => n.id === id ? { ...n, [field]: val } : n) } });
  };

  const deleteNote = (id) => {
    update({ ...data, vault: { ...data.vault, notes: notes.filter(n => n.id !== id) } });
    if (activeId === id) setActiveId(null);
  };

  const badgeColors = {
    General:'#4D7CFE', Study:'#34C759', Ideas:'#FF9500', Reference:'#7B5BFB', Principles:'#FF3B30', Projects:'#00C9FF'
  };

  return (
    <div className="fade-in">
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <div className="page-title">Intelligence Vault</div>
          <div className="page-subtitle">Your Second Brain — store models, principles, and deep knowledge.</div>
        </div>
        <button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={14} /> New Entry</button>
      </div>

      {/* SUBJECT CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16, marginBottom:32 }}>
        {SUBJECTS.map(sub => (
          <div key={sub.id} className="card" style={{ padding:20, cursor:'pointer', border:'1px solid var(--border)', transition:'all 0.2s', position:'relative', overflow:'hidden' }} onClick={() => { setFilterCat('Study'); setQuery(sub.name); }}>
            <div style={{ position:'absolute', top:-10, right:-10, opacity:0.05, fontSize:80 }}>{sub.icon}</div>
            <div style={{ color:sub.color, marginBottom:12 }}>{sub.icon}</div>
            <div style={{ fontSize:16, fontWeight:900, marginBottom:4 }}>{sub.name}</div>
            <div style={{ fontSize:11, color:'var(--text-secondary)', lineHeight:1.4 }}>{sub.desc}</div>
          </div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:12, padding:'12px 16px' }}>
          <Search size={15} color="var(--text-dim)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your mental models..."
            style={{ background:'none', border:'none', fontSize:13, color:'#fff', flex:1 }} />
        </div>
        <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4 }}>
          {['All', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              style={{ padding:'8px 16px', borderRadius:10, whiteSpace:'nowrap', border: filterCat === c ? `1px solid ${badgeColors[c] || '#4D7CFE'}` : '1px solid var(--border)', background: filterCat === c ? `${badgeColors[c] || '#4D7CFE'}11` : 'var(--bg-panel)', color: filterCat === c ? (badgeColors[c] || '#4D7CFE') : 'var(--text-secondary)', fontSize:11, fontWeight:700, cursor:'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* NOTES GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px 0', color:'var(--text-dim)', fontSize:14 }}>
            {notes.length === 0 ? 'The vault is empty. Capture your first mental model.' : 'No entries match your search.'}
          </div>
        )}
        {filtered.map(note => (
          <div key={note.id} className="card" onClick={() => setActiveId(note.id)} 
            style={{ padding:20, cursor:'pointer', border:'1px solid var(--border)', position:'relative' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center', color:badgeColors[note.category] }}>
                {note.category === 'Principles' ? <Shield size={16} /> : note.category === 'Study' ? <GraduationCap size={16} /> : <BookOpen size={16} />}
              </div>
              <span style={{ fontSize:10, fontWeight:800, background:`${badgeColors[note.category]}15`, color:badgeColors[note.category], padding:'4px 10px', borderRadius:20 }}>{note.category}</span>
            </div>
            <div style={{ fontSize:15, fontWeight:800, marginBottom:8 }}>{note.title}</div>
            <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.5, height:54, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical' }}>
              {note.content}
            </div>
            <div style={{ marginTop:16, paddingTop:12, borderTop:'1px solid var(--border)', fontSize:10, color:'var(--text-dim)', display:'flex', justifyContent:'space-between' }}>
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              <span>{note.content?.split(' ').length} words</span>
            </div>
          </div>
        ))}
      </div>

      {/* NOTE VIEWER OVERLAY */}
      {active && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
          <div className="card" style={{ width:'100%', maxWidth:840, height:'85vh', display:'flex', flexDirection:'column', background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)', padding:0, overflow:'hidden' }}>
            <div style={{ padding:'20px 30px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
               <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <select value={active.category} onChange={e => updateNote(active.id,'category',e.target.value)}
                    style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:800, color: badgeColors[active.category] }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span style={{ fontSize:11, color:'var(--text-dim)' }}>Last modified: {new Date(active.createdAt).toLocaleString()}</span>
               </div>
               <div style={{ display:'flex', gap:12 }}>
                 <button onClick={() => deleteNote(active.id)} style={{ background:'rgba(255,59,48,0.1)', border:'none', borderRadius:8, padding:'8px 16px', color:'#FF3B30', fontSize:12, fontWeight:700, cursor:'pointer' }}>Delete</button>
                 <button onClick={() => setActiveId(null)} style={{ background:'var(--bg-panel-hover)', border:'none', borderRadius:8, padding:'8px', color:'var(--text-secondary)', cursor:'pointer' }}><X size={20} /></button>
               </div>
            </div>
            <div style={{ flex:1, padding:30, overflowY:'auto' }}>
              <input value={active.title} onChange={e => updateNote(active.id,'title',e.target.value)}
                style={{ background:'none', border:'none', fontSize:28, fontWeight:900, color:'#fff', width:'100%', marginBottom:20 }} />
              <textarea value={active.content} onChange={e => updateNote(active.id,'content',e.target.value)}
                placeholder="Start capturing your thoughts..."
                style={{ width:'100%', height:'80%', background:'none', border:'none', fontSize:16, color:'var(--text-secondary)', lineHeight:1.8, resize:'none' }} autoFocus />
            </div>
          </div>
        </div>
      )}

      {/* NEW NOTE MODAL */}
      {showNew && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
          <div className="card" style={{ width:'100%', maxWidth:500, background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div style={{ fontSize:20, fontWeight:900 }}>Create New Mental Model</div>
              <button onClick={() => setShowNew(false)} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:8 }}>Title</label>
                <input value={newForm.title} onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. First Principles Thinking" style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:12, padding:14, fontSize:14, color:'#fff' }} />
              </div>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:8 }}>Classification</label>
                <select value={newForm.category} onChange={e => setNewForm(f => ({ ...f, category: e.target.value }))}
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:12, padding:14, fontSize:14, color:'#fff' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:8 }}>Initial Concept</label>
                <textarea value={newForm.content} onChange={e => setNewForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Capture the core essence..." rows={5}
                  style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:12, padding:14, fontSize:14, color:'#fff', resize:'none' }} />
              </div>
              <button className="btn-primary" style={{ justifyContent:'center', padding:16, marginTop:8 }} onClick={addNote}>Store in Vault</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vault;
