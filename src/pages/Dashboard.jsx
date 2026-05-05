import React, { useState } from 'react';
import { Plus, Trash2, Brain, CheckCircle2, Circle, Activity, Shield, Clock, Zap } from 'lucide-react';

const Dashboard = ({ data, update }) => {
  const [newTask, setNewTask] = useState('');

  const handleUpdate = (field, value) => {
    update({ ...data, [field]: value });
  };

  const addTask = () => {
    if (newTask && data.secondaryTasks.length < 3) {
      handleUpdate('secondaryTasks', [...data.secondaryTasks, { id: crypto.randomUUID(), title: newTask, done: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (index) => {
    const tasks = [...data.secondaryTasks];
    tasks[index].done = !tasks[index].done;
    handleUpdate('secondaryTasks', tasks);
  };

  const removeTask = (index) => {
    const tasks = data.secondaryTasks.filter((_, i) => i !== index);
    handleUpdate('secondaryTasks', tasks);
  };

  const moods = ['Focused 🧠', 'Normal 😐', 'Tired 😴', 'Distracted ⚡'];

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* SYSTEM STATUS BAR */}
      <div className="col-span-12 flex gap-4 mb-4">
        <div className="hud-panel flex-grow p-2 px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-[#00FF99]" />
              <span className="text-[10px] text-[#444] font-bold uppercase tracking-widest">Neural Link:</span>
              <span className="text-[10px] text-[#00FF99] font-bold">STABLE</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-[#00FF99]" />
              <span className="text-[10px] text-[#444] font-bold uppercase tracking-widest">Auth:</span>
              <span className="text-[10px] text-[#00FF99] font-bold">LEVEL_01</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-[#444]" />
            <span className="text-[10px] text-[#444] font-mono">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* MAIN MISSION */}
      <section className="col-span-12 md:col-span-8 hud-panel">
        <div className="hud-header">
          <div className="hud-title"><Zap size={14} /> Critical Objective</div>
          <div className="text-[8px] text-[#444] font-bold">ID: MISSION_CONTROL_001</div>
        </div>
        <div className="hud-content">
          <input
            type="text"
            maxLength={120}
            placeholder="ENTER PRIMARY DIRECTIVE..."
            className="w-full text-3xl font-black bg-transparent border-none p-0 focus:ring-0 placeholder:text-[#1A1A1A] text-[#00FF99]"
            value={data.mainMission}
            onChange={(e) => handleUpdate('mainMission', e.target.value)}
          />
        </div>
      </section>

      {/* STREAK */}
      <section className="col-span-12 md:col-span-4 hud-panel">
        <div className="hud-header">
          <div className="hud-title">Discipline Streak</div>
        </div>
        <div className="hud-content flex items-center justify-between">
          <div>
            <div className="text-5xl font-black text-[#00FF99] leading-none">{data.streak.toString().padStart(2, '0')}</div>
            <div className="text-[8px] text-[#444] font-bold uppercase mt-2">Consecutive Cycles</div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleUpdate('streak', data.streak + 1)} className="btn-terminal py-2 px-4">+1 CYCLE</button>
            <button onDoubleClick={() => handleUpdate('streak', 0)} className="text-[8px] text-[#333] hover:text-red-500 font-bold uppercase text-right">Reset_Core</button>
          </div>
        </div>
      </section>

      {/* SECONDARY TASKS */}
      <section className="col-span-12 md:col-span-6 hud-panel">
        <div className="hud-header">
          <div className="hud-title">Sub-Tasks Matrix</div>
          <div className="text-[8px] text-[#444] font-bold">LOADED: {data.secondaryTasks.length}/03</div>
        </div>
        <div className="hud-content">
          <div className="space-y-3 mb-6">
            {data.secondaryTasks.map((task, i) => (
              <div key={i} className="flex items-center justify-between group p-2 border-l-2 border-[#1A1A1A] hover:border-[#00FF99] hover:bg-[#00FF99]/5 transition-all">
                <button onClick={() => toggleTask(i)} className="flex items-center gap-4 flex-grow text-left">
                  {task.done ? <CheckCircle2 size={16} className="text-[#00FF99]" /> : <Circle size={16} className="text-[#333]" />}
                  <span className={`text-xs font-bold uppercase tracking-wide ${task.done ? 'text-[#333] line-through' : 'text-white'}`}>{task.title}</span>
                </button>
                <button onClick={() => removeTask(i)} className="opacity-0 group-hover:opacity-100 text-[#333] hover:text-red-500 transition-opacity">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          {data.secondaryTasks.length < 3 && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ADD SUB-TASK..."
                className="flex-grow text-[10px]"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <button onClick={addTask} className="btn-terminal py-1 px-4 text-xs">+</button>
            </div>
          )}
        </div>
      </section>

      {/* TRACKERS */}
      <section className="col-span-12 md:col-span-6 hud-panel">
        <div className="hud-header">
          <div className="hud-title">Resource Allocation</div>
        </div>
        <div className="hud-content space-y-6">
          <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-4">
            <div>
              <div className="text-[10px] text-white font-bold uppercase">Study Hours</div>
              <div className="text-[8px] text-[#444] font-bold uppercase">Manual Log / Today</div>
            </div>
            <input
              type="number"
              className="w-16 text-center text-lg font-black"
              value={data.studyHours}
              onChange={(e) => handleUpdate('studyHours', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[10px] text-white font-bold uppercase">Focus Sessions</div>
              <div className="text-[8px] text-[#444] font-bold uppercase">Pomodoro Units</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleUpdate('focusSessions', Math.max(0, data.focusSessions - 1))} className="btn-terminal p-1 px-3">-</button>
              <span className="font-black text-xl text-[#00FF99]">{data.focusSessions.toString().padStart(2, '0')}</span>
              <button onClick={() => handleUpdate('focusSessions', data.focusSessions + 1)} className="btn-terminal p-1 px-3">+</button>
            </div>
          </div>
        </div>
      </section>

      {/* MOOD & NOTES */}
      <section className="col-span-12 hud-panel">
        <div className="hud-header">
          <div className="hud-title">Psychological State & Log</div>
        </div>
        <div className="hud-content grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-[8px] text-[#444] font-bold uppercase block mb-4">Select Current State</label>
            <div className="grid grid-cols-2 gap-2">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => handleUpdate('mood', m)}
                  className={`py-2 px-3 text-[10px] font-bold uppercase border transition-all ${
                    data.mood === m 
                    ? 'border-[#00FF99] text-[#00FF99] bg-[#00FF99]/10 shadow-[0_0_10px_rgba(0,255,153,0.2)]' 
                    : 'border-[#1A1A1A] text-[#333] hover:border-[#444]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[8px] text-[#444] font-bold uppercase block mb-4">Neural Buffer (Daily Note)</label>
            <textarea
              className="w-full text-[10px] font-bold min-h-[100px] resize-none"
              placeholder="ENTER SYSTEM LOG..."
              maxLength={500}
              value={data.dailyNote}
              onChange={(e) => handleUpdate('dailyNote', e.target.value)}
            />
            <div className="text-right text-[8px] text-[#333] font-bold mt-1 tracking-widest">{data.dailyNote.length}/500_CHARS</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
