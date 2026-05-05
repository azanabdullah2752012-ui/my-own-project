import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Zap, Activity, Clock, ChevronRight, MoreHorizontal } from 'lucide-react';

const Dashboard = ({ data, update }) => {
  const [newTask, setNewTask] = useState('');

  const toggleTask = (id) => {
    const tasks = data.dashboard.secondaryTasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    update({ ...data, dashboard: { ...data.dashboard, secondaryTasks: tasks } });
  };

  return (
    <div className="dashboard-grid">
      {/* LEFT COLUMN */}
      <div>
        <section className="hero-banner">
          <div className="hero-text">
            <h1>Empower Your<br />Empire Journey!</h1>
            <p>Unlock your full potential with a structured execution system. Start now and elevate your output.</p>
            <button className="btn-primary">Initialize Mission</button>
          </div>
          <div className="relative w-64 h-64 bg-blue-600/10 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
            <Zap size={120} className="text-blue-500 relative z-10" />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-8">
          {/* ACTIVITY FEED */}
          <section>
            <div className="card-header">
              <h3 className="card-title">Activity</h3>
              <button className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">View All</button>
            </div>
            <div className="space-y-4">
              {data.dashboard.secondaryTasks.map(task => (
                <div key={task.id} className="card flex items-center justify-between p-4 mb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-panel-hover flex items-center justify-center">
                      <Activity size={18} className="text-secondary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{task.title}</div>
                      <div className="text-[10px] text-dim font-bold uppercase">System_Task</div>
                    </div>
                  </div>
                  <button onClick={() => toggleTask(task.id)}>
                    {task.done ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} className="text-dim" />}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ACTIVE MISSIONS (COURSES) */}
          <section>
            <div className="card-header">
              <h3 className="card-title">Active Missions</h3>
              <button className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">View All</button>
            </div>
            <div className="space-y-4">
              {data.projects.list.slice(0, 2).map(project => (
                <div key={project.id} className="card p-6 mb-0">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-bold mb-1">{project.name}</h4>
                      <div className="text-[10px] text-dim font-black uppercase tracking-widest">Mission_Unit</div>
                    </div>
                    <span className="badge bg-blue-500/10 text-blue-500">Active</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-dim">
                      <span>Deployment</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* RIGHT COLUMN: CALENDAR & STATS */}
      <div className="space-y-8">
        <section className="card bg-sidebar">
          <div className="card-header">
            <h3 className="card-title">February 2023</h3>
            <div className="flex gap-2">
              <button className="strip-item w-8 h-8"><ChevronRight size={14} className="rotate-180" /></button>
              <button className="strip-item w-8 h-8"><ChevronRight size={14} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-dim mb-4">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({length: 28}).map((_, i) => (
              <div key={i} className={`h-8 flex items-center justify-center rounded-lg text-xs font-bold ${i === 2 ? 'bg-blue-600 text-white' : 'text-white/40 hover:bg-white/5 cursor-pointer'}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </section>

        <section className="card space-y-6">
          <h3 className="card-title">Operational Load</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-panel-hover border-l-4 border-blue-500">
              <div className="flex-grow">
                <div className="text-xs font-bold">Deep Work Session</div>
                <div className="text-[9px] text-dim font-black uppercase tracking-widest mt-1">9:00 AM - 11:00 AM</div>
              </div>
              <MoreHorizontal size={14} className="text-dim" />
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-panel-hover border-l-4 border-green-500">
              <div className="flex-grow">
                <div className="text-xs font-bold">Protocol Review</div>
                <div className="text-[9px] text-dim font-black uppercase tracking-widest mt-1">1:00 PM - 2:00 PM</div>
              </div>
              <MoreHorizontal size={14} className="text-dim" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
