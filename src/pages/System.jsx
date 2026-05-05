import React from 'react';
import { Sunrise, BookOpen, Sunset, Clock, Play } from 'lucide-react';

const System = ({ data, update }) => {
  const handleUpdate = (block, field, value) => {
    update({
      ...data,
      [block]: { ...data[block], [field]: value }
    });
  };

  return (
    <div className="bento-grid fade-in">
      {/* MORNING PROTOCOL */}
      <section className="bento-card col-span-6 row-span-2 space-y-8">
        <div className="flex items-center gap-3">
          <Sunrise className="text-[#00FF99]" size={20} />
          <h3 className="card-title mb-0">AM_Protocol</h3>
        </div>
        
        <div className="space-y-12">
          <div className="flex items-end justify-between border-b border-white/5 pb-8">
            <div>
              <label className="text-[10px] text-[#444] font-black uppercase tracking-widest block mb-2">Wake_Target</label>
              <input 
                type="time" 
                className="bg-transparent border-none p-0 text-5xl font-black text-white focus:ring-0" 
                value={data.morning.wakeTime}
                onChange={(e) => handleUpdate('morning', 'wakeTime', e.target.value)}
              />
            </div>
            <div className="text-right">
              <label className="text-[10px] text-[#444] font-black uppercase tracking-widest block mb-2">First_Action</label>
              <input 
                className="bg-transparent border-none p-0 text-sm font-bold text-white text-right focus:ring-0" 
                value={data.morning.firstAction}
                onChange={(e) => handleUpdate('morning', 'firstAction', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${data.morning.phoneUsage ? 'bg-[#00FF99]' : 'bg-[#222]'}`} />
              <span className="text-sm font-bold">Signal Blockade</span>
            </div>
            <button 
              onClick={() => handleUpdate('morning', 'phoneUsage', !data.morning.phoneUsage)}
              className="btn-pill px-6 py-2 text-[10px]"
            >
              {data.morning.phoneUsage ? 'DEACTIVATE' : 'ACTIVATE'}
            </button>
          </div>
        </div>
      </section>

      {/* COGNITIVE SYSTEM */}
      <section className="bento-card col-span-6 row-span-2 space-y-8">
        <div className="flex items-center gap-3">
          <BookOpen className="text-[#00FF99]" size={20} />
          <h3 className="card-title mb-0">Cognitive Load System</h3>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <label className="text-[10px] text-[#444] font-black uppercase tracking-widest block">Unit_Length</label>
            <div className="flex flex-col gap-2">
              {[25, 45, 60].map(m => (
                <button 
                  key={m}
                  onClick={() => handleUpdate('study', 'sessionLength', m)}
                  className={`text-left p-4 rounded-2xl border transition-all ${data.study.sessionLength === m ? 'border-[#00FF99] bg-[#00FF99]/5 text-white' : 'border-white/5 text-[#444] hover:border-white/10'}`}
                >
                  <span className="text-2xl font-black">{m}</span>
                  <span className="text-[10px] ml-2">MINS</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <label className="text-[10px] text-[#444] font-black uppercase tracking-widest block">Daily_Intensity</label>
            <div className="p-8 bg-black border border-white/5 rounded-3xl text-center">
              <input 
                type="number" 
                className="bg-transparent border-none p-0 text-6xl font-black text-center w-full focus:ring-0" 
                value={data.study.sessionsPerDay}
                onChange={(e) => handleUpdate('study', 'sessionsPerDay', parseInt(e.target.value) || 0)}
              />
              <div className="text-[8px] text-[#222] font-black uppercase tracking-widest mt-2">UNITS_TARGET</div>
            </div>
          </div>
        </div>
      </section>

      {/* PM PROTOCOL */}
      <section className="bento-card col-span-12">
        <div className="flex items-center gap-3 mb-8">
          <Sunset className="text-[#00FF99]" size={20} />
          <h3 className="card-title mb-0">PM_Protocol / Termination</h3>
        </div>
        <div className="grid grid-cols-2 gap-12">
          <textarea 
            className="w-full bg-white/5 border-none p-6 rounded-3xl text-sm font-bold text-[#444] focus:text-white min-h-[150px] focus:ring-0 transition-all"
            placeholder="DAILY_DEBRIEF..."
            value={data.night.reflection}
            onChange={(e) => handleUpdate('night', 'reflection', e.target.value)}
          />
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-[10px] text-[#222] font-black uppercase tracking-widest">Future_Vector</div>
              {data.night.tomorrowPlan.slice(0, 3).map((p, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="text-[10px] font-black text-[#00FF99]">0{i+1}</div>
                  <input 
                    className="bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 w-full"
                    value={p}
                    onChange={(e) => {
                      const plan = [...data.night.tomorrowPlan];
                      plan[i] = e.target.value;
                      handleUpdate('night', 'tomorrowPlan', plan);
                    }}
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={() => handleUpdate('night', 'streakConfirmed', !data.night.streakConfirmed)}
              className={`w-full py-6 rounded-3xl font-black text-xs tracking-[0.5em] transition-all flex items-center justify-center gap-4 ${data.night.streakConfirmed ? 'bg-[#00FF99] text-black shadow-[0_0_30px_rgba(0,255,153,0.3)]' : 'bg-white/5 text-[#222] hover:bg-white/10'}`}
            >
              {data.night.streakConfirmed ? 'CYCLE_SUCCESS_VERIFIED' : 'CONFIRM_CYCLE_SUCCESS'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default System;
