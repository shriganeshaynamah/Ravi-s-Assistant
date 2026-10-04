import React from 'react';
import type { CalendarEvent, ChecklistTask, ExpenseRecord, HabitItem, NoteItem, Roadmap } from '../types';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  TrendingUp,
  DollarSign,
  Compass,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  CheckSquare,
  AlertCircle,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  events: CalendarEvent[];
  tasks: ChecklistTask[];
  expenses: ExpenseRecord[];
  habits: HabitItem[];
  notes: NoteItem[];
  roadmaps: Roadmap[];
  onToggleTask: (taskId: string) => void;
  onToggleHabit: (habitId: string) => void;
  onNavigate: (tab: any) => void;
  onQuickAction: (actionType: 'event' | 'note' | 'expense' | 'task') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  tasks,
  expenses,
  habits,
  notes,
  roadmaps,
  onToggleTask,
  onToggleHabit,
  onNavigate,
  onQuickAction,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations
  const todayEvents = events.filter((e) => e.startDate.startsWith(todayStr));
  const upcomingEvents = events.slice(0, 4);

  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);

  const habitsDoneToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;

  const currentMonth = todayStr.substring(0, 7);
  const monthlyExpensesList = expenses.filter((e) => e.date.startsWith(currentMonth));
  const monthlyIncome = monthlyExpensesList
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const monthlyExpense = monthlyExpensesList
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  const monthlyNet = monthlyIncome - monthlyExpense;

  const clinicalRoadmap = roadmaps.find((r) => r.category === 'clinical_setup') || roadmaps[0];

  const handleHabitClick = (habitId: string) => {
    onToggleHabit(habitId);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#f59e0b'],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                🌿 Ayur-Life Operating System
              </span>
              <span className="text-xs text-slate-400 font-mono">Pranayama • Chikitsa • Wealth</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Namaste, Dr. Ravi Shankar
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your clinical appointments, study revisions, multi-source income engines, and personal life roadmaps are synchronized and ready.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onQuickAction('event')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Mark Event / OPD</span>
            </button>
            <button
              onClick={() => onQuickAction('task')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Add Checklist To-Do</span>
            </button>
            <button
              onClick={() => onQuickAction('expense')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Log Income / Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Schedule */}
        <div
          onClick={() => onNavigate('calendar')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Today's Schedule</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{todayEvents.length}</span>
            <span className="text-xs text-slate-400">events marked</span>
          </div>
          <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <span>{upcomingEvents.length} total upcoming</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 2: Checklists */}
        <div
          onClick={() => onNavigate('notes')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Tick-out Checklists</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{pendingTasks.length}</span>
            <span className="text-xs text-slate-400">pending tasks</span>
          </div>
          <p className="mt-2 text-xs text-blue-400 flex items-center gap-1">
            <span>{completedTasks.length} completed</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 3: Monthly Net Finance */}
        <div
          onClick={() => onNavigate('expenses')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Monthly Financial Pulse</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              ₹{monthlyNet.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-400">Net Surplus</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Income: ₹{monthlyIncome.toLocaleString('en-IN')} • Exp: ₹{monthlyExpense.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Card 4: Dinacharya & Habits */}
        <div
          onClick={() => onNavigate('ayurveda_hub')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Dinacharya Habits</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {habitsDoneToday} / {habits.length}
            </span>
            <span className="text-xs text-teal-400">done today</span>
          </div>
          <p className="mt-2 text-xs text-teal-300 flex items-center gap-1">
            <span>Brahma Muhurta &amp; Samhita Streak</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </div>

      {/* Main 2-Column Command Center Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop): Schedule & Checklists */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Schedule / Google Calendar */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Upcoming Events &amp; Clinical Schedule
                </h3>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Calendar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingEvents.map((evt) => {
                const dateObj = new Date(evt.startDate);
                const timeStr = dateObj.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                });
                const dateFormatted = dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                const badgeColor =
                  evt.category === 'clinical'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : evt.category === 'financial'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : evt.category === 'study'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/30';

                return (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {evt.category}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-100">{evt.title}</h4>
                      </div>
                      {evt.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">{evt.description}</p>
                      )}
                      {evt.location && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <span>📍 {evt.location}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-slate-200">{dateFormatted}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{timeStr}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tick-out Checklists */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  High-Priority Checklists (Tick Out)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('notes')}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <span>All Notes &amp; Tasks</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    task.isCompleted
                      ? 'bg-slate-900/50 border-slate-800/60 opacity-60'
                      : 'bg-slate-800/70 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <span
                      className={`text-xs ${
                        task.isCompleted ? 'line-through text-slate-400' : 'text-slate-200 font-medium'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                    {task.category.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Roadmap Highlight, Dinacharya & Pinned Notes */}
        <div className="space-y-6">
          {/* Active Roadmap Progress */}
          {clinicalRoadmap && (
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Active Roadmap
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('roadmaps')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  View All
                </button>
              </div>

              <h4 className="text-sm font-bold text-white">{clinicalRoadmap.title}</h4>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {clinicalRoadmap.description}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Overall Completion</span>
                  <span className="font-bold text-emerald-400">{clinicalRoadmap.overallProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${clinicalRoadmap.overallProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-300 mb-1.5">Next Critical Step:</p>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
                  ⚡ Municipal Clearances &amp; Biomedical Waste Agreement
                </div>
              </div>
            </div>
          )}

          {/* Daily Dinacharya Quick Check */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Daily Dinacharya Regimen
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                {habitsDoneToday}/{habits.length}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Tap to complete your Ayurvedic daily habits:
            </p>

            <div className="space-y-2">
              {habits.map((habit) => {
                const isDone = habit.completedDates.includes(todayStr);
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleHabitClick(habit.id)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                        : 'bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                      <span className="font-medium">{habit.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                      <span>🔥 {habit.streak}d</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pinned Note Spotlight */}
          {notes.filter((n) => n.isPinned).length > 0 && (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    Clinical Spotlight
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('notes')}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  All Notes
                </button>
              </div>

              {(() => {
                const pinned = notes.find((n) => n.isPinned) || notes[0];
                return (
                  <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
                    <h5 className="text-xs font-bold text-white line-clamp-1">{pinned.title}</h5>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-line">
                      {pinned.content}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {pinned.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
