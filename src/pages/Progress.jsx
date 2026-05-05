import React, { useState } from 'react';
import { BarChart3, ClipboardList, TrendingUp, Zap, Activity, Calendar } from 'lucide-react';

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
      <header>
        <h2 className="text-3xl font-bold">Performance Analytics</h2>
        <p className="text-secondary text-sm">System output and efficiency metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* KEY METRICS */}
        <div className="glass-panel p-8 flex flex-col justify-between aspect-square">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-2">Efficiency Rating</h3>
            <div className="text-5xl font-black text-white">84<span className="text-[#00FF99]">%</span></div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary font-medium">Tasks Cleared</span>
              <span className="font-bold">24 / 28</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '84%' }} />
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 flex flex-col justify-between aspect-square">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-2">Cognitive Output</h3>
            <div className="text-5xl font-black text-white">32.5<span className="text-secondary text-lg ml-1">Hrs</span></div>
          </div>
          <div className="flex gap-1 items-end h-24">
            {[4, 6, 3, 8, 5, 4, 2].map((h, i) => (
              <div key={i} className="flex-grow bg-[#00FF99]/20 rounded-t-sm relative group" style={{ height: `${(h/8)*100}%` }}>
                <div className="absolute inset-0 bg-[#00FF99] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 flex flex-col justify-between aspect-square">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-2">Operational Streak</h3>
            <div className="text-5xl font-black text-[#00FF99]">12<span className="text-white text-lg ml-1">Days</span></div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({length: 21}).map((_, i) => (
              <div key={i} className={`aspect-square rounded-sm ${i < 12 ? 'bg-[#00FF99]' : 'bg-white/5'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid-cols">
        {/* WEEKLY REVIEW */}
        <section className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-[#00FF99]" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Post-Operational Review</h3>
          </div>
          <form onSubmit={handleReviewSubmit} className="glass-panel p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] text-secondary font-bold uppercase tracking-widest block">Primary Successes</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm min-h-[120px] focus:ring-1 focus:ring-[#00FF99]"
                  value={newReview.well}
                  onChange={(e) => setNewReview({...newReview, well: e.target.value})}
                  placeholder="What went well?"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-secondary font-bold uppercase tracking-widest block">System Failures</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm min-h-[120px] focus:ring-1 focus:ring-[#00FF99]"
                  value={newReview.failed}
                  onChange={(e) => setNewReview({...newReview, failed: e.target.value})}
                  placeholder="What broke in the protocol?"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] text-secondary font-bold uppercase tracking-widest block">Optimization Vector</label>
              <textarea 
                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm min-h-[120px] focus:ring-1 focus:ring-[#00FF99]"
                value={newReview.improve}
                onChange={(e) => setNewReview({...newReview, improve: e.target.value})}
                placeholder="Next week's focus area..."
              />
            </div>
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl">
              <div>
                <div className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-1">Self-Performance Rating</div>
                <div className="text-lg font-bold">{newReview.score} / 10</div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                className="w-48 accent-[#00FF99]"
                value={newReview.score}
                onChange={(e) => setNewReview({...newReview, score: parseInt(e.target.value)})}
              />
            </div>
            <button type="submit" className="w-full btn-primary py-4 uppercase tracking-[0.3em] font-black">Commit to Archive</button>
          </form>
        </section>

        {/* LOGS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Calendar className="text-[#00FF99]" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Archive History</h3>
          </div>
          <div className="space-y-3">
            {data.reviews.map((review, i) => (
              <div key={i} className="glass-panel p-6 flex justify-between items-center group">
                <div>
                  <div className="text-xs font-bold text-white mb-1">{new Date(review.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-[10px] text-secondary uppercase font-bold">Review Archive #{data.reviews.length - i}</div>
                </div>
                <div className="text-[#00FF99] font-black text-xl">{review.score}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Progress;
