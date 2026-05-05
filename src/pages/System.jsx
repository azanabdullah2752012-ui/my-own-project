import React from 'react';
import { Sunrise, BookOpen, Sunset, CheckCircle, Circle, Play, Plus, Trash2 } from 'lucide-react';

const System = ({ data, update }) => {
  if (!data) return null;

  const patch = (block, field, value) =>
    update({ ...data, [block]: { ...data[block], [field]: value } });

  const tomorrow = data.night?.tomorrowPlan ?? [];
  const addTomorrow = () => {
    if (tomorrow.length >= 5) return;
    patch('night', 'tomorrowPlan', [...tomorrow, '']);
  };
  const updateTomorrow = (i, val) => {
    const plan = [...tomorrow];
    plan[i] = val;
    patch('night', 'tomorrowPlan', plan);
  };
  const deleteTomorrow = (i) => patch('night', 'tomorrowPlan', tomorrow.filter((_, idx) => idx !== i));

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Daily Protocol</div>
          <div className="page-subtitle">Configure your AM routine, study engine, and evening wind-down.</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {/* AM PROTOCOL */}
        <div className="card">
          <div className="section-header">
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
              <Sunrise size={16} color="#FF9500" /> AM Protocol
            </span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            <div style={{ background:'var(--bg-panel-hover)', borderRadius:12, padding:'14px 16px' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Wake Time</div>
              <input type="time" value={data.morning?.wakeTime || '06:00'} onChange={e => patch('morning','wakeTime',e.target.value)}
                style={{ background:'none', border:'none', fontSize:26, fontWeight:900, color:'#fff', width:'100%' }} />
            </div>
            <div style={{ background:'var(--bg-panel-hover)', borderRadius:12, padding:'14px 16px' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>First Action</div>
              <input value={data.morning?.firstAction || ''} onChange={e => patch('morning','firstAction',e.target.value)}
                placeholder="e.g. Drink water, stretch..." style={{ background:'none', border:'none', fontSize:13, fontWeight:600, color:'#fff', width:'100%' }} />
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', background:'var(--bg-panel-hover)', borderRadius:12, border:'1px solid var(--border)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background: data.morning?.phoneUsage ? '#34C759' : 'var(--text-dim)', boxShadow: data.morning?.phoneUsage ? '0 0 10px #34C759' : 'none', transition:'all 0.3s' }} />
              <span style={{ fontSize:13, fontWeight:600 }}>Electronic Blockade</span>
            </div>
            <button className="btn-primary" style={{ padding:'7px 16px', fontSize:12, background: data.morning?.phoneUsage ? '#34C759' : 'var(--accent)' }}
              onClick={() => patch('morning','phoneUsage',!data.morning?.phoneUsage)}>
              {data.morning?.phoneUsage ? 'Active ✓' : 'Activate'}
            </button>
          </div>
        </div>

        {/* COGNITIVE ENGINE */}
        <div className="card">
          <div className="section-header">
            <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
              <BookOpen size={16} color="#4D7CFE" /> Cognitive Engine
            </span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Session Length</div>
              {[25, 45, 60].map(m => (
                <button key={m} onClick={() => patch('study','sessionLength',m)}
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:'11px 14px', borderRadius:10, marginBottom:8, border: data.study?.sessionLength === m ? '1px solid #4D7CFE' : '1px solid var(--border)', background: data.study?.sessionLength === m ? 'rgba(77,124,254,0.1)' : 'var(--bg-panel-hover)', color: data.study?.sessionLength === m ? '#4D7CFE' : 'var(--text-secondary)', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>
                  <span style={{ fontSize:22, fontWeight:900 }}>{m}</span>
                  <span style={{ fontSize:11 }}>mins</span>
                </button>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ background:'var(--bg-sidebar)', border:'1px solid var(--border)', borderRadius:14, padding:'16px', textAlign:'center', flex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Daily Target</div>
                <input type="number" min={1} max={12} value={data.study?.sessionsPerDay ?? 4}
                  onChange={e => patch('study','sessionsPerDay',Math.max(1,parseInt(e.target.value)||1))}
                  style={{ background:'none', border:'none', fontSize:48, fontWeight:900, color:'#fff', textAlign:'center', width:'100%' }} />
                <div style={{ fontSize:11, color:'#4D7CFE', fontWeight:600, marginTop:4 }}>Sessions / Day</div>
              </div>
              <div style={{ background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Break Duration</div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <button onClick={() => patch('study','breakDuration',Math.max(1,(data.study?.breakDuration??5)-1))}
                    style={{ width:26, height:26, borderRadius:6, background:'var(--bg-panel)', border:'1px solid var(--border)', color:'#fff', cursor:'pointer', fontWeight:700 }}>−</button>
                  <span style={{ fontSize:18, fontWeight:800 }}>{data.study?.breakDuration ?? 5}<span style={{ fontSize:11, color:'var(--text-secondary)', marginLeft:4 }}>min</span></span>
                  <button onClick={() => patch('study','breakDuration',(data.study?.breakDuration??5)+1)}
                    style={{ width:26, height:26, borderRadius:6, background:'var(--bg-panel)', border:'1px solid var(--border)', color:'#fff', cursor:'pointer', fontWeight:700 }}>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PM PROTOCOL */}
      <div className="card">
        <div className="section-header">
          <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:14 }}>
            <Sunset size={16} color="#FF9500" /> PM Protocol
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:20 }}>
          {/* DAILY REFLECTION */}
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Daily Debrief</div>
            <textarea value={data.night?.reflection || ''} onChange={e => patch('night','reflection',e.target.value)}
              placeholder="What worked? What didn't? Key lessons..."
              style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:12, padding:'14px', fontSize:13, color:'#fff', minHeight:160, resize:'none', lineHeight:1.6 }} />
          </div>

          {/* TOMORROW'S PLAN */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Tomorrow's Plan</div>
              {tomorrow.length < 5 && (
                <button onClick={addTomorrow} style={{ background:'none', border:'none', color:'#4D7CFE', cursor:'pointer' }}><Plus size={14} /></button>
              )}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {tomorrow.map((p, i) => (
                <div key={i} style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <div style={{ fontSize:11, fontWeight:900, color:'#4D7CFE', width:16, textAlign:'center' }}>0{i+1}</div>
                  <input value={p} onChange={e => updateTomorrow(i, e.target.value)}
                    placeholder={`Priority ${i+1}...`}
                    style={{ flex:1, background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 10px', fontSize:12, color:'#fff' }} />
                  <button onClick={() => deleteTomorrow(i)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}><Trash2 size={12} /></button>
                </div>
              ))}
              {tomorrow.length === 0 && <div style={{ fontSize:12, color:'var(--text-dim)' }}>Click + to add priorities</div>}
            </div>
          </div>

          {/* STREAK CONFIRM */}
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:0 }}>Mark Complete</div>
            <button onClick={() => patch('night','streakConfirmed',!data.night?.streakConfirmed)}
              style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, borderRadius:16, border: data.night?.streakConfirmed ? '1px solid #34C759' : '1px solid var(--border)', background: data.night?.streakConfirmed ? 'rgba(52,199,89,0.08)' : 'var(--bg-panel-hover)', color: data.night?.streakConfirmed ? '#34C759' : 'var(--text-secondary)', fontWeight:700, fontSize:12, cursor:'pointer', padding:'20px', transition:'all 0.2s' }}>
              {data.night?.streakConfirmed ? <CheckCircle size={36} color="#34C759" /> : <Circle size={36} color="var(--text-dim)" />}
              <span>{data.night?.streakConfirmed ? 'Day Verified ✓' : 'Confirm Day Success'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default System;
