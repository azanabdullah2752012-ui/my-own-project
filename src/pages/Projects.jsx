import React from 'react';
import { FolderKanban, Plus, Clock, AlertCircle, CheckCircle, Target, Zap, Activity } from 'lucide-react';

const Projects = ({ data, update }) => {
  const handleUpdate = (newList) => {
    update({ list: newList });
  };

  const addProject = () => {
    const newProject = {
      id: crypto.randomUUID(),
      name: 'NEW_MISSION',
      status: 'idea',
      priority: 'medium',
      nextStep: '',
      deadline: '',
      notes: '',
      progress: 0
    };
    handleUpdate([newProject, ...data.list]);
  };

  const updateProject = (id, field, value) => {
    const list = data.list.map(p => p.id === id ? { ...p, [field]: value } : p);
    handleUpdate(list);
  };

  const deleteProject = (id) => {
    handleUpdate(data.list.filter(p => p.id !== id));
  };

  const statusColors = {
    idea: 'text-[#444] border-[#1A1A1A] bg-black',
    building: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5',
    paused: 'text-[#222] border-[#111] bg-black',
    finished: 'text-[#00FF99] border-[#00FF99]/20 bg-[#00FF99]/5'
  };

  const priorityColors = {
    low: 'text-[#444]',
    medium: 'text-white',
    high: 'text-red-500 shadow-[0_0_10px_rgba(255,0,0,0.2)]'
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#00FF99]/10 border border-[#00FF99]/20">
            <FolderKanban className="text-[#00FF99]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white">Mission Control</h2>
            <div className="text-[8px] text-[#444] font-bold tracking-[0.4em] uppercase mt-1">Project Deployment & Oversight</div>
          </div>
        </div>
        <button onClick={addProject} className="btn-terminal py-3 px-8 tracking-[0.3em]">
          + INITIALIZE_MISSION
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.list.map(project => (
          <div key={project.id} className="hud-panel flex flex-col group hover:border-[#00FF99]/40 transition-all duration-500">
            <div className="hud-header">
              <div className="hud-title flex-grow">
                <input 
                  className="bg-transparent border-none p-0 text-[10px] font-black focus:ring-0 w-full text-white uppercase tracking-widest"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                />
              </div>
              <button onClick={() => deleteProject(project.id)} className="text-[#111] group-hover:text-red-500/40 hover:!text-red-500 transition-colors">
                <Plus size={16} className="rotate-45" />
              </button>
            </div>

            <div className="hud-content space-y-6">
              <div className="flex gap-2">
                <select 
                  className={`text-[8px] font-black px-2 py-1 border transition-all ${statusColors[project.status]}`}
                  value={project.status}
                  onChange={(e) => updateProject(project.id, 'status', e.target.value)}
                >
                  <option value="idea">STATUS: IDEA</option>
                  <option value="building">STATUS: ACTIVE</option>
                  <option value="paused">STATUS: PAUSED</option>
                  <option value="finished">STATUS: COMPLETE</option>
                </select>
                <select 
                  className={`text-[8px] font-black px-2 py-1 border border-[#1A1A1A] bg-black ${priorityColors[project.priority]}`}
                  value={project.priority}
                  onChange={(e) => updateProject(project.id, 'priority', e.target.value)}
                >
                  <option value="low">PRIORITY: LOW</option>
                  <option value="medium">PRIORITY: MED</option>
                  <option value="high">PRIORITY: HIGH</option>
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[8px] text-[#444] font-black uppercase tracking-widest block mb-2">Immediate Directive</label>
                  <div className="flex items-center gap-3">
                    <Activity size={12} className="text-[#00FF99] animate-pulse" />
                    <input 
                      placeholder="ENTER NEXT STEP..."
                      className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-bold text-white flex-grow"
                      value={project.nextStep}
                      onChange={(e) => updateProject(project.id, 'nextStep', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[8px] text-[#444] font-black uppercase tracking-widest">Project Completion</label>
                    <span className="text-[10px] font-black text-[#00FF99]">{project.progress}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-[#1A1A1A] relative">
                    <div 
                      className="h-full bg-[#00FF99] shadow-[0_0_10px_rgba(0,255,153,0.5)] transition-all duration-700" 
                      style={{ width: `${project.progress}%` }} 
                    />
                  </div>
                  <input 
                    type="range" 
                    className="w-full h-1 accent-[#00FF99] mt-2 opacity-10 hover:opacity-100 transition-opacity" 
                    value={project.progress}
                    onChange={(e) => updateProject(project.id, 'progress', parseInt(e.target.value))}
                  />
                </div>

                <div className="pt-4 border-t border-[#1A1A1A] flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock size={10} className="text-[#444]" />
                    <input 
                      type="date" 
                      className="bg-transparent border-none p-0 text-[8px] font-black text-[#444] uppercase"
                      value={project.deadline}
                      onChange={(e) => updateProject(project.id, 'deadline', e.target.value)}
                    />
                  </div>
                  <div className="text-[8px] text-[#111] font-black tracking-tighter">DATA_STREAM_{project.id.split('-')[0]}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {data.list.length === 0 && (
          <div className="col-span-full py-32 text-center hud-panel">
            <div className="hud-content">
              <Zap size={48} className="mx-auto mb-4 text-[#050505] opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#222]">No Active Missions Detected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
