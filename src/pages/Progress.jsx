import React from 'react';
import { BarChart3, TrendingUp, Activity, Target, Zap, Shield } from 'lucide-react';

const Progress = ({ data, update }) => {
  return (
    <div className="bento-grid fade-in">
      {/* OVERVIEW STATS */}
      <section className="bento-card col-span-4 flex flex-col justify-between">
        <h3 className="card-title">Cognitive Hours</h3>
        <div className="flex items-end justify-between">
          <div className="metric-value">32.5</div>
          <div className="flex gap-1 h-12 items-end">
            {[4, 6, 3, 8, 5, 4, 2].map((h, i) => (
              <div key={i} className="flex-grow bg-[#00FF99]/20 w-1.5 rounded-full" style={{ height: `${(h/8)*100}%` }} />
            ))}
          </div>
        </div>
      </section>

      <section className="bento-card col-span-4 flex flex-col justify-between border-[#00FF99]/20">
        <h3 className="card-title text-[#00FF99]">Output Score</h3>
        <div className="flex items-end justify-between">
          <div className="metric-value text-[#00FF99]">84%</div>
          <Activity size={24} className="text-[#00FF99] mb-2" />
        </div>
      </section>

      <section className="bento-card col-span-4 flex flex-col justify-between">
        <h3 className="card-title">Neural Stability</h3>
        <div className="flex items-end justify-between">
          <div className="metric-value">100%</div>
          <Shield size={24} className="text-[#00FF99] mb-2" />
        </div>
      </section>

      {/* WEEKLY TIMELINE - BENTO GRID STYLE */}
      <section className="bento-card col-span-8 flex flex-col justify-between">
        <h3 className="card-title">Operational History</h3>
        <div className="flex justify-between items-end gap-1 h-32">
          {Array.from({length: 14}).map((_, i) => (
            <div key={i} className="flex-grow flex flex-col gap-1">
              <div className={`flex-grow rounded-xl transition-all ${i < 12 ? 'bg-[#00FF99]' : 'bg-white/5'}`} style={{ height: `${Math.random() * 60 + 40}%` }} />
              <div className="text-[6px] text-[#222] text-center font-bold">0{i+1}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS LIST */}
      <section className="bento-card col-span-4 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h3 className="card-title mb-0">System Archives</h3>
          <Zap size={16} className="text-[#00FF99]" />
        </div>
        <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: '200px' }}>
          {data.reviews.map((review, i) => (
            <div key={i} className="flex items-center justify-between group p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white">{new Date(review.date).toLocaleDateString()}</span>
                <span className="text-[8px] text-[#444] font-bold uppercase tracking-widest">LOG_{data.reviews.length - i}</span>
              </div>
              <div className="text-[#00FF99] font-black text-lg">{review.score}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WEEKLY DEBRIEF FORM */}
      <section className="bento-card col-span-12">
        <h3 className="card-title">Weekly Post-Operational Review</h3>
        <div className="grid grid-cols-2 gap-12 mt-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-[#222] font-black uppercase tracking-widest block">Success_Vectors</label>
              <textarea className="w-full bg-white/5 border-none p-6 rounded-3xl text-sm font-bold text-[#444] focus:text-white min-h-[100px] focus:ring-0" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-[#222] font-black uppercase tracking-widest block">Root_Failures</label>
              <textarea className="w-full bg-white/5 border-none p-6 rounded-3xl text-sm font-bold text-[#444] focus:text-white min-h-[100px] focus:ring-0" />
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="space-y-2">
              <label className="text-[10px] text-[#222] font-black uppercase tracking-widest block">Core_Improvement</label>
              <textarea className="w-full bg-white/5 border-none p-6 rounded-3xl text-sm font-bold text-[#444] focus:text-white min-h-[100px] focus:ring-0" />
            </div>
            <button className="btn-pill py-4 w-full flex justify-center tracking-[0.5em] mt-8 uppercase">Commit_Review</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Progress;
