import React, { useState } from 'react';
import { Search, Plus, Trash2, Tag, Book } from 'lucide-react';

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
      title: 'New Entry',
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
    <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-160px)]">
      {/* SIDEBAR */}
      <aside className="w-full md:w-80 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
          <input 
            placeholder="Search knowledge..." 
            className="w-full pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={addNote} className="btn-primary flex items-center justify-center gap-2 py-3 rounded-xl">
          <Plus size={20} /> New Entry
        </button>
        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
          {filteredNotes.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNote(note.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${activeNote === note.id ? 'border-[#00FF99] bg-[#00FF99]/5' : 'border-[#333] hover:border-white/20'}`}
            >
              <div className="font-bold text-sm truncate mb-1">{note.title}</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-secondary px-2 py-0.5 bg-[#1A1A1A] rounded">{note.category}</span>
                <span className="text-[10px] text-secondary">{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* EDITOR */}
      <main className="flex-grow card flex flex-col p-0 overflow-hidden">
        {currentNote ? (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-[#333] flex justify-between items-center">
              <input 
                className="bg-transparent border-none p-0 text-2xl font-bold focus:ring-0 w-full"
                value={currentNote.title}
                onChange={(e) => updateNote(currentNote.id, 'title', e.target.value)}
              />
              <button onClick={() => deleteNote(currentNote.id)} className="text-secondary hover:text-red-500">
                <Trash2 size={20} />
              </button>
            </div>
            <div className="p-4 bg-[#1A1A1A]/50 border-b border-[#333] flex gap-4 overflow-x-auto">
              <select 
                className="bg-[#1A1A1A] border-[#333] text-xs p-1 rounded"
                value={currentNote.category}
                onChange={(e) => updateNote(currentNote.id, 'category', e.target.value)}
              >
                <option value="school">School</option>
                <option value="coding">Coding</option>
                <option value="ideas">Ideas</option>
                <option value="life">Life</option>
              </select>
              <div className="flex items-center gap-2 text-secondary">
                <Tag size={14} />
                <input 
                  placeholder="tags, separated, by, comma" 
                  className="bg-transparent border-none p-0 text-xs focus:ring-0 min-w-[200px]"
                  value={currentNote.tags.join(', ')}
                  onChange={(e) => updateNote(currentNote.id, 'tags', e.target.value.split(',').map(t => t.trim()))}
                />
              </div>
            </div>
            <textarea 
              className="flex-grow bg-transparent border-none p-8 focus:ring-0 resize-none font-mono text-sm leading-relaxed"
              placeholder="Start writing..."
              value={currentNote.content}
              onChange={(e) => updateNote(currentNote.id, 'content', e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-secondary opacity-20">
            <Book size={64} className="mb-4" />
            <p className="font-bold uppercase tracking-widest">Select an entry or create a new one</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Vault;
