import React, { useState } from 'react';
import { Search, Plus, Trash2, Tag, Book, ChevronRight, Hash } from 'lucide-react';

const Vault = ({ data, update }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNote, setActiveNote] = useState(null);

  const filteredNotes = data.notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addNote = () => {
    const newNote = {
      id: crypto.randomUUID(),
      title: 'UNNAMED_DATA_STREAM',
      category: 'ideas',
      tags: [],
      content: '',
      createdAt: new Date().toISOString()
    };
    update({ notes: [newNote, ...data.notes] });
    setActiveNote(newNote.id);
  };

  const updateNote = (id, field, value) => {
    const notes = data.notes.map(n => n.id === id ? { ...n, [field]: value } : n);
    update({ notes });
  };

  const deleteNote = (id) => {
    update({ notes: data.notes.filter(n => n.id !== id) });
    if (activeNote === id) setActiveNote(null);
  };

  const currentNote = data.notes.find(n => n.id === activeNote);

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-140px)]">
      {/* SIDEBAR */}
      <aside className="w-full md:w-80 flex flex-col gap-4">
        <div className="hud-panel flex flex-col h-full">
          <div className="hud-header">
            <div className="hud-title"><Search size={12} /> ARCHIVE_QUERY</div>
          </div>
          <div className="p-4 border-b border-[#1A1A1A]">
            <input 
              placeholder="SEARCH_DATA..." 
              className="w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-grow overflow-y-auto p-2 space-y-1">
            {filteredNotes.map(note => (
              <button
                key={note.id}
                onClick={() => setActiveNote(note.id)}
                className={`w-full text-left p-3 border transition-all flex items-center justify-between group ${activeNote === note.id ? 'border-[#00FF99] bg-[#00FF99]/5' : 'border-transparent hover:border-[#1A1A1A] hover:bg-white/5'}`}
              >
                <div>
                  <div className={`text-[10px] font-black uppercase tracking-wider mb-1 truncate max-w-[180px] ${activeNote === note.id ? 'text-[#00FF99]' : 'text-white'}`}>{note.title}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-[#444] uppercase tracking-widest">{note.category}</span>
                  </div>
                </div>
                {activeNote === note.id && <ChevronRight size={14} className="text-[#00FF99]" />}
              </button>
            ))}
          </div>
          <button onClick={addNote} className="btn-terminal m-2 py-3 tracking-[0.2em]">
            + NEW_STREAM
          </button>
        </div>
      </aside>

      {/* EDITOR */}
      <main className="flex-grow hud-panel flex flex-col">
        {currentNote ? (
          <div className="flex flex-col h-full">
            <div className="hud-header">
              <div className="hud-title">
                <input 
                  className="bg-transparent border-none p-0 text-[10px] font-black focus:ring-0 w-full text-[#00FF99] uppercase tracking-widest"
                  value={currentNote.title}
                  onChange={(e) => updateNote(currentNote.id, 'title', e.target.value)}
                />
              </div>
              <button onClick={() => deleteNote(currentNote.id)} className="text-[#333] hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="p-3 bg-black/50 border-b border-[#1A1A1A] flex gap-6">
              <div className="flex items-center gap-2">
                <label className="text-[8px] text-[#444] font-black uppercase tracking-widest">Sector:</label>
                <select 
                  className="bg-transparent border-none text-[8px] font-black p-0 focus:ring-0 text-[#00FF99]"
                  value={currentNote.category}
                  onChange={(e) => updateNote(currentNote.id, 'category', e.target.value)}
                >
                  <option value="school">SCHOOL</option>
                  <option value="coding">CODING</option>
                  <option value="ideas">IDEAS</option>
                  <option value="life">LIFE</option>
                </select>
              </div>
              <div className="flex items-center gap-2 flex-grow">
                <Hash size={10} className="text-[#444]" />
                <input 
                  placeholder="ADD_TAGS_BY_COMMA..." 
                  className="bg-transparent border-none p-0 text-[8px] font-black focus:ring-0 flex-grow text-[#444]"
                  value={currentNote.tags.join(', ')}
                  onChange={(e) => updateNote(currentNote.id, 'tags', e.target.value.split(',').map(t => t.trim()))}
                />
              </div>
              <div className="text-[8px] text-[#222] font-black tracking-widest uppercase">{new Date(currentNote.createdAt).toLocaleString()}</div>
            </div>

            <textarea 
              className="flex-grow bg-transparent border-none p-8 focus:ring-0 resize-none font-mono text-[11px] leading-relaxed text-[#AAA]"
              placeholder="INITIALIZE_DATA_ENTRY..."
              value={currentNote.content}
              onChange={(e) => updateNote(currentNote.id, 'content', e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#111] pointer-events-none">
            <Book size={64} className="mb-4 opacity-50" />
            <div className="text-[10px] font-black uppercase tracking-[0.5em]">System_Idle / Waiting_For_Selection</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Vault;
