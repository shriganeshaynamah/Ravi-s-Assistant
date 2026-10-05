import React, { useMemo } from 'react';
import {
  Compass,
  FileText,
  CalendarDays,
  CreditCard,
  TrendingUp,
  Activity,
  Wrench,
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronRight,
  Pin,
  CheckSquare,
  Plus,
  Bot,
} from 'lucide-react';
import type {
  RoadmapMilestone,
  LoanItem,
  InvestmentItem,
  ExpenseRecord,
  NoteItem,
  ChecklistTask,
} from '../types';

interface HomeExploreViewProps {
  onNavigate: (tab: any) => void;
  milestones: RoadmapMilestone[];
  loans: LoanItem[];
  investments: InvestmentItem[];
  expenses: ExpenseRecord[];
  notes: NoteItem[];
  tasks: ChecklistTask[];
  onToggleTask: (id: string) => void;
  isDark: boolean;
}

export const HomeExploreView: React.FC<HomeExploreViewProps> = ({
  onNavigate,
  milestones,
  loans,
  investments,
  expenses,
  notes,
  tasks,
  onToggleTask,
  isDark,
}) => {
  const activeLoans = loans.filter((l) => l.status === 'active' || l.status === 'partially_paid');
  const totalMonthlyEmi = activeLoans.reduce((sum, l) => sum + l.monthlyEmi, 0);

  const totalInvested = investments.reduce((sum, i) => sum + i.investedAmount, 0);
  const totalCurrentWealth = investments.reduce((sum, i) => sum + i.currentValue, 0);

  const pendingTasks = tasks.filter((t) => !t.isCompleted);

  // Pastel Color Card Tiles matching the explore hub
  const exploreTiles = [
    {
      id: 'assistant',
      title: 'Ravi’s Assistant',
      subtitle: 'LifeOS & Medics AI',
      icon: Bot,
      lightBg: 'bg-[#E8F8F5]',
      lightBorder: 'border-[#A3E4D7]',
      lightText: 'text-[#0E6251]',
      lightIconBg: 'bg-[#A3E4D7]/70',
      darkBg: 'bg-slate-800/80',
      darkBorder: 'border-emerald-500/30',
      darkText: 'text-emerald-300',
    },
    {
      id: 'roadmap',
      title: 'Roadmap',
      subtitle: 'BAMS to Clinic',
      icon: Compass,
      lightBg: 'bg-[#EBF5FB]',
      lightBorder: 'border-[#D4E6F1]',
      lightText: 'text-[#1B4F72]',
      lightIconBg: 'bg-[#D4E6F1]/70',
      darkBg: 'bg-slate-800/80',
      darkBorder: 'border-blue-500/30',
      darkText: 'text-blue-300',
    },
    {
      id: 'keeptodo',
      title: 'Keep To-Do',
      subtitle: 'Daily Work & Pins',
      icon: CheckSquare,
      lightBg: 'bg-[#F4ECF7]',
      lightBorder: 'border-[#E8DAEF]',
      lightText: 'text-[#512E5F]',
      lightIconBg: 'bg-[#E8DAEF]/70',
      darkBg: 'bg-slate-800/80',
      darkBorder: 'border-purple-500/30',
      darkText: 'text-purple-300',
    },
    {
      id: 'corners',
      title: 'Journal',
      subtitle: 'Personal Diary',
      icon: BookOpen,
      lightBg: 'bg-[#FEF5E7]',
      lightBorder: 'border-[#FADBD8]',
      lightText: 'text-[#7E5109]',
      lightIconBg: 'bg-[#FADBD8]/70',
      darkBg: 'bg-slate-800/80',
      darkBorder: 'border-amber-500/30',
      darkText: 'text-amber-300',
    },
    {
      id: 'loans',
      title: 'Loans',
      subtitle: 'EMI & Repayment',
      icon: CreditCard,
      lightBg: 'bg-[#E8F8F5]',
      lightBorder: 'border-[#D1F2EB]',
      lightText: 'text-[#117864]',
      lightIconBg: 'bg-[#D1F2EB]/70',
      darkBg: 'bg-slate-800/80',
      darkBorder: 'border-emerald-500/30',
      darkText: 'text-emerald-300',
    },
    {
      id: 'investments',
      title: 'Investments',
      subtitle: 'SIP & Wealth Calc',
      icon: TrendingUp,
      lightBg: 'bg-[#EAF2F8]',
      lightBorder: 'border-[#D4E6F1]',
      lightText: 'text-[#2471A3]',
      lightIconBg: 'bg-[#D4E6F1]/70',
      darkBg: 'bg-slate-800/80',
      darkBorder: 'border-sky-500/30',
      darkText: 'text-sky-300',
    },
    {
      id: 'calendar',
      title: 'Calendar & OPD',
      subtitle: 'Google Calendar Sync',
      icon: CalendarDays,
      lightBg: 'bg-[#FDF2E9]',
      lightBorder: 'border-[#FAD7A0]',
      lightText: 'text-[#A04000]',
      lightIconBg: 'bg-[#FAD7A0]/70',
      darkBg: 'bg-slate-800/80',
      darkBorder: 'border-orange-500/30',
      darkText: 'text-orange-300',
    },
    {
      id: 'dinacharya',
      title: 'Habit Tracker',
      subtitle: 'Habits & DinCharya',
      icon: Activity,
      lightBg: 'bg-[#FDEDEC]',
      lightBorder: 'border-[#FADBD8]',
      lightText: 'text-[#78281F]',
      lightIconBg: 'bg-[#FADBD8]/70',
      darkBg: 'bg-slate-800/80',
      darkBorder: 'border-rose-500/30',
      darkText: 'text-rose-300',
    },
    {
      id: 'tools',
      title: 'Calculators',
      subtitle: 'EMI, SIP & Dosage',
      icon: Wrench,
      lightBg: 'bg-[#EAFAF1]',
      lightBorder: 'border-[#D5F5E3]',
      lightText: 'text-[#1E8449]',
      lightIconBg: 'bg-[#D5F5E3]/70',
      darkBg: 'bg-slate-800/80',
      darkBorder: 'border-teal-500/30',
      darkText: 'text-teal-300',
    },
  ];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Title Section */}
      <div className="pb-1 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
          Explore
        </h2>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
          All your life tools, clinical practice &amp; financial tracking in one place
        </p>
      </div>

      {/* Grid: 3 cols on mobile, 4-6 on tablet/desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {exploreTiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              onClick={() => {
                if (tile.id === 'roadmap_exams') {
                  onNavigate('roadmap');
                } else if (tile.id === 'loans' || tile.id === 'investments') {
                  onNavigate('expense');
                } else {
                  onNavigate(tile.id);
                }
              }}
              className={`p-2.5 rounded-xl border transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[92px] shadow-2xs active:scale-95 ${
                isDark
                  ? `${tile.darkBg} ${tile.darkBorder} ${tile.darkText} hover:border-white/30`
                  : `${tile.lightBg} ${tile.lightBorder} ${tile.lightText} hover:shadow-xs`
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 ${
                  isDark ? 'bg-slate-900/60' : tile.lightIconBg
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10.5px] font-semibold leading-tight line-clamp-1">
                {tile.title}
              </span>
              <span className="text-[8.5px] opacity-75 mt-0.5 leading-tight line-clamp-1">
                {tile.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Financial Overview Card (Active Loans & EMIs vs Investments) */}
      <div
        className={`p-4 rounded-2xl border transition-colors shadow-xs ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Financial Snapshot</h4>
          </div>
          <button
            onClick={() => onNavigate('expense')}
            className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Manage</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div
            onClick={() => onNavigate('expense')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold block">
              Monthly Active EMIs
            </span>
            <p className="text-sm font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
              ₹{totalMonthlyEmi.toLocaleString('en-IN')}/mo
            </p>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
              {activeLoans.length} Active Loans
            </span>
          </div>

          <div
            onClick={() => onNavigate('expense')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold block">
              Invested Portfolio
            </span>
            <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
              ₹{totalCurrentWealth.toLocaleString('en-IN')}
            </p>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
              +₹{(totalCurrentWealth - totalInvested).toLocaleString('en-IN')} Profit
            </span>
          </div>
        </div>
      </div>

      {/* Google Keep Quick Checklist Widget */}
      <div
        className={`p-4 rounded-2xl border transition-colors shadow-xs ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Keep To-Do ({pendingTasks.length} pending)
            </h4>
          </div>
          <button
            onClick={() => onNavigate('keeptodo')}
            className="text-[10px] font-bold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Show All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Display Pinned to-dos and Current Day tasks first */}
        <div className="space-y-2">
          {(() => {
            const today = new Date().toISOString().split('T')[0];
            const sorted = [...tasks].sort((a, b) => {
              if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
              if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
              const aToday = a.dueDate === today || a.isDaily;
              const bToday = b.dueDate === today || b.isDaily;
              if (aToday !== bToday) return aToday ? -1 : 1;
              return 0;
            });

            return sorted.slice(0, 4).map((task) => {
              const isToday = task.dueDate === today || task.isDaily;
              return (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 text-xs cursor-pointer transition-all ${
                    task.isCompleted
                      ? 'opacity-50 line-through bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                      : task.isPinned
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60'
                      : isDark
                      ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate text-slate-900 dark:text-slate-100 font-medium text-[11px]">
                      {task.text}
                    </span>
                    {task.isPinned && !task.isCompleted && (
                      <span className="text-[9px] px-1 py-0.2 bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded font-bold shrink-0">
                        📌 Pinned
                      </span>
                    )}
                    {isToday && !task.isCompleted && (
                      <span className="text-[9px] px-1 py-0.2 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 rounded font-bold shrink-0">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 shrink-0">
                    {task.priority}
                  </span>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
};
