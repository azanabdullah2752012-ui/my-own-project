import React, { useState } from 'react';
import { Search, Plus, Trash2, Tag, Book, ChevronRight } from 'lucide-react';

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
      title: 'New Knowledge Stream',
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
    <div className="space-y-12">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Knowledge Vault</h2>
          <p className="text-secondary text-sm">Centralized intelligence and second brain.</p>
        </div>
        <button onClick={addNote} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Create New Entry
        </button>
      </header>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={20} />
        <input 
          placeholder="Query the second brain..." 
          className="w-full bg-white/5 border-white/5 py-6 pl-16 rounded-3xl text-lg font-medium focus:ring-1 focus:ring-[#00FF99] transition-all" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <button
            key={note.id}
            onClick={() => setActiveNote(note.id)}
            className={`glass-panel p-8 text-left space-y-4 group transition-all duration-300 ${activeNote === note.id ? 'border-[#00FF99] ring-1 ring-[#00FF99]/20' : ''}`}
          >
            <div className="flex justify-between items-start">
              <span className="badge badge-green text-[9px]">{note.category}</span>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="text-lg font-bold group-hover:text-[#00FF99] transition-colors">{note.title}</h3>
            <p className="text-sm text-secondary line-clamp-3 leading-relaxed">
              {note.content || "Empty knowledge stream..."}
            </p>
          </button>
        ))}
      </div>

      {/* OVERLAY EDITOR */}
      {currentNote && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-12 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-4xl h-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex-grow">
                <input 
                  className="bg-transparent border-none p-0 text-2xl font-bold w-full focus:ring-0"
                  value={currentNote.title}
                  onChange={(e) => updateNote(currentNote.id, 'title', e.target.value)}
                />
                <div className="flex items-center gap-4 mt-2">
                  <select 
                    className="bg-white/5 border-none text-[10px] font-black p-1 px-2 rounded-md uppercase text-[#00FF99]"
                    value={currentNote.category}
                    onChange={(e) => updateNote(currentNote.id, 'category', e.target.value)}
                  >
                    <option value="school">SCHOOL</option>
                    <option value="coding">CODING</option>
                    <option value="ideas">IDEAS</option>
                    <option value="life">LIFE</option>
                  </select>
                  <input 
                    placeholder="Add tags..." 
                    className="bg-transparent border-none p-0 text-[10px] font-bold text-secondary uppercase focus:ring-0"
                    value={currentNote.tags.join(', ')}
                    onChange={(e) => updateNote(currentNote.id, 'tags', e.target.value.split(',').map(t => t.trim()))}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => deleteNote(currentNote.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-all">
                  <Trash2 size={20} />
                </button>
                <button onClick={() => setActiveNote(null)} className="text-white hover:bg-white/10 p-2 rounded-xl transition-all">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
            </div>
            <textarea 
              className="flex-grow bg-transparent border-none p-12 focus:ring-0 resize-none text-lg leading-relaxed text-white/80"
              placeholder="Initialize data entry..."
              value={currentNote.content}
              onChange={(e) => updateNote(currentNote.id, 'content', e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Vault;
