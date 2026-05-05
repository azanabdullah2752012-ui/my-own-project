import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Target, TrendingUp, Trophy, ChevronRight } from 'lucide-react';

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
      title: 'NEW_MISSION_OBJECTIVE',
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
      <section className="hud-panel">
        <div className="hud-header">
          <div className="hud-title"><Calendar size={12} /> Tactical Objectives (0–7 Days)</div>
        </div>
        <div className="hud-content">
          <div className="flex gap-2 mb-8">
            <input 
              placeholder="ENTER SHORT-TERM GOAL..." 
              className="flex-grow text-[10px] font-bold" 
              value={newShortGoal}
              onChange={(e) => setNewShortGoal(e.target.value)}
            />
            <input 
              type="date" 
              className="w-40 text-[10px] font-bold" 
              value={newShortDeadline}
              onChange={(e) => setNewShortDeadline(e.target.value)}
            />
            <button onClick={addShortGoal} className="btn-terminal px-6">ADD_OBJECTIVE</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.shortTerm.map(goal => (
              <div key={goal.id} className="flex items-center justify-between p-3 border border-[#1A1A1A] bg-black group hover:border-[#00FF99]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => toggleShortGoal(goal.id)}
                    className={`w-4 h-4 border flex items-center justify-center cursor-pointer ${goal.done ? 'bg-[#00FF99] border-[#00FF99]' : 'border-[#333]'}`}
                  >
                    {goal.done && <ChevronRight size={12} className="text-black" />}
                  </div>
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${goal.done ? 'text-[#333] line-through' : 'text-white'}`}>{goal.title}</div>
                    {goal.deadline && <div className="text-[8px] text-[#444] font-bold mt-0.5">ETA: {goal.deadline}</div>}
                  </div>
                </div>
                <button onClick={() => removeShortGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-[#333] hover:text-red-500 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MID TERM */}
      <section className="hud-panel">
        <div className="hud-header">
          <div className="hud-title"><TrendingUp size={12} /> Strategic Operations (1–12 Months)</div>
          <button onClick={addMidGoal} className="text-[8px] text-[#00FF99] font-bold hover:underline">+ NEW_DEPLOYMENT</button>
        </div>
        <div className="hud-content grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.midTerm.map(goal => (
            <div key={goal.id} className="p-4 border border-[#1A1A1A] bg-black space-y-4">
              <div className="flex justify-between items-start">
                <input 
                  className="bg-transparent border-none p-0 text-xs font-black w-full focus:ring-0 text-[#00FF99]" 
                  value={goal.title}
                  onChange={(e) => updateMidGoal(goal.id, 'title', e.target.value)}
                />
                <button onClick={() => removeMidGoal(goal.id)} className="text-[#333] hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] text-[#444] font-bold uppercase block mb-1">Sector</label>
                  <select 
                    className="w-full text-[8px] p-1 font-bold" 
                    value={goal.category}
                    onChange={(e) => updateMidGoal(goal.id, 'category', e.target.value)}
                  >
                    <option value="academics">ACADEMICS</option>
                    <option value="coding">CODING</option>
                    <option value="fitness">FITNESS</option>
                    <option value="personal">PERSONAL</option>
                  </select>
                </div>
                <div>
                  <label className="text-[8px] text-[#444] font-bold uppercase block mb-1">Completion: {goal.progress}%</label>
                  <div className="h-1 bg-[#1A1A1A] w-full mb-1">
                    <div className="h-full bg-[#00FF99]" style={{ width: `${goal.progress}%` }} />
                  </div>
                  <input 
                    type="range" 
                    className="w-full accent-[#00FF99] h-1" 
                    value={goal.progress}
                    onChange={(e) => updateMidGoal(goal.id, 'progress', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="text-[8px] text-[#444] font-bold uppercase block mb-1">Next Vector</label>
                <input 
                  placeholder="NEXT ACTION..." 
                  className="w-full text-[10px] font-bold" 
                  value={goal.nextAction}
                  onChange={(e) => updateMidGoal(goal.id, 'nextAction', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LONG TERM */}
      <section className="hud-panel">
        <div className="hud-header">
          <div className="hud-title"><Trophy size={12} /> Ultimate Vision (End Game)</div>
        </div>
        <div className="hud-content space-y-8">
          <div>
            <label className="text-[8px] text-[#444] font-bold uppercase block mb-2">Grand Strategy / Vision Statement</label>
            <textarea 
              className="w-full bg-black border-[#1A1A1A] p-4 text-lg font-black text-white italic"
              placeholder="ENTER THE VISION..."
              value={data.longTerm.vision}
              onChange={(e) => updateLongTerm('vision', e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[8px] text-[#444] font-bold uppercase">Critical Milestones</label>
              <button onClick={addMilestone} className="text-[8px] text-[#00FF99] font-bold hover:underline">+ ADD_MILESTONE</button>
            </div>
            <div className="space-y-4">
              {data.longTerm.milestones.map(m => (
                <div key={m.id} className="flex gap-4 items-center">
                  <div 
                    onClick={() => updateMilestone(m.id, 'done', !m.done)}
                    className={`w-4 h-4 border flex items-center justify-center cursor-pointer ${m.done ? 'bg-[#00FF99] border-[#00FF99]' : 'border-[#333]'}`}
                  >
                    {m.done && <ChevronRight size={12} className="text-black" />}
                  </div>
                  <input 
                    placeholder="ENTER MILESTONE..." 
                    className="flex-grow bg-transparent border-none border-b border-[#1A1A1A] rounded-none focus:border-[#00FF99] p-0 text-[10px] font-bold"
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
