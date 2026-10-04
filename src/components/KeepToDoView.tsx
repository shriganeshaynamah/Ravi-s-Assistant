import React, { useState, useMemo } from 'react';
import type { ChecklistTask, Priority } from '../types';
import {
  CheckSquare,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Pin,
  Calendar,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  Tag,
  Clock,
  ChevronRight,
  FileSpreadsheet,
  Edit2,
  X,
  FileText,
} from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { exportMultiSectionToGoogleSheets } from '../services/googleSheets';

interface KeepToDoViewProps {
  tasks: ChecklistTask[];
  onAddTask: (task: ChecklistTask) => void;
  onToggleTask: (id: string) => void;
  onUpdateTask: (task: ChecklistTask) => void;
  onDeleteTask: (id: string) => void;
  onNavigateToNotes?: () => void;
  isDark: boolean;
}

type TaskFilter = 'all' | 'pinned' | 'today' | 'pending' | 'completed';

export const KeepToDoView: React.FC<KeepToDoViewProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onNavigateToNotes,
  isDark,
}) => {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<ChecklistTask | null>(null);
  const [editingTask, setEditingTask] = useState<ChecklistTask | null>(null);

  // New task form state
  const [taskText, setTaskText] = useState('');
  const [taskCategory, setTaskCategory] = useState<ChecklistTask['category']>('daily_chores');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskDueDate, setTaskDueDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isPinned, setIsPinned] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTask: ChecklistTask = {
      id: `task-${Date.now()}`,
      text: taskText.trim(),
      isCompleted: false,
      category: taskCategory,
      priority: taskPriority,
      dueDate: taskDueDate,
      createdAt: new Date().toISOString(),
      isPinned: isPinned,
      isDaily: taskDueDate === todayStr,
    };

    onAddTask(newTask);
    setTaskText('');
    setIsPinned(false);
  };

  const handleTogglePin = (task: ChecklistTask, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateTask({
      ...task,
      isPinned: !task.isPinned,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    onUpdateTask(editingTask);
    setEditingTask(null);
  };

  const handleExportToSheet = async () => {
    setIsExporting(true);
    setExportNotice(null);
    try {
      const res = await exportMultiSectionToGoogleSheets({
        tasks,
      });
      setExportNotice(res.spreadsheetUrl);
    } catch (e: any) {
      alert(`Export error: ${e.message || 'Check login'}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filter === 'pinned') return t.isPinned;
      if (filter === 'today') return t.dueDate === todayStr || t.isDaily;
      if (filter === 'pending') return !t.isCompleted;
      if (filter === 'completed') return t.isCompleted;
      return true;
    });
  }, [tasks, searchQuery, filter, todayStr]);

  // Separate pinned vs standard
  const pinnedTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.isPinned && !t.isCompleted);
  }, [filteredTasks]);

  const regularTasks = useMemo(() => {
    return filteredTasks.filter((t) => !(t.isPinned && !t.isCompleted));
  }, [filteredTasks]);

  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const todayCount = tasks.filter((t) => t.dueDate === todayStr && !t.isCompleted).length;

  return (
    <div className="space-y-4 pb-24 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Keep To-Do &amp; Daily Work</span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Daily work checklists, pinned priorities, and clinical tasks
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {onNavigateToNotes && (
            <button
              onClick={onNavigateToNotes}
              className="py-1 px-2 rounded-lg border text-[11px] font-semibold flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Sticky Notes</span>
            </button>
          )}

          <button
            onClick={handleExportToSheet}
            disabled={isExporting}
            className="py-1 px-2.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300 hover:bg-purple-100 cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Syncing...' : 'Save to Sheet'}</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-700 text-xs text-purple-800 dark:text-purple-200 flex items-center justify-between">
          <span>✓ Keep To-Do items synced with Master Google Sheet!</span>
          <a
            href={exportNotice}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline"
          >
            Open Sheet ↗
          </a>
        </div>
      )}

      {/* Quick Stats Summary Strip */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div
          onClick={() => setFilter('today')}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
            filter === 'today'
              ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-400'
              : isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Today's Work</span>
          <p className="text-base font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-0.5">
            {todayCount} Pending
          </p>
        </div>

        <div
          onClick={() => setFilter('pinned')}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
            filter === 'pinned'
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400'
              : isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Pinned To-Dos</span>
          <p className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
            {tasks.filter((t) => t.isPinned && !t.isCompleted).length} Focus
          </p>
        </div>

        <div
          onClick={() => setFilter('completed')}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
            filter === 'completed'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400'
              : isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Done</span>
          <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            {completedCount} Completed
          </p>
        </div>
      </div>

      {/* Add New To-Do Form Box */}
      <form
        onSubmit={handleCreateTask}
        className={`p-3.5 rounded-2xl border transition-all shadow-xs space-y-2.5 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            required
            placeholder="Add daily work, patient case review, or study task..."
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isPinned
                ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-400 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
            title={isPinned ? 'Task is pinned to top' : 'Click to pin task'}
          >
            <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
          </button>

          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add To-Do</span>
          </button>
        </div>

        {/* Form Options: Category, Priority & Date */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Category:</span>
            <select
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value as ChecklistTask['category'])}
              className="px-2 py-1 rounded-lg text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="daily_chores">Daily Work</option>
              <option value="clinic_prep">Clinical OPD</option>
              <option value="exam_study">BAMS Exam &amp; Study</option>
              <option value="patient_care">Patient Care</option>
              <option value="financial">Financial / EMI</option>
              <option value="general">General</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Priority:</span>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as Priority)}
              className="px-2 py-1 rounded-lg text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Date:</span>
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              className="px-2 py-0.5 rounded-lg text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
            {taskDueDate === todayStr && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded">
                Today
              </span>
            )}
          </div>
        </div>
      </form>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-xs">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'today', label: `Today (${todayCount})` },
            { id: 'pinned', label: '📌 Pinned' },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as TaskFilter)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[140px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Pinned Tasks Section (Always highlighted at top) */}
      {pinnedTasks.length > 0 && filter !== 'completed' && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5 fill-current" />
            <span>Pinned Priorities ({pinnedTasks.length})</span>
          </div>

          <div className="space-y-2">
            {pinnedTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xs flex items-center justify-between gap-3 ${
                  isDark
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                    : 'bg-amber-50/80 border-amber-300 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Circle className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {task.text}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                      <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase">
                        PINNED
                      </span>
                      <span>•</span>
                      <span className="uppercase">{task.category.replace(/_/g, ' ')}</span>
                      {task.dueDate && (
                        <>
                          <span>•</span>
                          <span className={task.dueDate === todayStr ? 'font-bold text-emerald-600' : ''}>
                            {task.dueDate === todayStr ? 'Today' : task.dueDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleTogglePin(task, e)}
                    className="p-1 text-amber-500 hover:text-amber-600 cursor-pointer"
                    title="Unpin task"
                  >
                    <Pin className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    onClick={() => setEditingTask(task)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Task List */}
      <div className="space-y-2">
        {regularTasks.length === 0 && pinnedTasks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
            <CheckSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No tasks found for this view
            </p>
            <p className="text-[11px] text-slate-500">
              Add your daily work, clinical cases, or priorities above.
            </p>
          </div>
        ) : (
          regularTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xs flex items-center justify-between gap-3 ${
                task.isCompleted
                  ? 'opacity-60 bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {task.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <div className="min-w-0">
                  <p
                    className={`text-xs font-medium text-slate-900 dark:text-slate-100 truncate ${
                      task.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {task.text}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                    <span className="uppercase">{task.category.replace(/_/g, ' ')}</span>
                    <span>•</span>
                    <span
                      className={`font-semibold uppercase ${
                        task.priority === 'urgent'
                          ? 'text-rose-500'
                          : task.priority === 'high'
                          ? 'text-amber-500'
                          : 'text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <>
                        <span>•</span>
                        <span className={task.dueDate === todayStr ? 'font-bold text-emerald-600' : ''}>
                          {task.dueDate === todayStr ? 'Today' : task.dueDate}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleTogglePin(task, e)}
                  className={`p-1 cursor-pointer transition-colors ${
                    task.isPinned
                      ? 'text-amber-500 hover:text-amber-600'
                      : 'text-slate-300 hover:text-slate-500'
                  }`}
                  title={task.isPinned ? 'Unpin task' : 'Pin task'}
                >
                  <Pin className={`w-3.5 h-3.5 ${task.isPinned ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setEditingTask(task)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTaskToDelete(task)}
                  className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Edit To-Do Task
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Task Description
                </label>
                <input
                  type="text"
                  required
                  value={editingTask.text}
                  onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={editingTask.category}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        category: e.target.value as ChecklistTask['category'],
                      })
                    }
                    className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="daily_chores">Daily Work</option>
                    <option value="clinic_prep">Clinical OPD</option>
                    <option value="exam_study">BAMS Exam &amp; Study</option>
                    <option value="patient_care">Patient Care</option>
                    <option value="financial">Financial / EMI</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Priority
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, priority: e.target.value as Priority })
                    }
                    className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingTask.isPinned || false}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, isPinned: e.target.checked })
                    }
                    className="rounded text-purple-600"
                  />
                  <span>Pin to top</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(taskToDelete)}
        title="Delete To-Do Task?"
        message={`Are you sure you want to remove "${taskToDelete?.text}"?`}
        confirmLabel="Delete Task"
        isDestructive
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
