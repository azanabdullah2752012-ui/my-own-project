import React from 'react';
import { Sunrise, BookOpen, Sunset, Shield, Radio, Activity, CheckCircle } from 'lucide-react';

const System = ({ data, update }) => {
  const handleUpdate = (block, field, value) => {
    update({
      ...data,
      [block]: { ...data[block], [field]: value }
    });
  };

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-3xl font-bold">Protocol Engine</h2>
        <p className="text-secondary text-sm">Defining the daily operational parameters for peak performance.</p>
      </header>

      <div className="grid-cols">
        {/* MORNING PROTOCOL */}
        <section className="glass-panel p-8 space-y-8">
          <div className="flex items-center gap-3">
            <Sunrise className="text-[#00FF99]" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">AM_PROTOCOL / Initialization</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <div>
                <label className="text-[10px] text-secondary uppercase font-bold tracking-widest block mb-2">Wake Time</label>
                <input 
                  type="time" 
                  className="bg-transparent border-none p-0 text-3xl font-black text-[#00FF99]" 
                  value={data.morning.wakeTime}
                  onChange={(e) => handleUpdate('morning', 'wakeTime', e.target.value)}
                />
              </div>
              <div className="text-right">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-widest block mb-2">First Action</label>
                <input 
                  placeholder="Immediate directive..." 
                  className="bg-transparent border-none p-0 text-sm font-bold text-white text-right focus:ring-0" 
                  value={data.morning.firstAction}
                  onChange={(e) => handleUpdate('morning', 'firstAction', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <Radio size={16} className="text-[#00FF99]" />
                <span className="text-sm font-bold">Signal Blockade (No Phone)</span>
              </div>
              <button 
                onClick={() => handleUpdate('morning', 'phoneUsage', !data.morning.phoneUsage)}
                className={`w-12 h-6 rounded-full transition-all relative ${data.morning.phoneUsage ? 'bg-[#00FF99]' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.morning.phoneUsage ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] text-secondary uppercase font-bold tracking-widest">Core Checklist</h4>
              {['Drink 500ml Water', 'Sunlight exposure', 'Cold exposure', 'Movement'].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-bold text-white/40">
                  <div className="w-2 h-2 rounded-full border border-white/20" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COGNITIVE SYSTEM */}
        <section className="glass-panel p-8 space-y-8">
          <div className="flex items-center gap-3">
            <BookOpen className="text-[#00FF99]" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Cognitive Load System</h3>
          </div>

          <div className="space-y-10">
            <div>
              <label className="text-[10px] text-secondary uppercase font-bold tracking-widest block mb-4">Focus Duration</label>
              <div className="flex justify-between">
                {[25, 45, 60].map(m => (
                  <button 
                    key={m}
                    onClick={() => handleUpdate('study', 'sessionLength', m)}
                    className={`px-6 py-2 rounded-xl border text-sm font-bold transition-all ${data.study.sessionLength === m ? 'border-[#00FF99] text-[#00FF99] bg-[#00FF99]/5' : 'border-white/5 text-secondary hover:border-white/20'}`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-secondary uppercase font-bold tracking-widest block mb-4">Break Parameters</label>
              <div className="flex justify-between">
                {[5, 10, 15].map(m => (
                  <button 
                    key={m}
                    onClick={() => handleUpdate('study', 'breakDuration', m)}
                    className={`px-6 py-2 rounded-xl border text-sm font-bold transition-all ${data.study.breakDuration === m ? 'border-[#00FF99] text-[#00FF99] bg-[#00FF99]/5' : 'border-white/5 text-secondary hover:border-white/20'}`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl">
              <div>
                <div className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-1">Target Intensity</div>
                <div className="text-lg font-bold">{data.study.sessionsPerDay} Units / Day</div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                className="w-32 accent-[#00FF99]"
                value={data.study.sessionsPerDay}
                onChange={(e) => handleUpdate('study', 'sessionsPerDay', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </section>

        {/* NIGHT PROTOCOL */}
        <section className="glass-panel p-8 space-y-8">
          <div className="flex items-center gap-3">
            <Sunset className="text-[#00FF99]" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">PM_PROTOCOL / Termination</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] text-secondary uppercase font-bold tracking-widest block mb-3">Daily Reflection (Debrief)</label>
              <textarea 
                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl min-h-[100px] text-sm focus:ring-1 focus:ring-[#00FF99] transition-all"
                placeholder="What was learned in this cycle?"
                value={data.night.reflection}
                onChange={(e) => handleUpdate('night', 'reflection', e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] text-secondary uppercase font-bold tracking-widest block mb-3">Next Cycle Vector (3 Max)</label>
              <div className="space-y-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex gap-3 items-center">
                    <span className="text-[10px] font-bold text-[#00FF99] opacity-50">0{i+1}</span>
                    <input 
                      placeholder={`Tomorrow Plan ${i+1}`}
                      className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                      value={data.night.tomorrowPlan[i] || ''}
                      onChange={(e) => {
                        const plan = [...data.night.tomorrowPlan];
                        plan[i] = e.target.value;
                        handleUpdate('night', 'tomorrowPlan', plan);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => handleUpdate('night', 'streakConfirmed', !data.night.streakConfirmed)}
              className={`w-full py-4 rounded-2xl font-bold text-sm tracking-widest transition-all flex items-center justify-center gap-3 ${data.night.streakConfirmed ? 'bg-[#00FF99] text-black shadow-[0_0_20px_rgba(0,255,153,0.3)]' : 'bg-white/5 text-secondary hover:bg-white/10'}`}
            >
              {data.night.streakConfirmed && <CheckCircle size={18} />}
              {data.night.streakConfirmed ? 'CYCLE CONFIRMED' : 'INITIALIZE TERMINATION'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default System;
