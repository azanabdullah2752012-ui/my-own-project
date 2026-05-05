import React, { useState } from 'react';
import { Plus, Trash2, Brain, CheckCircle2, Circle } from 'lucide-react';

const Dashboard = ({ data, update }) => {
  const [newTask, setNewTask] = useState('');

  const handleUpdate = (field, value) => {
    update({ ...data, [field]: value });
  };

  const addTask = () => {
    if (newTask && data.secondaryTasks.length < 3) {
      handleUpdate('secondaryTasks', [...data.secondaryTasks, { title: newTask, done: false }]);
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* TODAY'S FOCUS */}
      <section className="col-span-full card border-l-4 border-[#00FF99]">
        <h2 className="text-secondary uppercase text-xs font-bold tracking-widest mb-4 flex items-center gap-2">
          <Brain size={14} className="text-[#00FF99]" /> Main Mission
        </h2>
        <input
          type="text"
          maxLength={120}
          placeholder="What is your highest priority today?"
          className="w-full text-2xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder:text-[#333]"
          value={data.mainMission}
          onChange={(e) => handleUpdate('mainMission', e.target.value)}
        />
      </section>

      {/* SECONDARY TASKS */}
      <section className="card flex flex-col">
        <h2 className="text-secondary uppercase text-xs font-bold tracking-widest mb-4">Secondary Tasks ({data.secondaryTasks.length}/3)</h2>
        <div className="space-y-3 flex-grow">
          {data.secondaryTasks.map((task, i) => (
            <div key={i} className="flex items-center justify-between group p-2 rounded-lg hover:bg-white/5 transition-colors">
              <button onClick={() => toggleTask(i)} className="flex items-center gap-3 flex-grow text-left">
                {task.done ? <CheckCircle2 className="text-[#00FF99]" /> : <Circle className="text-[#333]" />}
                <span className={task.done ? 'line-through text-secondary' : 'text-white'}>{task.title}</span>
              </button>
              <button onClick={() => removeTask(i)} className="opacity-0 group-hover:opacity-100 text-[#333] hover:text-red-500 transition-opacity">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {data.secondaryTasks.length < 3 && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add secondary task..."
                className="flex-grow bg-[#1A1A1A] border-[#333] p-2 text-sm rounded-lg"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <button onClick={addTask} className="p-2 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#00FF99] transition-colors">
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* TIME TRACKER */}
      <section className="card">
        <h2 className="text-secondary uppercase text-xs font-bold tracking-widest mb-4">Time Tracker</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-secondary">Study Hours Today</span>
            <input
              type="number"
              className="w-20 text-center bg-[#1A1A1A] border-[#333] p-2 rounded-lg"
              value={data.studyHours}
              onChange={(e) => handleUpdate('studyHours', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Focus Sessions</span>
            <div className="flex items-center gap-3">
              <button onClick={() => handleUpdate('focusSessions', Math.max(0, data.focusSessions - 1))} className="p-1 px-3 bg-[#1A1A1A] border border-[#333] rounded-lg">-</button>
              <span className="font-bold text-xl">{data.focusSessions}</span>
              <button onClick={() => handleUpdate('focusSessions', data.focusSessions + 1)} className="p-1 px-3 bg-[#1A1A1A] border border-[#333] rounded-lg">+</button>
            </div>
          </div>
        </div>
      </section>

      {/* STREAK SYSTEM */}
      <section className="card">
        <h2 className="text-secondary uppercase text-xs font-bold tracking-widest mb-4">Streak System</h2>
        <div className="text-center py-4">
          <div className="text-5xl font-black text-[#00FF99] mb-2">{data.streak}</div>
          <div className="text-secondary text-sm mb-6 uppercase tracking-widest">Days Running</div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleUpdate('streak', data.streak + 1)}
              className="flex-grow btn-primary py-3 rounded-xl"
            >
              +1 Day Completed
            </button>
            <button 
              onDoubleClick={() => handleUpdate('streak', 0)}
              className="px-4 bg-[#1A1A1A] border border-[#333] rounded-xl text-[#333] hover:text-red-500 hover:border-red-500 transition-colors"
              title="Double click to reset"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* MOOD & DAILY NOTE */}
      <section className="card grid grid-cols-1 gap-6">
        <div>
          <h2 className="text-secondary uppercase text-xs font-bold tracking-widest mb-4">Mood Input</h2>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => handleUpdate('mood', m)}
                className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                  data.mood === m 
                  ? 'border-[#00FF99] bg-[#00FF99]/10 text-[#00FF99]' 
                  : 'border-[#333] text-secondary hover:border-white/20'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-secondary uppercase text-xs font-bold tracking-widest mb-4">Daily Note</h2>
          <textarea
            className="w-full bg-[#1A1A1A] border border-[#333] p-4 rounded-xl text-sm min-h-[100px] resize-none"
            placeholder="What's in your head?"
            maxLength={500}
            value={data.dailyNote}
            onChange={(e) => handleUpdate('dailyNote', e.target.value)}
          />
          <div className="text-right text-[10px] text-secondary mt-1">{data.dailyNote.length}/500</div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
