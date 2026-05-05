import React from 'react';
import { FolderKanban, Plus, Clock, Target, Activity } from 'lucide-react';

const Projects = ({ data, update }) => {
  const handleUpdate = (newList) => {
    update({ list: newList });
  };

  const addProject = () => {
    const newProject = {
      id: crypto.randomUUID(),
      name: 'New Mission',
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

  const statusConfig = {
    idea: { label: 'Idea', color: 'badge-gray' },
    building: { label: 'Building', color: 'badge-green' },
    paused: { label: 'Paused', color: 'badge-gray text-yellow-500' },
    finished: { label: 'Done', color: 'badge-green opacity-50' }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Project Portfolio</h2>
          <p className="text-secondary text-sm">Strategic initiatives and deployment tracking.</p>
        </div>
        <button onClick={addProject} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Initialize Mission
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.list.map(project => (
          <div key={project.id} className="glass-panel p-8 space-y-6 group">
            <div className="flex justify-between items-start">
              <span className={`badge ${statusConfig[project.status].color}`}>{statusConfig[project.status].label}</span>
              <select 
                className="bg-transparent border-none p-0 text-[10px] font-black uppercase text-secondary focus:ring-0"
                value={project.priority}
                onChange={(e) => updateProject(project.id, 'priority', e.target.value)}
              >
                <option value="low">PRIORITY: LOW</option>
                <option value="medium">PRIORITY: MID</option>
                <option value="high">PRIORITY: HIGH</option>
              </select>
            </div>

            <div className="space-y-2">
              <input 
                className="bg-transparent border-none p-0 text-xl font-bold w-full focus:ring-0"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
              />
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${project.progress}%` }} />
              </div>
              <input 
                type="range" 
                className="w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity accent-[#00FF99]" 
                value={project.progress}
                onChange={(e) => updateProject(project.id, 'progress', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-secondary font-bold uppercase tracking-widest block mb-2">Next Milestone</label>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF99]" />
                  <input 
                    placeholder="Enter next vector..."
                    className="bg-transparent border-none p-0 text-sm font-medium focus:ring-0 w-full"
                    value={project.nextStep}
                    onChange={(e) => updateProject(project.id, 'nextStep', e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-secondary" />
                  <input 
                    type="date" 
                    className="bg-transparent border-none p-0 text-[10px] font-bold text-secondary uppercase"
                    value={project.deadline}
                    onChange={(e) => updateProject(project.id, 'deadline', e.target.value)}
                  />
                </div>
                <button onClick={() => deleteProject(project.id)} className="text-red-500/20 hover:text-red-500 transition-colors">
                  <Plus className="rotate-45" size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {data.list.length === 0 && (
          <div className="col-span-full py-32 text-center glass-panel border-dashed">
            <FolderKanban size={48} className="mx-auto mb-4 text-white/5" />
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-secondary">Mission Buffer Empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
