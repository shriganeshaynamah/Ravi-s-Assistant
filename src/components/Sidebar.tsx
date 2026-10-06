import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  FileText,
  DollarSign,
  Compass,
  CalendarRange,
  Sparkles,
  HeartHandshake,
  Cloud,
  Activity,
  Flame,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'calendar'
  | 'notes'
  | 'expenses'
  | 'roadmaps'
  | 'planner'
  | 'life_corners'
  | 'ayurveda_hub'
  | 'cloud_sync';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingTasksCount: number;
  upcomingEventsCount: number;
  habitsTodayDone: number;
  habitsTotal: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingTasksCount,
  upcomingEventsCount,
  habitsTodayDone,
  habitsTotal,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'calendar' as ActiveTab,
      label: 'Calendar & Reminders',
      icon: CalendarDays,
      badge: upcomingEventsCount > 0 ? upcomingEventsCount : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'notes' as ActiveTab,
      label: 'Notes & Checklists',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount} to-do` : null,
      badgeColor: 'bg-blue-500/20 text-blue-300',
    },
    {
      id: 'expenses' as ActiveTab,
      label: 'Expense & Wealth Ledger',
      icon: DollarSign,
      badge: 'Cloud',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 font-mono',
    },
    {
      id: 'roadmaps' as ActiveTab,
      label: 'Roadmaps Master',
      icon: Compass,
      badge: '3 Tracks',
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    {
      id: 'planner' as ActiveTab,
      label: 'Year & Month Planner',
      icon: CalendarRange,
      badge: null,
    },
    {
      id: 'life_corners' as ActiveTab,
      label: 'Life Journey Corners',
      icon: HeartHandshake,
      badge: '6 Corners',
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
    {
      id: 'ayurveda_hub' as ActiveTab,
      label: 'Dinacharya & Ayurveda',
      icon: Activity,
      badge: `${habitsTodayDone}/${habitsTotal}`,
      badgeColor: 'bg-teal-500/20 text-teal-300 font-mono',
    },
    {
      id: 'cloud_sync' as ActiveTab,
      label: 'Google Cloud Hub',
      icon: Cloud,
      badge: 'Drive/Sync',
      badgeColor: 'bg-sky-500/20 text-sky-300',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/95 border-b md:border-b-0 md:border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="hidden md:block px-3 py-2 mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Life Operating System
          </p>
        </div>

        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 md:shrink cursor-pointer text-left ${
                  isActive
                    ? 'bg-emerald-600/90 text-white shadow-md shadow-emerald-950/50 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Ayurvedic Affirmation / Quote footer */}
      <div className="hidden md:block mt-6 pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Ayurvedic Wisdom</span>
          </div>
          <p className="text-[11px] text-slate-300 italic leading-relaxed">
            "Prakrutee Swasthyam" — Health is balance of Doshas, Agni, Dhatus and a joyful soul.
          </p>
          <div className="mt-2 text-[10px] text-slate-400 text-right">
            — Charaka Samhita
          </div>
        </div>
      </div>
    </aside>
  );
};
