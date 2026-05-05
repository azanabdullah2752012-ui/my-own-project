import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Target, TrendingUp, Trophy } from 'lucide-react';

const Goals = ({ data, update }) => {
  const [newShortGoal, setNewShortGoal] = useState('');
  const [newShortDeadline, setNewShortDeadline] = useState('');

  const handleUpdate = (field, value) => {
    update({ ...data, [field]: value });
  };

  const addShortGoal = () => {
    if (newShortGoal) {
      const newGoal = {
        id: crypto.randomUUID(),
        title: newShortGoal,
        deadline: newShortDeadline,
        done: false
      };
      handleUpdate('shortTerm', [...data.shortTerm, newGoal]);
      setNewShortGoal('');
      setNewShortDeadline('');
    }
  };

  const toggleShortGoal = (id) => {
    const goals = data.shortTerm.map(g => g.id === id ? { ...g, done: !g.done } : g);
    handleUpdate('shortTerm', goals);
  };

  const removeShortGoal = (id) => {
    const goals = data.shortTerm.filter(g => g.id !== id);
    handleUpdate('shortTerm', goals);
  };

  const addMidGoal = () => {
    const newGoal = {
      id: crypto.randomUUID(),
      title: 'New Mission',
      category: 'personal',
      progress: 0,
      nextAction: ''
    };
    handleUpdate('midTerm', [...data.midTerm, newGoal]);
  };

  const updateMidGoal = (id, field, value) => {
    const goals = data.midTerm.map(g => g.id === id ? { ...g, [field]: value } : g);
    handleUpdate('midTerm', goals);
  };

  const removeMidGoal = (id) => {
    const goals = data.midTerm.filter(g => g.id !== id);
    handleUpdate('midTerm', goals);
  };

  const updateLongTerm = (field, value) => {
    handleUpdate('longTerm', { ...data.longTerm, [field]: value });
  };

  const addMilestone = () => {
    const newMilestone = { id: crypto.randomUUID(), title: '', done: false };
    updateLongTerm('milestones', [...data.longTerm.milestones, newMilestone]);
  };

  const updateMilestone = (id, field, value) => {
    const milestones = data.longTerm.milestones.map(m => m.id === id ? { ...m, [field]: value } : m);
    updateLongTerm('milestones', milestones);
  };

  const removeMilestone = (id) => {
    const milestones = data.longTerm.milestones.filter(m => m.id !== id);
    updateLongTerm('milestones', milestones);
  };

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-3xl font-bold">Strategic Objectives</h2>
        <p className="text-secondary text-sm">Long-term alignment and tactical execution.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* SHORT TERM */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Calendar className="text-[#00FF99]" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Short-Term (0-7 Days)</h3>
          </div>
          <div className="glass-panel p-6 space-y-4">
            <div className="space-y-2">
              <input 
                placeholder="New objective..." 
                className="w-full bg-transparent border-b border-white/5 rounded-none p-1 text-sm focus:border-[#00FF99]" 
                value={newShortGoal}
                onChange={(e) => setNewShortGoal(e.target.value)}
              />
              <div className="flex justify-between items-center pt-2">
                <input 
                  type="date" 
                  className="bg-transparent border-none p-0 text-[10px] font-bold text-secondary uppercase" 
                  value={newShortDeadline}
                  onChange={(e) => setNewShortDeadline(e.target.value)}
                />
                <button onClick={addShortGoal} className="text-[#00FF99] text-xs font-bold uppercase">Add</button>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-white/5">
              {data.shortTerm.map(goal => (
                <div key={goal.id} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${goal.done ? 'text-secondary line-through' : 'text-white'}`}>{goal.title}</span>
                    <button onClick={() => removeShortGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-red-500"><Trash2 size={12} /></button>
                  </div>
                  <div className="progress-container cursor-pointer" onClick={() => toggleShortGoal(goal.id)}>
                    <div className="progress-bar" style={{ width: goal.done ? '100%' : '0%' }} />
                  </div>
                  {goal.deadline && <span className="text-[10px] text-secondary mt-1 block uppercase font-bold">{goal.deadline}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MID TERM */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-[#00FF99]" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Mid-Term (1-12 Months)</h3>
          </div>
          <div className="space-y-4">
            {data.midTerm.map(goal => (
              <div key={goal.id} className="glass-panel p-6 space-y-4 group">
                <div className="flex justify-between items-start">
                  <input 
                    className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0" 
                    value={goal.title}
                    onChange={(e) => updateMidGoal(goal.id, 'title', e.target.value)}
                  />
                  <button onClick={() => removeMidGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-red-500"><Trash2 size={12} /></button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-secondary">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${goal.progress}%` }} />
                  </div>
                  <input 
                    type="range" 
                    className="w-full h-1 opacity-0 hover:opacity-100 transition-opacity accent-[#00FF99]" 
                    value={goal.progress}
                    onChange={(e) => updateMidGoal(goal.id, 'progress', parseInt(e.target.value))}
                  />
                </div>
                <div className="pt-2">
                  <span className="text-[10px] text-secondary uppercase font-bold block mb-1">Next Action</span>
                  <input 
                    className="w-full bg-transparent border-none p-0 text-xs font-medium focus:ring-0" 
                    value={goal.nextAction}
                    onChange={(e) => updateMidGoal(goal.id, 'nextAction', e.target.value)}
                    placeholder="Enter next vector..."
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={addMidGoal}
              className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-secondary hover:border-[#00FF99] hover:text-[#00FF99] transition-all text-xs font-bold uppercase"
            >
              + Add Strategic Goal
            </button>
          </div>
        </section>

        {/* LONG TERM */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Trophy className="text-[#00FF99]" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Long-Term (End-Game)</h3>
          </div>
          <div className="glass-panel p-8 space-y-8">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4">Core Vision</h4>
              <textarea 
                className="w-full bg-transparent border-none p-0 text-xl font-bold italic focus:ring-0 resize-none min-h-[100px]"
                placeholder="What is your ultimate end-state?"
                value={data.longTerm.vision}
                onChange={(e) => updateLongTerm('vision', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Milestones</h4>
                <button onClick={addMilestone} className="text-[#00FF99] text-[10px] font-bold uppercase">+ Add</button>
              </div>
              <div className="space-y-3">
                {data.longTerm.milestones.map(m => (
                  <div key={m.id} className="flex items-center gap-4 group">
                    <button onClick={() => updateMilestone(m.id, 'done', !m.done)}>
                      <div className={`w-3 h-3 rounded-full border ${m.done ? 'bg-[#00FF99] border-[#00FF99]' : 'border-white/20'}`} />
                    </button>
                    <input 
                      className={`flex-grow bg-transparent border-none p-0 text-xs font-medium focus:ring-0 ${m.done ? 'text-secondary line-through' : 'text-white'}`}
                      value={m.title}
                      onChange={(e) => updateMilestone(m.id, 'title', e.target.value)}
                      placeholder="Milestone..."
                    />
                    <button onClick={() => removeMilestone(m.id)} className="opacity-0 group-hover:opacity-100 text-red-500"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Goals;
