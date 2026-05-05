import React from 'react';
import { Sunrise, BookOpen, Sunset, CheckCircle2 } from 'lucide-react';

const System = ({ data, update }) => {
  const handleUpdate = (block, field, value) => {
    update({
      ...data,
      [block]: { ...data[block], [field]: value }
    });
  };

  const toggleTomorrowTask = (index) => {
    const plan = [...data.night.tomorrowPlan];
    // This is a simple bullet list, so we'll just handle it as strings for now
    // or maybe the user wants checkboxes? The spec says "3 bullets max".
  };

  return (
    <div className="space-y-8">
      {/* MORNING BLOCK */}
      <section className="card border-t-4 border-yellow-500">
        <div className="flex items-center gap-3 mb-6">
          <Sunrise className="text-yellow-500" size={24} />
          <h2 className="text-xl font-bold uppercase tracking-tight">Morning Block</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs text-secondary uppercase font-bold mb-2 block">Wake Time</label>
            <input 
              type="time" 
              className="w-full" 
              value={data.morning.wakeTime}
              onChange={(e) => handleUpdate('morning', 'wakeTime', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-secondary uppercase font-bold mb-2 block">First Action (Immediate Execution)</label>
            <input 
              placeholder="e.g., Drink water + 10 pushups" 
              className="w-full" 
              value={data.morning.firstAction}
              onChange={(e) => handleUpdate('morning', 'firstAction', e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-[#333] md:col-span-3">
            <span className="font-medium">No Phone Rule (First 60 mins)</span>
            <button 
              onClick={() => handleUpdate('morning', 'phoneUsage', !data.morning.phoneUsage)}
              className={`w-14 h-8 rounded-full transition-all relative ${data.morning.phoneUsage ? 'bg-[#00FF99]' : 'bg-[#333]'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${data.morning.phoneUsage ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* STUDY STRUCTURE */}
      <section className="card border-t-4 border-[#00FF99]">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-[#00FF99]" size={24} />
          <h2 className="text-xl font-bold uppercase tracking-tight">Study Structure</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="text-xs text-secondary uppercase font-bold mb-2 block">Session Length</label>
            <div className="grid grid-cols-3 gap-2">
              {[25, 45, 60].map(m => (
                <button 
                  key={m}
                  onClick={() => handleUpdate('study', 'sessionLength', m)}
                  className={`py-2 rounded-lg border text-sm font-bold ${data.study.sessionLength === m ? 'border-[#00FF99] text-[#00FF99] bg-[#00FF99]/10' : 'border-[#333] text-secondary'}`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-secondary uppercase font-bold mb-2 block">Break Duration</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map(m => (
                <button 
                  key={m}
                  onClick={() => handleUpdate('study', 'breakDuration', m)}
                  className={`py-2 rounded-lg border text-sm font-bold ${data.study.breakDuration === m ? 'border-[#00FF99] text-[#00FF99] bg-[#00FF99]/10' : 'border-[#333] text-secondary'}`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-secondary uppercase font-bold mb-2 block">Sessions Per Day</label>
            <input 
              type="number" 
              className="w-full" 
              value={data.study.sessionsPerDay}
              onChange={(e) => handleUpdate('study', 'sessionsPerDay', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </section>

      {/* NIGHT BLOCK */}
      <section className="card border-t-4 border-indigo-500">
        <div className="flex items-center gap-3 mb-6">
          <Sunset className="text-indigo-500" size={24} />
          <h2 className="text-xl font-bold uppercase tracking-tight">Night Block</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-xs text-secondary uppercase font-bold mb-2 block">Daily Reflection: "What did I do today?"</label>
            <textarea 
              className="w-full bg-[#1A1A1A] border-[#333] p-4 rounded-xl min-h-[100px]"
              value={data.night.reflection}
              onChange={(e) => handleUpdate('night', 'reflection', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-secondary uppercase font-bold mb-2 block">Tomorrow's Plan (3 Bullets Max)</label>
            <div className="space-y-2">
              {[0, 1, 2].map(i => (
                <input 
                  key={i}
                  placeholder={`Plan #${i+1}`}
                  className="w-full"
                  value={data.night.tomorrowPlan[i] || ''}
                  onChange={(e) => {
                    const plan = [...data.night.tomorrowPlan];
                    plan[i] = e.target.value;
                    handleUpdate('night', 'tomorrowPlan', plan);
                  }}
                />
              ))}
            </div>
          </div>
          <button 
            onClick={() => handleUpdate('night', 'streakConfirmed', !data.night.streakConfirmed)}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${data.night.streakConfirmed ? 'bg-[#00FF99] text-[#000]' : 'bg-[#1A1A1A] border border-[#333] text-secondary'}`}
          >
            <CheckCircle2 size={24} />
            {data.night.streakConfirmed ? 'STREAK CONFIRMED' : 'CONFIRM DAILY STREAK'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default System;
