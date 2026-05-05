import React from 'react';
import { Target, TrendingUp, Trophy, ChevronRight, MoreVertical } from 'lucide-react';

const Goals = ({ data, update }) => {
  return (
    <div className="space-y-8 fade-in">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Objectives</h2>
          <p className="text-secondary text-sm font-medium">Strategic alignment and tactical execution across the empire.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Target size={16} /> Define New Goal
        </button>
      </header>

      <div className="grid grid-cols-3 gap-8">
        {/* SHORT TERM */}
        <section className="card">
          <div className="card-header border-b border-white/5 pb-4">
            <h3 className="card-title flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              Tactical (0-7 Days)
            </h3>
            <MoreVertical size={16} className="text-dim" />
          </div>
          <div className="space-y-4 pt-6">
            {data.shortTerm.map(goal => (
              <div key={goal.id} className="p-4 rounded-2xl bg-panel-hover group hover:bg-panel transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-bold ${goal.done ? 'text-dim line-through' : 'text-white'}`}>{goal.title}</span>
                  <div className={`w-2 h-2 rounded-full mt-1 ${goal.done ? 'bg-green-500' : 'bg-dim'}`} />
                </div>
                {goal.deadline && <div className="text-[10px] text-dim font-black uppercase tracking-widest">{goal.deadline}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* MID TERM */}
        <section className="card">
          <div className="card-header border-b border-white/5 pb-4">
            <h3 className="card-title flex items-center gap-2">
              <Layers size={18} className="text-green-500" />
              Strategic (1-12 Months)
            </h3>
            <MoreVertical size={16} className="text-dim" />
          </div>
          <div className="space-y-6 pt-6">
            {data.midTerm.map(goal => (
              <div key={goal.id} className="p-6 rounded-2xl bg-panel-hover">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold text-white uppercase tracking-tight">{goal.title}</span>
                  <span className="text-[11px] font-black text-blue-500">{goal.progress}%</span>
                </div>
                <div className="h-2 w-full bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-dim font-black uppercase tracking-widest">
                  <ChevronRight size={12} className="text-blue-500" />
                  Next: {goal.nextAction || 'Initialize'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LONG TERM */}
        <section className="card bg-sidebar border border-white/5">
          <div className="card-header border-b border-white/5 pb-4">
            <h3 className="card-title flex items-center gap-2">
              <Trophy size={18} className="text-orange-500" />
              Ultimate Vision
            </h3>
          </div>
          <div className="py-12 px-6 text-center">
            <div className="text-3xl font-black italic text-white/10 group-hover:text-white transition-all duration-700 leading-tight">
              "{data.longTerm.vision}"
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 space-y-4">
            <h4 className="text-[10px] text-dim font-black uppercase tracking-[0.2em]">Core Milestones</h4>
            {data.longTerm.milestones.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-panel-hover">
                <div className={`w-1.5 h-1.5 rounded-full ${m.done ? 'bg-green-500' : 'bg-dim'}`} />
                <span className={`text-[11px] font-bold ${m.done ? 'text-dim' : 'text-white'}`}>{m.title}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Goals;
