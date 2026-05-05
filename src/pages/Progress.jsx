import React, { useState } from 'react';
import { BarChart3, ClipboardList, TrendingUp, Activity, Target, Zap, Shield } from 'lucide-react';

const Progress = ({ data, update }) => {
  const [newReview, setNewReview] = useState({
    well: '',
    failed: '',
    improve: '',
    score: 5
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const review = {
      ...newReview,
      date: new Date().toISOString()
    };
    update({
      ...data,
      reviews: [review, ...data.reviews]
    });
    setNewReview({ well: '', failed: '', improve: '', score: 5 });
  };

  return (
    <div className="space-y-12">
      {/* WEEKLY METRICS */}
      <section className="hud-panel">
        <div className="hud-header">
          <div className="hud-title"><BarChart3 size={12} /> ANALYTICS / OUTPUT_METRICS</div>
          <div className="text-[8px] text-[#444] font-bold">INTERVAL: CURRENT_WEEK</div>
        </div>
        <div className="hud-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
            {[
              { label: 'COGNITIVE_HOURS', value: '00.0', icon: <Activity size={12} /> },
              { label: 'OBJECTIVES_CLEARED', value: '00', icon: <Target size={12} /> },
              { label: 'STREAK_STABILITY', value: '100%', icon: <Zap size={12} /> },
              { label: 'SIGNAL_INTERFERENCE', value: 'LOW', icon: <Shield size={12} /> },
            ].map((metric, i) => (
              <div key={metric.label} className="p-6 bg-black border border-[#1A1A1A] hover:border-[#00FF99]/20 transition-all text-center">
                <div className="flex justify-center mb-2 text-[#444]">{metric.icon}</div>
                <div className="text-[8px] text-[#444] font-black uppercase tracking-[0.2em] mb-3">{metric.label}</div>
                <div className="text-3xl font-black text-white">{metric.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 border border-[#1A1A1A] bg-black/50 h-48 flex items-center justify-center relative overflow-hidden">
            {/* Visual background lines for "graph" feel */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-5">
              {Array.from({length: 72}).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white" />
              ))}
            </div>
            <div className="text-center relative z-10">
              <TrendingUp size={32} className="mx-auto mb-4 text-[#1A1A1A]" />
              <p className="text-[8px] text-[#222] font-black uppercase tracking-[0.4em]">Historical_Data_Insufficient / Pending_Input</p>
            </div>
          </div>
        </div>
      </section>

      {/* WEEKLY REVIEW */}
      <section className="hud-panel">
        <div className="hud-header">
          <div className="hud-title"><ClipboardList size={12} /> DEBRIEF_MODULE / WEEKLY_REVIEW</div>
        </div>
        <div className="hud-content">
          <form onSubmit={handleReviewSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[8px] text-[#444] font-black uppercase tracking-widest block">Successes (What went well)</label>
                <textarea 
                  className="w-full bg-black border-[#1A1A1A] p-4 text-[10px] font-bold min-h-[100px]"
                  value={newReview.well}
                  onChange={(e) => setNewReview({...newReview, well: e.target.value})}
                  placeholder="ENTER DATA..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] text-[#444] font-black uppercase tracking-widest block">Failures (Root cause analysis)</label>
                <textarea 
                  className="w-full bg-black border-[#1A1A1A] p-4 text-[10px] font-bold min-h-[100px]"
                  value={newReview.failed}
                  onChange={(e) => setNewReview({...newReview, failed: e.target.value})}
                  placeholder="ENTER DATA..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[8px] text-[#444] font-black uppercase tracking-widest block">Optimization Vectors (Next Week)</label>
              <textarea 
                className="w-full bg-black border-[#1A1A1A] p-4 text-[10px] font-bold min-h-[100px]"
                value={newReview.improve}
                onChange={(e) => setNewReview({...newReview, improve: e.target.value})}
                placeholder="ENTER DATA..."
              />
            </div>
            
            <div className="flex items-center justify-between p-6 bg-black border border-[#1A1A1A]">
              <div>
                <div className="text-[10px] text-white font-black uppercase">Core Output Score</div>
                <div className="text-[8px] text-[#444] font-bold uppercase mt-1">Performance_Rating: {newReview.score}/10</div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                className="w-64 accent-[#00FF99]"
                value={newReview.score}
                onChange={(e) => setNewReview({...newReview, score: parseInt(e.target.value)})}
              />
            </div>
            <button type="submit" className="w-full btn-terminal py-4 tracking-[0.5em]">
              COMMIT_REVIEW_TO_ARCHIVE
            </button>
          </form>

          {data.reviews.length > 0 && (
            <div className="mt-12 space-y-2">
              <label className="text-[8px] text-[#444] font-black uppercase tracking-widest block mb-4">Past_Review_Logs</label>
              {data.reviews.map((review, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-[#1A1A1A] bg-black/50 group hover:border-[#00FF99]/20 transition-all">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-[#444]">#{data.reviews.length - i}</span>
                    <span className="text-[10px] font-black text-white">{new Date(review.date).toLocaleDateString()}</span>
                    <span className="text-[10px] text-secondary truncate max-w-md hidden md:block italic">"{review.well}"</span>
                  </div>
                  <div className="px-3 py-1 border border-[#00FF99]/20 text-[#00FF99] text-[10px] font-black">SCORE: {review.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Progress;
