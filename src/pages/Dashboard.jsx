import React, { useState } from 'react';
import { Plus, Trash2, Brain, CheckCircle2, Circle, Zap, Activity, Shield, Clock } from 'lucide-react';

const Dashboard = ({ data, update }) => {
  const [newTask, setNewTask] = useState('');

  const handleUpdate = (field, value) => {
    update({ ...data, [field]: value });
  };

  const addTask = () => {
    if (newTask && data.secondaryTasks.length < 5) {
      handleUpdate('secondaryTasks', [...data.secondaryTasks, { id: crypto.randomUUID(), title: newTask, done: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    const tasks = data.secondaryTasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    handleUpdate('secondaryTasks', tasks);
  };

  const removeTask = (id) => {
    const tasks = data.secondaryTasks.filter(t => t.id !== id);
    handleUpdate('secondaryTasks', tasks);
  };

  const moods = [
    { label: 'Focused', icon: '🧠' },
    { label: 'Normal', icon: '😐' },
    { label: 'Tired', icon: '😴' },
    { label: 'Distracted', icon: '⚡' }
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Command Center</h2>
          <p className="text-secondary text-sm">System operational. All modules active.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-3">
            <Clock size={16} className="text-secondary" />
            <span className="text-sm font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </header>

      {/* TODAY'S MISSION */}
      <section className="glass-panel p-8 border-l-4 border-[#00FF99]">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} className="text-[#00FF99]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF99]">Today's Main Mission</span>
        </div>
        <input
          type="text"
          maxLength={120}
          placeholder="What is your primary focus today?"
          className="w-full text-4xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder:text-white/10"
          value={data.mainMission}
          onChange={(e) => handleUpdate('mainMission', e.target.value)}
        />
      </section>

      <div className="grid-cols">
        {/* TASK LIST */}
        <section className="glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest">Execution List</h3>
            <span className="text-[10px] font-bold text-secondary">{data.secondaryTasks.filter(t => t.done).length}/{data.secondaryTasks.length}</span>
          </div>
          <div className="space-y-3 flex-grow">
            {data.secondaryTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between group">
                <button onClick={() => toggleTask(task.id)} className="flex items-center gap-3 flex-grow text-left">
                  {task.done ? <CheckCircle2 size={18} className="text-[#00FF99]" /> : <Circle size={18} className="text-white/20" />}
                  <span className={`text-sm ${task.done ? 'line-through text-secondary' : 'text-white'}`}>{task.title}</span>
                </button>
                <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-opacity">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {data.secondaryTasks.length < 5 && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                <input
                  type="text"
                  placeholder="Add secondary task..."
                  className="flex-grow bg-transparent border-none p-0 text-sm focus:ring-0"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />
                <button onClick={addTask} className="text-[#00FF99]"><Plus size={18} /></button>
              </div>
            )}
          </div>
        </section>

        {/* STATS */}
        <section className="glass-panel p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Core Metrics</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg"><Activity size={16} className="text-[#00FF99]" /></div>
                <span className="text-sm font-medium text-secondary">Study Hours</span>
              </div>
              <input
                type="number"
                className="w-16 bg-transparent border-none text-right font-bold text-lg p-0"
                value={data.studyHours}
                onChange={(e) => handleUpdate('studyHours', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg"><Brain size={16} className="text-[#00FF99]" /></div>
                <span className="text-sm font-medium text-secondary">Focus Sessions</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleUpdate('focusSessions', Math.max(0, data.focusSessions - 1))} className="text-secondary">-</button>
                <span className="font-bold">{data.focusSessions}</span>
                <button onClick={() => handleUpdate('focusSessions', data.focusSessions + 1)} className="text-[#00FF99]">+</button>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
              <span className="text-sm font-medium text-secondary">Current Streak</span>
              <div className="badge badge-green">{data.streak} DAYS</div>
            </div>
          </div>
        </section>

        {/* MOOD */}
        <section className="glass-panel p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Current State</h3>
          <div className="flex justify-between">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => handleUpdate('mood', m.label)}
                className={`mood-icon ${data.mood === m.label ? 'active' : ''}`}
                title={m.label}
              >
                {m.icon}
              </button>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Daily Buffer</h3>
            <textarea
              className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 min-h-[80px] resize-none"
              placeholder="What's in your head today?"
              maxLength={500}
              value={data.dailyNote}
              onChange={(e) => handleUpdate('dailyNote', e.target.value)}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
