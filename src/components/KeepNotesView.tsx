import React, { useState } from 'react';
import type { NoteItem } from '../types';
import {
  Pin,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Search,
  Edit2,
  CheckSquare,
  X,
} from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

interface KeepNotesViewProps {
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onNavigateToKeepToDo?: () => void;
  isDark: boolean;
}

export const KeepNotesView: React.FC<KeepNotesViewProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onNavigateToKeepToDo,
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<NoteItem | null>(null);

  // Form state (shared by Add and Edit modals)
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState('#ecfdf5'); // pastel light green
  const [checklistInput, setChecklistInput] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ id: string; text: string; done: boolean }[]>([]);

  const pastelColors = [
    { label: 'Emerald', hex: '#ecfdf5', darkHex: '#064e3b' },
    { label: 'Amber', hex: '#fef3c7', darkHex: '#78350f' },
    { label: 'Lavender', hex: '#e0e7ff', darkHex: '#312e81' },
    { label: 'Rose', hex: '#fce7f3', darkHex: '#831843' },
    { label: 'Sky', hex: '#e0f2fe', darkHex: '#0c4a6e' },
  ];

  const openEditNoteModal = (note: NoteItem) => {
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content || '');
    setNewColor(note.color || '#ecfdf5');
    setChecklistItems(note.checklist ? note.checklist.map((item) => ({ ...item })) : []);
    setChecklistInput('');
  };

  const handleAddChecklistItem = () => {
    if (!checklistInput.trim()) return;
    setChecklistItems((prev) => [
      ...prev,
      { id: `chk-${Date.now()}`, text: checklistInput.trim(), done: false },
    ]);
    setChecklistInput('');
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() && !newContent.trim() && checklistItems.length === 0) return;

    onAddNote({
      id: `note-${Date.now()}`,
      title: newTitle.trim() || 'Untitled Note',
      content: newContent.trim(),
      category: 'general',
      isPinned: false,
      tags: ['Keep'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: newColor,
      checklist: checklistItems.length > 0 ? checklistItems : undefined,
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setChecklistItems([]);
  };

  const handleSaveEditedNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    if (!newTitle.trim() && !newContent.trim() && checklistItems.length === 0) return;

    onUpdateNote({
      ...editingNote,
      title: newTitle.trim() || 'Untitled Note',
      content: newContent.trim(),
      color: newColor,
      updatedAt: new Date().toISOString(),
      checklist: checklistItems.length > 0 ? checklistItems : undefined,
    });

    setEditingNote(null);
    setNewTitle('');
    setNewContent('');
    setChecklistItems([]);
    setChecklistInput('');
  };

  const handleToggleChecklist = (noteId: string, itemId: string) => {
    const target = notes.find((n) => n.id === noteId);
    if (!target || !target.checklist) return;

    const updatedChecklist = target.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );

    onUpdateNote({
      ...target,
      updatedAt: new Date().toISOString(),
      checklist: updatedChecklist,
    });
  };

  const filteredNotes = notes.filter((n) => {
    return (
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.checklist?.some((c) => c.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Notes &amp; Tasks
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Click any note card to edit • Tick-out checklists &amp; colored notes
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {onNavigateToKeepToDo && (
            <button
              onClick={onNavigateToKeepToDo}
              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300 hover:bg-purple-100 cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Keep To-Do</span>
            </button>
          )}

          <button
            onClick={() => {
              setNewTitle('');
              setNewContent('');
              setNewColor('#ecfdf5');
              setChecklistItems([]);
              setChecklistInput('');
              setIsAddModalOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Take a note</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search notes, checklists, protocols..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* PINNED SECTION */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Pinned
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pinnedNotes.map((note) => renderNoteCard(note))}
          </div>
        </div>
      )}

      {/* OTHERS SECTION */}
      <div className="space-y-2">
        {pinnedNotes.length > 0 && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Others
          </span>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherNotes.map((note) => renderNoteCard(note))}
        </div>
      </div>

      {/* Modal: Add Note */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border space-y-3 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">New Keep Note</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden"
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  placeholder="Take a note..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 leading-relaxed focus:outline-hidden"
                />
              </div>

              {/* Checklist items in note */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400">Tick-Out Checklists</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Add checklist item..."
                    value={checklistInput}
                    onChange={(e) => setChecklistInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChecklistItem();
                      }
                    }}
                    className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="px-3 py-1 rounded-xl bg-purple-600 text-white font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {checklistItems.map((chk, i) => (
                    <div key={chk.id} className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <span>• {chk.text}</span>
                      <button
                        type="button"
                        onClick={() => setChecklistItems((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Card Color</span>
                <div className="flex items-center gap-2">
                  {pastelColors.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setNewColor(c.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        newColor === c.hex ? 'scale-110 ring-2 ring-purple-500' : ''
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Note (Opens when clicking any note card) */}
      {editingNote && (
        <div
          onClick={() => setEditingNote(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-3xl p-5 shadow-2xl border space-y-3 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-bold">Edit Note</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setEditingNote((prev) => (prev ? { ...prev, isPinned: !prev.isPinned } : null))
                  }
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    editingNote.isPinned ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={editingNote.isPinned ? 'Unpin Note' : 'Pin Note'}
                >
                  <Pin className={`w-4 h-4 ${editingNote.isPinned ? 'fill-amber-500' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveEditedNote} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Note Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Note Content</label>
                <textarea
                  rows={4}
                  placeholder="Write or update your note..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 leading-relaxed focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Checklist items in note */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400">Tick-Out Checklists</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Add checklist item..."
                    value={checklistInput}
                    onChange={(e) => setChecklistInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChecklistItem();
                      }
                    }}
                    className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="px-3 py-1 rounded-xl bg-purple-600 text-white font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {checklistItems.length > 0 && (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {checklistItems.map((chk, i) => (
                      <div
                        key={chk.id}
                        className="flex items-center gap-2 text-[11px] p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setChecklistItems((prev) =>
                              prev.map((item, idx) =>
                                idx === i ? { ...item, done: !item.done } : item
                              )
                            )
                          }
                          className="cursor-pointer shrink-0"
                        >
                          {chk.done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                        <input
                          type="text"
                          value={chk.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setChecklistItems((prev) =>
                              prev.map((item, idx) => (idx === i ? { ...item, text: val } : item))
                            );
                          }}
                          className={`flex-1 bg-transparent border-none focus:outline-hidden text-[11px] ${
                            chk.done ? 'line-through opacity-60' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setChecklistItems((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          className="text-slate-400 hover:text-rose-500 px-1 cursor-pointer"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Color picker */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Card Color</span>
                <div className="flex items-center gap-2">
                  {pastelColors.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setNewColor(c.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        newColor === c.hex ? 'scale-110 ring-2 ring-purple-500' : ''
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const target = editingNote;
                    setEditingNote(null);
                    setNoteToDelete(target);
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingNote(null)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!noteToDelete}
        title="Delete Note?"
        message={`Delete "${noteToDelete?.title}"?`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (noteToDelete) onDeleteNote(noteToDelete.id);
          setNoteToDelete(null);
        }}
        onCancel={() => setNoteToDelete(null)}
      />
    </div>
  );

  function renderNoteCard(note: NoteItem) {
    const cardBg = isDark ? 'bg-slate-800/90 text-slate-100' : 'bg-white text-slate-800';

    return (
      <div
        key={note.id}
        onClick={() => openEditNoteModal(note)}
        style={{
          backgroundColor: isDark ? undefined : note.color || '#fff',
        }}
        className={`p-4 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400 dark:hover:border-purple-500/60 shadow-xs hover:shadow-md space-y-2.5 transition-all flex flex-col justify-between cursor-pointer group ${
          isDark ? cardBg : ''
        }`}
      >
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-black tracking-tight leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {note.title}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditNoteModal(note);
                }}
                className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                title="Edit note"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateNote({ ...note, isPinned: !note.isPinned });
                }}
                className={`p-1 rounded cursor-pointer ${
                  note.isPinned ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={note.isPinned ? 'Unpin' : 'Pin'}
              >
                <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-500' : ''}`} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setNoteToDelete(note);
                }}
                className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {note.content && (
            <p className="text-[11px] leading-relaxed whitespace-pre-line opacity-90">
              {note.content}
            </p>
          )}

          {/* Tick-out Checklist Items inside Keep note */}
          {note.checklist && note.checklist.length > 0 && (
            <div className="space-y-1 pt-1">
              {note.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleChecklist(note.id, item.id);
                  }}
                  className="flex items-center gap-2 text-[11px] cursor-pointer hover:opacity-80"
                >
                  {item.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className={item.done ? 'line-through opacity-50' : 'font-medium'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between text-[9px] opacity-60 font-mono">
          <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString()}</span>
          <span>Tap to Edit</span>
        </div>
      </div>
    );
  }
};
