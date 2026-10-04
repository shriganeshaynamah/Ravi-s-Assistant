import React, { useState } from 'react';
import type { NoteItem, ChecklistTask, Priority } from '../types';
import {
  FileText,
  CheckSquare,
  Pin,
  Plus,
  Trash2,
  Search,
  Tag,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

interface NotesViewProps {
  notes: NoteItem[];
  tasks: ChecklistTask[];
  onAddNote: (note: NoteItem) => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onAddTask: (task: ChecklistTask) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  tasks,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'checklists' | 'descriptive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // New Note Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<NoteItem['category']>('clinical_case');
  const [newTagsStr, setNewTagsStr] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // New Task Form
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<ChecklistTask['category']>('clinic_prep');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('high');

  // Deletion modals
  const [noteToDelete, setNoteToDelete] = useState<NoteItem | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<ChecklistTask | null>(null);

  // Copied toast
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tags = newTagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      isPinned,
      tags: tags.length ? tags : ['Ayurveda'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddNote(newNote);
    setIsAddNoteModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTagsStr('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: ChecklistTask = {
      id: `chk-${Date.now()}`,
      text: newTaskText.trim(),
      isCompleted: false,
      category: newTaskCategory,
      priority: newTaskPriority,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setIsAddTaskModalOpen(false);
    setNewTaskText('');
  };

  const handleCopyNote = (note: NoteItem) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Keep Notes &amp; Tick-Out Checklists</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Clinical protocols, formulation recipes, exam flash notes, and tick-out daily actionable checklists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>+ New Checklist Task</span>
          </button>
          <button
            onClick={() => setIsAddNoteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Descriptive Note</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveSubTab('checklists')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSubTab === 'checklists'
                ? 'bg-slate-800 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tick-Out Checklists ({pendingTasks.length} pending)
          </button>
          <button
            onClick={() => setActiveSubTab('descriptive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSubTab === 'descriptive'
                ? 'bg-slate-800 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Descriptive Notes ({notes.length})
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search notes, tags, cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* SECTION 1: TICK-OUT CHECKLISTS (Shown in 'all' and 'checklists') */}
      {(activeSubTab === 'all' || activeSubTab === 'checklists') && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Tick-Out Checklist Tasks ({pendingTasks.length} pending / {tasks.length} total)
              </h3>
            </div>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
            >
              + Quick Add Task
            </button>
          </div>

          {/* Pending Tasks */}
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-600 transition-all flex items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <Circle className="w-5 h-5 text-slate-500 hover:text-emerald-400 transition-colors shrink-0" />
                  <span className="text-xs text-slate-200 font-medium leading-relaxed">
                    {task.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                    {task.category.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md ${
                      task.priority === 'urgent'
                        ? 'bg-rose-500/20 text-rose-300'
                        : task.priority === 'high'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Completed Tasks Toggle / List */}
          {completedTasks.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Completed ({completedTasks.length})
              </p>
              <div className="space-y-1.5 opacity-60">
                {completedTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div
                      onClick={() => onToggleTask(task.id)}
                      className="flex items-center gap-3 cursor-pointer line-through text-slate-400"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{task.text}</span>
                    </div>
                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="text-slate-600 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: DESCRIPTIVE NOTES (Shown in 'all' and 'descriptive') */}
      {(activeSubTab === 'all' || activeSubTab === 'descriptive') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Descriptive Clinical &amp; Life Notes ({sortedNotes.length})
              </h3>
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'clinical_case', label: 'Clinical Protocols' },
                { id: 'dravyaguna_formulation', label: 'Dravyaguna / Herbs' },
                { id: 'personal_diary', label: 'Vision & Diary' },
                { id: 'investment_idea', label: 'Investments' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedNotes.map((note) => {
              const dateStr = new Date(note.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={note.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group shadow-sm ${
                    note.isPinned
                      ? 'bg-slate-900/90 border-emerald-500/30 ring-1 ring-emerald-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {note.isPinned && (
                            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-300">
                              <Pin className="w-3 h-3 fill-emerald-300" />
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {note.category.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors pt-1">
                          {note.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyNote(note)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                          title="Copy content"
                        >
                          {copiedNoteId === note.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onUpdateNote({ ...note, isPinned: !note.isPinned })}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            note.isPinned
                              ? 'text-emerald-400 hover:text-emerald-300'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={note.isPinned ? 'Unpin note' : 'Pin note'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setNoteToDelete(note)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                      {note.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-slate-500">{dateStr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4">Add Descriptive Note</h3>
            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Formulation: Takra Dhara for Psoriasis"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="clinical_case">Clinical Case / Protocol</option>
                  <option value="dravyaguna_formulation">Dravyaguna / Herb Formulation</option>
                  <option value="personal_diary">Personal Vision / Diary</option>
                  <option value="investment_idea">Investment Idea / Financial</option>
                  <option value="general">General Life Note</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Content / Details *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write clinical observations, dosages, step-wise preparation, or personal goals..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Kayachikitsa, Dravyaguna, Panchakarma"
                  value={newTagsStr}
                  onChange={(e) => setNewTagsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Pin this note to the top</span>
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-950/40 cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4">Add Checklist To-Do</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Task Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Order Shatavari Ghritha stock from GMP pharmacy"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="clinic_prep">Clinic Setup &amp; Prep</option>
                    <option value="patient_care">Patient Follow-up</option>
                    <option value="exam_study">Exam Prep / Study</option>
                    <option value="financial">Financial / Accounts</option>
                    <option value="daily_chores">Personal Routine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-950/40 cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modals for Deletions */}
      <ConfirmationModal
        isOpen={!!noteToDelete}
        title="Delete Descriptive Note?"
        message={`Are you sure you want to delete note "${noteToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete Note"
        cancelLabel="Keep Note"
        isDestructive={true}
        onConfirm={() => {
          if (noteToDelete) {
            onDeleteNote(noteToDelete.id);
            setNoteToDelete(null);
          }
        }}
        onCancel={() => setNoteToDelete(null)}
      />

      <ConfirmationModal
        isOpen={!!taskToDelete}
        title="Delete Checklist Item?"
        message={`Are you sure you want to delete task "${taskToDelete?.text}"?`}
        confirmLabel="Yes, Delete Task"
        cancelLabel="Keep Task"
        isDestructive={true}
        onConfirm={() => {
          if (taskToDelete) {
            onDeleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
