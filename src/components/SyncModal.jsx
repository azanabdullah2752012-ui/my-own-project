import React, { useState } from 'react';
import { 
  Shield, Key, Cloud, Download, Upload, 
  X, CheckCircle2, AlertCircle, Loader2, Link2
} from 'lucide-react';
import { syncEmpireCloud } from '../services/sync';

const SyncModal = ({ data, onSync, onClose }) => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [msg, setMsg] = useState('');

  const handleConnect = async () => {
    if (password.length < 4) {
      setStatus('error');
      setMsg('Password must be at least 4 characters.');
      return;
    }
    
    setStatus('loading');
    setMsg('Connecting to Empire Cloud...');

    try {
      // Perform actual Supabase sync
      const syncedData = await syncEmpireCloud(password, data);
      
      setStatus('success');
      setMsg('Synchronized! Your data is now linked.');
      
      // Save password locally so we can push updates later
      localStorage.setItem('empire_sync_password', password);
      
      setTimeout(() => {
        onSync(syncedData);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMsg(err.message || 'Failed to connect. Is your URL configured?');
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(16px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div className="card" style={{ width:'100%', maxWidth:400, background:'var(--bg-sidebar)', border:'1px solid var(--border)', textAlign:'center', padding:32 }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(77,124,254,0.1)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <Cloud size={30} />
        </div>
        
        <h2 style={{ fontSize:20, fontWeight:900, marginBottom:8 }}>Empire Cloud Sync</h2>
        <p style={{ fontSize:12, color:'var(--text-dim)', marginBottom:24, lineHeight:1.6 }}>
          Choose any password. This acts as your <strong>private account key</strong>. Use the same password on any device to access your data instantly.
        </p>

        <div style={{ position:'relative', marginBottom:20 }}>
          <Key size={16} style={{ position:'absolute', left:14, top:14, color:'var(--text-dim)' }} />
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleConnect()}
            placeholder="Enter your small password..."
            style={{ width:'100%', background:'var(--bg-panel-hover)', border:'1px solid var(--border)', borderRadius:12, padding:'14px 14px 14px 44px', color:'#fff', fontSize:14, textAlign:'center', letterSpacing:'0.2em' }} 
          />
        </div>

        {status === 'error' && (
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'#FF3B30', fontSize:11, fontWeight:700, marginBottom:20, justifyContent:'center' }}>
            <AlertCircle size={14} /> {msg}
          </div>
        )}

        {status === 'success' && (
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'#34C759', fontSize:11, fontWeight:700, marginBottom:20, justifyContent:'center' }}>
            <CheckCircle2 size={14} /> {msg}
          </div>
        )}

        <button 
          onClick={handleConnect}
          disabled={status === 'loading'}
          className="btn-primary" 
          style={{ width:'100%', justifyContent:'center', padding:14, fontSize:14, fontWeight:800 }}>
          {status === 'loading' ? <Loader2 size={18} className="spin" /> : 'Connect & Sync'}
        </button>

        <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-dim)', fontSize:12, fontWeight:700, marginTop:20, cursor:'pointer' }}>
          Cancel
        </button>

        <div style={{ marginTop:24, paddingTop:24, borderTop:'1px solid var(--border)', fontSize:10, color:'var(--text-dim)', fontStyle:'italic' }}>
          💾 All data is backed up to your private cloud profile.
        </div>
      </div>
    </div>
  );
};

export default SyncModal;
