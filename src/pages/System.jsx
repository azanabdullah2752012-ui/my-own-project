import React from 'react';
import { Sunrise, BookOpen, Sunset, Clock, Play, CheckCircle } from 'lucide-react';

const System = ({ data, update }) => {
  const handleUpdate = (block, field, value) => {
    update({
      ...data,
      [block]: { ...data[block], [field]: value }
    });
  };

  return (
    <div className="space-y-8 fade-in">
      <header className="mb-12">
        <h2 className="text-3xl font-black tracking-tight mb-2">Protocol Configuration</h2>
        <p className="text-secondary text-sm font-medium">Daily operational standards and cognitive engine settings.</p>
      </header>

      <div className="grid grid-cols-2 gap-8">
        {/* AM PROTOCOL */}
        <section className="card">
          <div className="card-header border-b border-white/5 pb-4">
            <h3 className="card-title flex items-center gap-2">
              <Sunrise size={18} className="text-orange-500" />
              AM Protocol
            </h3>
          </div>
          <div className="pt-8 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 rounded-3xl bg-panel-hover">
                <label className="text-[10px] text-dim font-black uppercase tracking-widest block mb-4">Wake_Target</label>
                <input 
                  type="time" 
                  className="bg-transparent border-none p-0 text-4xl font-black text-white focus:ring-0" 
                  value={data.morning.wakeTime}
                  onChange={(e) => handleUpdate('morning', 'wakeTime', e.target.value)}
                />
              </div>
              <div className="p-6 rounded-3xl bg-panel-hover">
                <label className="text-[10px] text-dim font-black uppercase tracking-widest block mb-4">Prime_Directive</label>
                <input 
                  className="bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 w-full" 
                  value={data.morning.firstAction}
                  onChange={(e) => handleUpdate('morning', 'firstAction', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-panel-hover rounded-3xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${data.morning.phoneUsage ? 'bg-green-500 shadow-[0_0_10px_#34C759]' : 'bg-dim'}`} />
                <span className="text-sm font-bold">Electronic Blockade Active</span>
              </div>
              <button 
                onClick={() => handleUpdate('morning', 'phoneUsage', !data.morning.phoneUsage)}
                className={`btn-primary px-6 py-2 text-[10px] ${data.morning.phoneUsage ? '' : 'bg-dim shadow-none'}`}
              >
                {data.morning.phoneUsage ? 'DEACTIVATE' : 'ACTIVATE'}
              </button>
            </div>
          </div>
        </section>

        {/* COGNITIVE SYSTEM */}
        <section className="card">
          <div className="card-header border-b border-white/5 pb-4">
            <h3 className="card-title flex items-center gap-2">
              <BookOpen size={18} className="text-blue-500" />
              Cognitive Engine
            </h3>
          </div>
          <div className="pt-8 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <label className="text-[10px] text-dim font-black uppercase tracking-widest block">Unit_Duration</label>
              <div className="flex flex-col gap-3">
                {[25, 45, 60].map(m => (
                  <button 
                    key={m}
                    onClick={() => handleUpdate('study', 'sessionLength', m)}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${data.study.sessionLength === m ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 bg-panel-hover text-dim hover:text-white'}`}
                  >
                    <span className="text-xl font-black">{m}</span>
                    <span className="text-[10px] font-bold">MINS</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="p-8 bg-sidebar border border-white/5 rounded-3xl text-center">
                <label className="text-[10px] text-dim font-black uppercase tracking-widest block mb-4">Daily_Target</label>
                <input 
                  type="number" 
                  className="bg-transparent border-none p-0 text-6xl font-black text-center w-full focus:ring-0" 
                  value={data.study.sessionsPerDay}
                  onChange={(e) => handleUpdate('study', 'sessionsPerDay', parseInt(e.target.value) || 0)}
                />
                <div className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-4">Operational Units</div>
              </div>
              <button className="btn-primary w-full py-4 mt-6 flex items-center justify-center gap-2">
                <Play size={16} /> Start Session
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* PM PROTOCOL */}
      <section className="card">
        <div className="card-header border-b border-white/5 pb-4">
          <h3 className="card-title flex items-center gap-2">
            <Sunset size={18} className="text-orange-500" />
            PM Protocol / Success Verification
          </h3>
        </div>
        <div className="pt-8 grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            <label className="text-[10px] text-dim font-black uppercase tracking-widest block">Daily_Debrief</label>
            <textarea 
              className="w-full bg-panel-hover border-none p-6 rounded-3xl text-sm font-medium text-white min-h-[160px] focus:ring-1 focus:ring-blue-500/30 transition-all"
              placeholder="Log your operational failures and successes..."
              value={data.night.reflection}
              onChange={(e) => handleUpdate('night', 'reflection', e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <label className="text-[10px] text-dim font-black uppercase tracking-widest block">Cycle_Success</label>
              <button 
                onClick={() => handleUpdate('night', 'streakConfirmed', !data.night.streakConfirmed)}
                className={`w-full py-8 rounded-3xl font-black text-xs tracking-[0.4em] transition-all flex flex-col items-center gap-4 border ${data.night.streakConfirmed ? 'bg-green-500/10 border-green-500 text-green-500 shadow-[0_8px_30px_rgba(52,199,89,0.1)]' : 'bg-panel-hover border-white/5 text-dim hover:text-white'}`}
              >
                {data.night.streakConfirmed ? <CheckCircle size={32} /> : <div className="w-8 h-8 rounded-full border-2 border-dim" />}
                {data.night.streakConfirmed ? 'VERIFIED' : 'CONFIRM SUCCESS'}
              </button>
            </div>
            <button className="btn-primary w-full py-4 uppercase tracking-widest text-[10px]">Initialize Sleep Sequence</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default System;
