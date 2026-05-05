import React from 'react';

const Goals = ({ data, update }) => {
  const handleUpdate = (field, value) => {
    update({ ...data, [field]: value });
  };

  const updateMidGoal = (id, field, value) => {
    const goals = data.midTerm.map(g => g.id === id ? { ...g, [field]: value } : g);
    handleUpdate('midTerm', goals);
  };

  return (
    <div className="max-w-4xl mx-auto py-20 space-y-32 fade-in">
      {/* SECTOR: SHORT TERM */}
      <section className="opacity-40 hover:opacity-100 transition-opacity">
        <div className="text-[10px] font-black tracking-[0.5em] text-[#00FF99] mb-12 uppercase">Tactical_Objectives / 07_Days</div>
        <div className="space-y-8">
          {data.shortTerm.map(goal => (
            <div key={goal.id} className="flex items-center justify-between group">
              <span className={`text-xl font-bold tracking-tight ${goal.done ? 'text-[#111] line-through' : 'text-white'}`}>{goal.title}</span>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-[#222] uppercase tracking-widest">{goal.deadline || 'NO_DEADLINE'}</span>
                <div className={`w-2 h-2 rounded-full ${goal.done ? 'bg-[#00FF99]' : 'bg-[#111]'}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTOR: MID TERM */}
      <section className="opacity-40 hover:opacity-100 transition-opacity">
        <div className="text-[10px] font-black tracking-[0.5em] text-[#00FF99] mb-12 uppercase">Strategic_Vectors / 12_Months</div>
        <div className="space-y-16">
          {data.midTerm.map(goal => (
            <div key={goal.id} className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-black text-white">{goal.title}</span>
                <span className="text-sm font-black text-[#00FF99]">{goal.progress}%</span>
              </div>
              <div className="w-full h-px bg-white/5 relative">
                <div className="absolute top-0 left-0 h-full bg-[#00FF99] shadow-[0_0_10px_rgba(0,255,153,0.5)]" style={{ width: `${goal.progress}%` }} />
              </div>
              <div className="flex justify-between text-[8px] font-black text-[#222] uppercase tracking-widest">
                <span>Vector: {goal.nextAction || 'PENDING_ACTION'}</span>
                <span>Sector: {goal.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTOR: LONG TERM */}
      <section className="opacity-40 hover:opacity-100 transition-opacity text-center">
        <div className="text-[10px] font-black tracking-[0.5em] text-[#00FF99] mb-12 uppercase">Ultimate_Vision</div>
        <div className="text-5xl font-black italic text-white/10 hover:text-white transition-colors duration-1000 leading-tight cursor-default">
          {data.longTerm.vision || 'VISION_NOT_INITIALIZED'}
        </div>
      </section>
    </div>
  );
};

export default Goals;
