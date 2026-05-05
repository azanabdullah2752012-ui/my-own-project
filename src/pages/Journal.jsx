import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, X, Edit2, Save } from 'lucide-react';

const MOODS = ['😤 Focused','😊 Good','😐 Neutral','😔 Low','😴 Tired'];
const fmt = (d) => d.toISOString().slice(0, 10);
const display = (s) => new Date(s + 'T00:00:00').toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

const Journal = ({ data, update }) => {
  const entries = data?.entries ?? [];
  const [currentDate, setCurrentDate] = useState(fmt(new Date()));
  const [editing, setEditing]         = useState(false);
  const [form, setForm]               = useState({ title:'', content:'', mood: MOODS[0] });
  const [viewId, setViewId]           = useState(null);

  const todayEntry = entries.find(e => e.date === currentDate);
  const viewEntry  = entries.find(e => e.id === viewId);

  const prevDay = () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setCurrentDate(fmt(d));
  };
  const nextDay = () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    if (fmt(d) <= fmt(new Date())) setCurrentDate(fmt(d));
  };
  const goToday = () => setCurrentDate(fmt(new Date()));

  const openNew = () => {
    setForm({ title: '', content: '', mood: MOODS[0] });
    setEditing(true);
  };

  const openEdit = (entry) => {
    setForm({ title: entry.title, content: entry.content, mood: entry.mood });
    setEditing(true);
    setViewId(null);
  };

  const save = () => {
    if (!form.content.trim()) return;
    if (todayEntry) {
      update({ ...data, entries: entries.map(e => e.date === currentDate ? { ...e, ...form } : e) });
    } else {
      update({ ...data, entries: [{ id: crypto.randomUUID(), date: currentDate, ...form }, ...entries] });
    }
    setEditing(false);
  };

  const deleteEntry = (id) => {
    update({ ...data, entries: entries.filter(e => e.id !== id) });
    setViewId(null);
  };

  const isFuture = currentDate > fmt(new Date());
  const wordCount = (s) => s.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="fade-in" style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:20, minHeight:'70vh' }}>
      {/* LEFT: EDITOR / VIEWER */}
      <div>
        {/* Date Nav */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button className="cal-nav-btn" onClick={prevDay}><ChevronLeft size={14} /></button>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ fontSize:15, fontWeight:800 }}>{display(currentDate)}</div>
            {currentDate !== fmt(new Date()) && (
              <button onClick={goToday} style={{ fontSize:11, color:'#4D7CFE', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>→ Go to Today</button>
            )}
          </div>
          <button className="cal-nav-btn" onClick={nextDay} disabled={isFuture} style={{ opacity: isFuture ? 0.3 : 1 }}><ChevronRight size={14} /></button>
        </div>

        {/* EDITOR */}
        {editing ? (
          <div className="card" style={{ background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.15)' }}>
            <div style={{ marginBottom:14 }}>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Entry title (optional)"
                style={{ width:'100%', background:'none', border:'none', fontSize:20, fontWeight:800, color:'#fff', marginBottom:10 }} />
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {MOODS.map(m => (
                  <button key={m} onClick={() => setForm(f => ({ ...f, mood: m }))}
                    style={{ padding:'5px 12px', borderRadius:20, border: form.mood === m ? '1px solid #4D7CFE' : '1px solid var(--border)', background: form.mood === m ? 'rgba(77,124,254,0.1)' : 'var(--bg-panel-hover)', color: form.mood === m ? '#4D7CFE' : 'var(--text-secondary)', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder={`Write your ${display(currentDate)} entry...\n\nWhat happened? How do you feel? What did you learn? What are you grateful for?`}
              autoFocus
              style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:12, padding:'16px', fontSize:14, color:'#fff', minHeight:320, resize:'vertical', lineHeight:1.8 }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14 }}>
              <span style={{ fontSize:11, color:'var(--text-dim)' }}>{wordCount(form.content)} words</span>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setEditing(false)} className="btn-ghost" style={{ border:'1px solid var(--border)', borderRadius:8, padding:'9px 16px' }}>Cancel</button>
                <button onClick={save} className="btn-primary"><Save size={14} /> Save Entry</button>
              </div>
            </div>
          </div>
        ) : todayEntry && currentDate === fmt(new Date()) ? (
          /* TODAY — show existing entry */
          <div className="card" style={{ background:'var(--bg-sidebar)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                {todayEntry.title && <div style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>{todayEntry.title}</div>}
                <span style={{ fontSize:12, color:'#4D7CFE', background:'rgba(77,124,254,0.1)', padding:'4px 10px', borderRadius:20 }}>{todayEntry.mood}</span>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => openEdit(todayEntry)} style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  <Edit2 size={13} style={{ marginRight:4 }} /> Edit
                </button>
                <button onClick={() => deleteEntry(todayEntry.id)} style={{ background:'rgba(255,59,48,0.08)', border:'1px solid rgba(255,59,48,0.2)', borderRadius:8, padding:'8px 12px', color:'#FF3B30', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.9, whiteSpace:'pre-wrap' }}>{todayEntry.content}</div>
            <div style={{ marginTop:14, fontSize:11, color:'var(--text-dim)' }}>{wordCount(todayEntry.content)} words</div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="card" style={{ textAlign:'center', padding:'60px 40px' }}>
            {isFuture ? (
              <>
                <div style={{ fontSize:48, marginBottom:16 }}>🔮</div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>Future Date</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)' }}>You can only journal today or past dates.</div>
              </>
            ) : entries.find(e => e.date === currentDate) ? null : (
              <>
                <div style={{ fontSize:48, marginBottom:16 }}>✍️</div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>
                  {currentDate === fmt(new Date()) ? 'No entry today yet' : 'No entry for this day'}
                </div>
                <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:24 }}>
                  {currentDate === fmt(new Date()) ? 'Start writing your daily reflection.' : 'You can still write a retrospective entry.'}
                </div>
                {!isFuture && <button className="btn-primary" onClick={openNew}><Plus size={14} /> Write Entry</button>}
              </>
            )}
          </div>
        )}

        {/* PAST ENTRY VIEWER */}
        {viewEntry && (
          <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
            <div className="card" style={{ width:'100%', maxWidth:680, maxHeight:'85vh', overflowY:'auto', background:'var(--bg-sidebar)', border:'1px solid rgba(77,124,254,0.2)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:12, color:'var(--text-dim)', fontWeight:700, marginBottom:4 }}>{display(viewEntry.date)}</div>
                  {viewEntry.title && <div style={{ fontSize:20, fontWeight:800 }}>{viewEntry.title}</div>}
                  <span style={{ fontSize:12, color:'#4D7CFE', background:'rgba(77,124,254,0.1)', padding:'3px 10px', borderRadius:20, marginTop:6, display:'inline-block' }}>{viewEntry.mood}</span>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => { openEdit(viewEntry); setCurrentDate(viewEntry.date); }} style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', color:'#fff', fontSize:12, cursor:'pointer' }}><Edit2 size={13} /></button>
                  <button onClick={() => deleteEntry(viewEntry.id)} style={{ background:'rgba(255,59,48,0.08)', border:'1px solid rgba(255,59,48,0.2)', borderRadius:8, padding:'8px 12px', color:'#FF3B30', fontSize:12, cursor:'pointer' }}><Trash2 size={13} /></button>
                  <button onClick={() => setViewId(null)} style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:8, padding:'8px', color:'var(--text-secondary)', cursor:'pointer' }}><X size={16} /></button>
                </div>
              </div>
              <div style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.9, whiteSpace:'pre-wrap' }}>{viewEntry.content}</div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: PAST ENTRIES LIST */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <span style={{ fontWeight:700, fontSize:14 }}>All Entries</span>
          <span style={{ fontSize:11, color:'var(--text-dim)' }}>{entries.length} total</span>
        </div>
        {!editing && currentDate === fmt(new Date()) && !todayEntry && (
          <button className="btn-primary" style={{ width:'100%', justifyContent:'center', marginBottom:14 }} onClick={openNew}>
            <Plus size={14} /> Write Today
          </button>
        )}
        <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:'65vh', overflowY:'auto' }}>
          {entries.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)', padding:'20px 0' }}>No entries yet.</div>}
          {[...entries].sort((a,b) => b.date.localeCompare(a.date)).map(e => (
            <div key={e.id}
              onClick={() => { setViewId(e.id); setEditing(false); }}
              style={{ padding:'12px 14px', background: e.date === currentDate ? 'rgba(77,124,254,0.1)' : 'var(--bg-panel)', border: `1px solid ${e.date === currentDate ? 'rgba(77,124,254,0.3)' : 'var(--border)'}`, borderRadius:12, cursor:'pointer', transition:'all 0.15s' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <span style={{ fontSize:11, fontWeight:700, color: e.date === currentDate ? '#4D7CFE' : 'var(--text-secondary)' }}>
                  {new Date(e.date + 'T00:00:00').toLocaleDateString('en-US',{ month:'short', day:'numeric' })}
                </span>
                <span style={{ fontSize:11 }}>{e.mood?.split(' ')[0]}</span>
              </div>
              {e.title && <div style={{ fontSize:12, fontWeight:700, marginBottom:2 }}>{e.title}</div>}
              <div style={{ fontSize:11, color:'var(--text-dim)', lineHeight:1.4 }}>
                {e.content.slice(0, 60)}{e.content.length > 60 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
