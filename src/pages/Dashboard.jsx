import React, { useState } from 'react';
import { Plus, Trash2, Zap, Clock, Brain, MessageSquare } from 'lucide-react';

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

  return (
    <div className="flex-grow flex flex-col items-center justify-center fade-in overflow-hidden">
      
      {/* LAYER 1: CORE FOCUS */}
      <section className="layer-1 w-full">
        <div className="mission-label">Primary Directive</div>
        <input
          type="text"
          maxLength={120}
          placeholder="ENTER MAIN MISSION..."
          className="mission-input"
          value={data.mainMission}
          onChange={(e) => handleUpdate('mainMission', e.target.value)}
        />
      </section>

      {/* LAYER 2: SUPPORT SYSTEM */}
      <section className="layer-2 w-full space-y-12">
        {/* Support Stats Line */}
        <div className="flex justify-center gap-12 text-[10px] font-black tracking-[0.3em] text-[#333]">
          <div className="flex items-center gap-3 group">
            <span className="group-hover:text-[#00FF99] transition-colors">STREAK</span>
            <span className="streak-badge">{data.streak}</span>
          </div>
          <div className="flex items-center gap-3 group">
            <span className="group-hover:text-[#00FF99] transition-colors">FOCUS</span>
            <span className="text-white font-black text-lg">{data.studyHours}h <span className="text-[#222]">{data.focusSessions}s</span></span>
          </div>
        </div>

        {/* Compact Tasks */}
        <div className="space-y-2 max-w-sm mx-auto">
          {data.secondaryTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`list-item w-full ${task.done ? 'done' : ''}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${task.done ? 'bg-[#222]' : 'bg-[#00FF99]'}`} />
              <span className="tracking-wide text-xs font-bold uppercase">{task.title}</span>
            </button>
          ))}
          {data.secondaryTasks.length < 5 && (
            <div className="flex items-center gap-3 pt-4 opacity-10 focus-within:opacity-100 transition-opacity">
              <Plus size={12} className="text-white" />
              <input
                placeholder="SUB_TASK..."
                className="text-[10px] font-bold uppercase tracking-widest w-full"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
            </div>
          )}
        </div>
      </section>

      {/* LAYER 3: AMBIENT SYSTEM */}
      <section className="layer-3">
        <div className="ambient-data group cursor-pointer">
          <Brain size={12} />
          <span>{data.mood || 'STABLE'}</span>
          <div className="absolute bottom-full mb-4 opacity-0 group-hover:opacity-100 transition-all bg-black p-4 border border-white/5 space-x-4 flex">
            {['Focused', 'Normal', 'Tired', 'Distracted'].map(m => (
              <button key={m} onClick={() => handleUpdate('mood', m)} className={`text-[8px] font-black ${data.mood === m ? 'text-[#00FF99]' : 'text-[#444]'}`}>{m.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <div className="ambient-data group cursor-pointer max-w-[200px] truncate">
          <MessageSquare size={12} />
          <span>{data.dailyNote || 'NO LOGS'}</span>
          <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-80 opacity-0 group-hover:opacity-100 transition-all bg-black p-6 border border-white/5">
            <textarea
              className="w-full h-32 text-[10px] font-bold uppercase tracking-widest text-[#666] leading-relaxed"
              value={data.dailyNote}
              onChange={(e) => handleUpdate('dailyNote', e.target.value)}
              placeholder="ENTER SYSTEM LOG..."
            />
          </div>
        </div>
        <div className="ambient-data">
          <Clock size={12} />
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
