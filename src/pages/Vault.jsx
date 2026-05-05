import React, { useState } from 'react';
import { Search, Plus, Trash2, Book, Hash } from 'lucide-react';

const Vault = ({ data, update }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNote, setActiveNote] = useState(null);

  const filteredNotes = data.notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentNote = data.notes.find(n => n.id === activeNote);

  return (
    <div className="bento-grid fade-in">
      {/* SEARCH CARD */}
      <section className="bento-card col-span-12 flex items-center gap-6 py-6 px-10">
        <Search className="text-[#00FF99]" size={24} />
        <input 
          placeholder="QUERY SYSTEM ARCHIVES..." 
          className="bg-transparent border-none p-0 text-2xl font-black text-white focus:ring-0 flex-grow placeholder:text-[#111]" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => {}} className="btn-pill px-8">NEW_ENTRY</button>
      </section>

      {/* NOTES GRID */}
      <div className="col-span-12 grid grid-cols-4 gap-6">
        {filteredNotes.map(note => (
          <section
            key={note.id}
            onClick={() => setActiveNote(note.id)}
            className={`bento-card flex flex-col justify-between cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${activeNote === note.id ? 'border-[#00FF99]/40 bg-[#00FF99]/5' : ''}`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[8px] font-black text-[#00FF99] uppercase tracking-[0.2em]">{note.category}</span>
                <Book size={14} className="text-[#222] group-hover:text-[#00FF99] transition-colors" />
              </div>
              <h3 className="text-sm font-black text-white group-hover:text-[#00FF99] transition-colors line-clamp-2">{note.title}</h3>
            </div>
            <div className="mt-6 flex items-center justify-between text-[8px] font-black text-[#222] uppercase tracking-widest">
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              <Hash size={10} />
            </div>
          </section>
        ))}
      </div>

      {/* OVERLAY EDITOR */}
      {currentNote && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-20 bg-black/90 backdrop-blur-2xl">
          <div className="bento-card w-full max-w-5xl h-full flex flex-col bg-[#050505] border-[#00FF99]/10">
            <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-10">
              <div className="flex-grow">
                <input 
                  className="bg-transparent border-none p-0 text-4xl font-black w-full text-white uppercase tracking-tighter"
                  value={currentNote.title}
                  onChange={(e) => {}}
                />
                <div className="flex items-center gap-6 mt-4">
                  <span className="text-[10px] text-[#00FF99] font-black uppercase tracking-[0.3em]">{currentNote.category}</span>
                  <span className="text-[10px] text-[#222] font-black uppercase tracking-widest">{new Date(currentNote.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setActiveNote(null)} className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-white hover:bg-white/5">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
            </div>
            <textarea 
              className="flex-grow bg-transparent border-none p-0 text-xl leading-relaxed text-[#444] focus:text-white focus:ring-0 resize-none transition-colors"
              placeholder="DATA_STREAM_INIT..."
              value={currentNote.content}
              onChange={(e) => {}}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Vault;
