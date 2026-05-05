import React, { useState } from 'react';
import { BarChart3, ClipboardList, TrendingUp } from 'lucide-react';

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
      <section>
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-[#00FF99]" size={24} />
          <h2 className="text-xl font-bold uppercase tracking-tight">Weekly Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Total Study Hours', 'Tasks Completed', 'Current Streak', 'Distractions'].map((label, i) => (
            <div key={label} className="card text-center p-6 border-b-2 border-[#333] hover:border-[#00FF99] transition-colors">
              <div className="text-secondary text-[10px] uppercase font-bold tracking-widest mb-2">{label}</div>
              <div className="text-3xl font-black text-white">0</div>
              <div className="text-[10px] text-secondary mt-1 uppercase">This Week</div>
            </div>
          ))}
        </div>
        <div className="mt-8 glass p-8 h-64 flex items-center justify-center text-secondary border border-dashed border-[#333]">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
            <p>Metric visualization will populate as data accumulates.</p>
          </div>
        </div>
      </section>

      {/* WEEKLY REVIEW FORM */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="text-[#00FF99]" size={24} />
          <h2 className="text-xl font-bold uppercase tracking-tight">Weekly Review</h2>
        </div>
        <form onSubmit={handleReviewSubmit} className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-secondary uppercase font-bold mb-2 block">What went well?</label>
              <textarea 
                className="w-full bg-[#1A1A1A] border-[#333] p-4 rounded-xl min-h-[100px]"
                value={newReview.well}
                onChange={(e) => setNewReview({...newReview, well: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-secondary uppercase font-bold mb-2 block">What failed?</label>
              <textarea 
                className="w-full bg-[#1A1A1A] border-[#333] p-4 rounded-xl min-h-[100px]"
                value={newReview.failed}
                onChange={(e) => setNewReview({...newReview, failed: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-secondary uppercase font-bold mb-2 block">What to improve next week?</label>
            <textarea 
              className="w-full bg-[#1A1A1A] border-[#333] p-4 rounded-xl min-h-[100px]"
              value={newReview.improve}
              onChange={(e) => setNewReview({...newReview, improve: e.target.value})}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-[#333]">
            <span className="font-bold">Weekly Performance Score: <span className="text-[#00FF99]">{newReview.score}/10</span></span>
            <input 
              type="range" 
              min="1" 
              max="10" 
              className="w-48 accent-[#00FF99]"
              value={newReview.score}
              onChange={(e) => setNewReview({...newReview, score: parseInt(e.target.value)})}
            />
          </div>
          <button type="submit" className="w-full btn-primary py-4 rounded-xl">
            Save Weekly Review
          </button>
        </form>

        <div className="mt-8 space-y-4">
          {data.reviews.map((review, i) => (
            <div key={i} className="card border-l-2 border-indigo-500 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-secondary">{new Date(review.date).toLocaleDateString()}</span>
                <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">Score: {review.score}</span>
              </div>
              <p className="text-sm line-clamp-1"><span className="text-secondary">Well:</span> {review.well}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Progress;
