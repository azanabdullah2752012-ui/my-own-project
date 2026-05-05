import React from 'react';
import { Sunrise, BookOpen, Sunset, CheckCircle2, Shield, Radio, Activity } from 'lucide-react';

const System = ({ data, update }) => {
  const handleUpdate = (block, field, value) => {
    update({
      ...data,
      [block]: { ...data[block], [field]: value }
    });
  };

  return (
    <div className="space-y-8">
      {/* MORNING BLOCK */}
      <section className="hud-panel">
        <div className="hud-header">
          <div className="hud-title"><Sunrise size={12} /> AM_PROTOCOL / INITIALIZATION</div>
          <div className="text-[8px] text-[#444] font-bold">MODE: BOOT_UP</div>
        </div>
        <div className="hud-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="text-[8px] text-[#444] font-bold uppercase mb-2 block tracking-widest">Wake Time [UTC]</label>
              <input 
                type="time" 
                className="w-full text-lg font-black" 
                value={data.morning.wakeTime}
                onChange={(e) => handleUpdate('morning', 'wakeTime', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[8px] text-[#444] font-bold uppercase mb-2 block tracking-widest">Immediate Vector (First Action)</label>
              <input 
                placeholder="ENTER FIRST ACTION..." 
                className="w-full font-bold" 
                value={data.morning.firstAction}
                onChange={(e) => handleUpdate('morning', 'firstAction', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-black border border-[#1A1A1A] md:col-span-3">
              <div className="flex items-center gap-3">
                <Radio size={14} className="text-[#00FF99]" />
                <div>
                  <div className="text-[10px] text-white font-bold uppercase">Signal Blockade (No Phone)</div>
                  <div className="text-[8px] text-[#444] font-bold uppercase">First 60 Minutes of Cycle</div>
                </div>
              </div>
              <button 
                onClick={() => handleUpdate('morning', 'phoneUsage', !data.morning.phoneUsage)}
                className={`w-12 h-6 border transition-all relative ${data.morning.phoneUsage ? 'bg-[#00FF99]/20 border-[#00FF99]' : 'bg-black border-[#333]'}`}
              >
                <div className={`absolute top-1 w-3 h-3 transition-all ${data.morning.phoneUsage ? 'right-1 bg-[#00FF99]' : 'left-1 bg-[#333]'}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STUDY STRUCTURE */}
      <section className="hud-panel">
        <div className="hud-header">
          <div className="hud-title"><BookOpen size={12} /> COGNITIVE_LOAD / ENGINE</div>
          <div className="text-[8px] text-[#444] font-bold">STATUS: OPERATIONAL</div>
        </div>
        <div className="hud-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <label className="text-[8px] text-[#444] font-bold uppercase mb-4 block tracking-widest">Cycle Duration</label>
              <div className="space-y-2">
                {[25, 45, 60].map(m => (
                  <button 
                    key={m}
                    onClick={() => handleUpdate('study', 'sessionLength', m)}
                    className={`w-full py-2 border text-[10px] font-black tracking-widest ${data.study.sessionLength === m ? 'border-[#00FF99] text-[#00FF99] bg-[#00FF99]/10 shadow-[0_0_10px_rgba(0,255,153,0.1)]' : 'border-[#1A1A1A] text-[#333] hover:border-[#444]'}`}
                  >
                    {m} MINUTES
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[8px] text-[#444] font-bold uppercase mb-4 block tracking-widest">Cool-Down Period</label>
              <div className="space-y-2">
                {[5, 10, 15].map(m => (
                  <button 
                    key={m}
                    onClick={() => handleUpdate('study', 'breakDuration', m)}
                    className={`w-full py-2 border text-[10px] font-black tracking-widest ${data.study.breakDuration === m ? 'border-[#00FF99] text-[#00FF99] bg-[#00FF99]/10 shadow-[0_0_10px_rgba(0,255,153,0.1)]' : 'border-[#1A1A1A] text-[#333] hover:border-[#444]'}`}
                  >
                    {m} MINUTES
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[8px] text-[#444] font-bold uppercase mb-4 block tracking-widest">Total Daily Units</label>
              <div className="p-6 bg-black border border-[#1A1A1A] text-center">
                <input 
                  type="number" 
                  className="w-full bg-transparent border-none text-4xl font-black text-center focus:ring-0" 
                  value={data.study.sessionsPerDay}
                  onChange={(e) => handleUpdate('study', 'sessionsPerDay', parseInt(e.target.value) || 0)}
                />
                <div className="text-[8px] text-[#444] font-bold uppercase mt-2 tracking-[0.3em]">Sessions_Target</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NIGHT BLOCK */}
      <section className="hud-panel">
        <div className="hud-header">
          <div className="hud-title"><Sunset size={12} /> PM_PROTOCOL / DEBRIEF</div>
          <div className="text-[8px] text-[#444] font-bold">MODE: SHUT_DOWN</div>
        </div>
        <div className="hud-content space-y-8">
          <div>
            <label className="text-[8px] text-[#444] font-bold uppercase mb-2 block tracking-widest">Mission Reflection (Debrief)</label>
            <textarea 
              className="w-full bg-black border-[#1A1A1A] p-4 min-h-[120px] text-[10px] font-bold"
              placeholder="ENTER DAILY DEBRIEF..."
              value={data.night.reflection}
              onChange={(e) => handleUpdate('night', 'reflection', e.target.value)}
            />
          </div>
          <div>
            <label className="text-[8px] text-[#444] font-bold uppercase mb-4 block tracking-widest">Future Vector (Next Cycle Plans)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex gap-2">
                  <div className="text-[10px] font-black text-[#00FF99] pt-2">0{i+1}.</div>
                  <input 
                    placeholder={`PLAN_${i+1}`}
                    className="w-full font-bold"
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
            className={`w-full py-6 border-2 font-black tracking-[0.5em] transition-all flex items-center justify-center gap-4 ${data.night.streakConfirmed ? 'bg-[#00FF99] border-[#00FF99] text-black shadow-[0_0_30px_rgba(0,255,153,0.3)]' : 'bg-black border-[#1A1A1A] text-[#222] hover:text-[#444] hover:border-[#333]'}`}
          >
            {data.night.streakConfirmed ? <Activity size={24} /> : null}
            {data.night.streakConfirmed ? 'CYCLE_SUCCESS_CONFIRMED' : 'CONFIRM_CYCLE_SUCCESS'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default System;
