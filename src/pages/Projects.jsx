import React from 'react';
import { FolderKanban, Clock, Activity, Zap } from 'lucide-react';

const Projects = ({ data, update }) => {
  const statusColors = {
    idea: 'bg-[#111] text-[#444]',
    building: 'bg-[#00FF99] text-black',
    paused: 'bg-yellow-900 text-yellow-500',
    finished: 'bg-white/10 text-white/40'
  };

  return (
    <div className="bento-grid fade-in">
      {/* HEADER */}
      <section className="bento-card col-span-12 flex items-center justify-between py-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#00FF99]/10 rounded-3xl flex items-center justify-center">
            <FolderKanban className="text-[#00FF99]" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Mission Portfolio</h2>
            <div className="text-[10px] text-[#222] font-black tracking-[0.4em] uppercase mt-1">Deployment_Oversight / Active</div>
          </div>
        </div>
        <button className="btn-pill px-10">NEW_MISSION</button>
      </section>

      {/* PROJECT CARDS */}
      <div className="col-span-12 grid grid-cols-3 gap-8">
        {data.list.map(project => (
          <section key={project.id} className="bento-card flex flex-col justify-between group hover:scale-[1.02] transition-all duration-500">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${statusColors[project.status]}`}>
                  {project.status}
                </span>
                <span className="text-[8px] text-[#222] font-black uppercase tracking-widest">{project.priority}_PRIORITY</span>
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-[#00FF99] transition-colors uppercase tracking-tighter">
                {project.name}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[8px] font-black text-[#222] uppercase tracking-widest">
                  <span>Directive: {project.nextStep || 'NOT_ASSIGNED'}</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#00FF99] shadow-[0_0_10px_rgba(0,255,153,0.5)] transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-[#222] tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <Clock size={12} />
                <span>{project.deadline || 'NO_ETA'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={12} />
                <span className="group-hover:text-[#00FF99] transition-colors">TRACKING_ON</span>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Projects;
