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
      title: 'New Mid Term Goal',
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

  return (
    <div className="space-y-12">
      {/* SHORT TERM */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-[#00FF99]" size={24} />
          <h2 className="text-xl font-bold">SHORT TERM (0–7 days)</h2>
        </div>
        <div className="card space-y-4">
          <div className="flex gap-4 mb-6">
            <input 
              placeholder="Goal title..." 
              className="flex-grow" 
              value={newShortGoal}
              onChange={(e) => setNewShortGoal(e.target.value)}
            />
            <input 
              type="date" 
              className="w-48" 
              value={newShortDeadline}
              onChange={(e) => setNewShortDeadline(e.target.value)}
            />
            <button onClick={addShortGoal} className="btn-primary flex items-center gap-2 px-6">
              <Plus size={20} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {data.shortTerm.map(goal => (
              <div key={goal.id} className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-xl border border-[#333] group">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={goal.done} 
                    onChange={() => toggleShortGoal(goal.id)}
                    className="w-5 h-5 accent-[#00FF99]"
                  />
                  <div>
                    <div className={goal.done ? 'line-through text-secondary' : 'text-white font-medium'}>{goal.title}</div>
                    {goal.deadline && <div className="text-[10px] text-secondary uppercase">Deadline: {goal.deadline}</div>}
                  </div>
                </div>
                <button onClick={() => removeShortGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-[#333] hover:text-red-500 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MID TERM */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-[#00FF99]" size={24} />
          <h2 className="text-xl font-bold">MID TERM (1–12 months)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.midTerm.map(goal => (
            <div key={goal.id} className="card border-l-2 border-[#00FF99] space-y-4">
              <div className="flex justify-between items-start">
                <input 
                  className="bg-transparent border-none p-0 text-lg font-bold w-full focus:ring-0" 
                  value={goal.title}
                  onChange={(e) => updateMidGoal(goal.id, 'title', e.target.value)}
                />
                <button onClick={() => removeMidGoal(goal.id)} className="text-[#333] hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-secondary uppercase block mb-1">Category</label>
                  <select 
                    className="w-full text-xs p-2" 
                    value={goal.category}
                    onChange={(e) => updateMidGoal(goal.id, 'category', e.target.value)}
                  >
                    <option value="academics">Academics</option>
                    <option value="coding">Coding</option>
                    <option value="fitness">Fitness</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-secondary uppercase block mb-1">Progress: {goal.progress}%</label>
                  <input 
                    type="range" 
                    className="w-full accent-[#00FF99]" 
                    value={goal.progress}
                    onChange={(e) => updateMidGoal(goal.id, 'progress', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-secondary uppercase block mb-1">Next Action</label>
                <input 
                  placeholder="What is the next step?" 
                  className="w-full text-xs" 
                  value={goal.nextAction}
                  onChange={(e) => updateMidGoal(goal.id, 'nextAction', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button 
            onClick={addMidGoal}
            className="border-2 border-dashed border-[#333] rounded-xl flex flex-col items-center justify-center p-8 text-secondary hover:border-[#00FF99] hover:text-[#00FF99] transition-all"
          >
            <Plus size={32} className="mb-2" />
            <span className="font-bold">Add Mid-Term Goal</span>
          </button>
        </div>
      </section>

      {/* LONG TERM */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="text-[#00FF99]" size={24} />
          <h2 className="text-xl font-bold">LONG TERM (1–10 years)</h2>
        </div>
        <div className="card space-y-6">
          <div>
            <label className="text-secondary uppercase text-xs font-bold tracking-widest mb-2 block">Vision Statement</label>
            <textarea 
              className="w-full bg-[#1A1A1A] border-[#333] p-4 rounded-xl text-lg font-medium"
              placeholder="What is your ultimate vision?"
              value={data.longTerm.vision}
              onChange={(e) => updateLongTerm('vision', e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-secondary uppercase text-xs font-bold tracking-widest">Milestones</label>
              <button onClick={addMilestone} className="text-xs text-[#00FF99] hover:underline flex items-center gap-1">
                <Plus size={14} /> Add Milestone
              </button>
            </div>
            <div className="space-y-3">
              {data.longTerm.milestones.map(m => (
                <div key={m.id} className="flex gap-4 items-center">
                  <input 
                    type="checkbox" 
                    checked={m.done} 
                    onChange={() => updateMilestone(m.id, 'done', !m.done)}
                    className="w-5 h-5 accent-[#00FF99]"
                  />
                  <input 
                    placeholder="Describe milestone..." 
                    className="flex-grow bg-transparent border-b border-[#333] rounded-none focus:border-[#00FF99] p-1"
                    value={m.title}
                    onChange={(e) => updateMilestone(m.id, 'title', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Goals;
