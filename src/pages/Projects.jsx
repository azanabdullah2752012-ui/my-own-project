import React from 'react';
import { FolderKanban, Plus, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const Projects = ({ data, update }) => {
  const handleUpdate = (newList) => {
    update({ list: newList });
  };

  const addProject = () => {
    const newProject = {
      id: crypto.randomUUID(),
      name: 'New Project',
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
    idea: 'text-indigo-400 bg-indigo-500/10',
    building: 'text-yellow-400 bg-yellow-500/10',
    paused: 'text-secondary bg-[#1A1A1A]',
    finished: 'text-[#00FF99] bg-[#00FF99]/10'
  };

  const priorityColors = {
    low: 'text-secondary',
    medium: 'text-white',
    high: 'text-red-500'
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FolderKanban className="text-[#00FF99]" size={24} />
          <h2 className="text-xl font-bold uppercase tracking-tight">Projects Hub</h2>
        </div>
        <button onClick={addProject} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Initialize Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.list.map(project => (
          <div key={project.id} className="card flex flex-col gap-4 border-l-2 border-[#333] hover:border-[#00FF99] transition-all">
            <div className="flex justify-between items-start">
              <input 
                className="bg-transparent border-none p-0 text-lg font-bold w-full focus:ring-0"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
              />
              <button onClick={() => deleteProject(project.id)} className="text-[#333] hover:text-red-500">
                <Plus size={18} className="rotate-45" />
              </button>
            </div>

            <div className="flex gap-2">
              <select 
                className={`text-[10px] uppercase font-bold px-2 py-1 rounded border-none ${statusColors[project.status]}`}
                value={project.status}
                onChange={(e) => updateProject(project.id, 'status', e.target.value)}
              >
                <option value="idea">Idea</option>
                <option value="building">Building</option>
                <option value="paused">Paused</option>
                <option value="finished">Finished</option>
              </select>
              <select 
                className={`text-[10px] uppercase font-bold px-2 py-1 rounded border-none bg-[#1A1A1A] ${priorityColors[project.priority]}`}
                value={project.priority}
                onChange={(e) => updateProject(project.id, 'priority', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-secondary uppercase font-bold block mb-1">Next Step</label>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF99]" />
                  <input 
                    placeholder="Immediate action..."
                    className="bg-transparent border-none p-0 focus:ring-0 flex-grow"
                    value={project.nextStep}
                    onChange={(e) => updateProject(project.id, 'nextStep', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-secondary uppercase font-bold block mb-1">Progress: {project.progress}%</label>
                <div className="h-1 w-full bg-[#333] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00FF99] transition-all" 
                    style={{ width: `${project.progress}%` }} 
                  />
                </div>
                <input 
                  type="range" 
                  className="w-full h-1 accent-[#00FF99] mt-2" 
                  value={project.progress}
                  onChange={(e) => updateProject(project.id, 'progress', parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center gap-4 text-[10px] text-secondary uppercase font-bold pt-2 border-t border-[#333]">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <input 
                    type="date" 
                    className="bg-transparent border-none p-0 text-[10px] uppercase font-bold"
                    value={project.deadline}
                    onChange={(e) => updateProject(project.id, 'deadline', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {data.list.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-20 border-2 border-dashed border-[#333] rounded-2xl">
            <FolderKanban size={48} className="mx-auto mb-4" />
            <p className="font-bold uppercase tracking-widest">No active projects</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
