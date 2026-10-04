import React, { useState } from 'react';
import type { MonthPlan, YearPlan } from '../types';
import {
  CalendarRange,
  Target,
  Sparkles,
  Trophy,
  CheckCircle2,
  Circle,
  Plus,
  TrendingUp,
  Heart,
  BookOpen,
  Users,
} from 'lucide-react';

interface PlannerViewProps {
  yearPlan: YearPlan;
  monthPlans: MonthPlan[];
  onUpdateMonthPlan: (plan: MonthPlan) => void;
  onUpdateYearPlan: (plan: YearPlan) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  yearPlan,
  monthPlans,
  onUpdateMonthPlan,
  onUpdateYearPlan,
}) => {
  const currentMonthKey = new Date().toISOString().substring(0, 7); // e.g. "2026-10"
  const [selectedMonth, setSelectedMonth] = useState<string>(
    monthPlans[0]?.monthYear || currentMonthKey
  );

  const activeMonthPlan =
    monthPlans.find((m) => m.monthYear === selectedMonth) || {
      monthYear: selectedMonth,
      monthlyTheme: 'Clinical Excellence & Ayurvedic Mastery',
      keyObjectives: [
        'Streamline daily patient consultation workflow',
        'Consistently maintain 7-day Panchakarma schedules',
        'Dedicate 1 hour daily to Samhita study',
      ],
      financialGoal: 200000,
      patientTarget: 400,
      reflections: {
        wins: 'Strong clinical outcomes in chronic joint pain cases.',
        challenges: 'Balancing evening study time with late OPD patients.',
        learnings: 'Strict cut-off time for OPD ensures restorative evening sleep.',
      },
    };

  const [newObjectiveText, setNewObjectiveText] = useState('');
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [themeInput, setThemeInput] = useState(activeMonthPlan.monthlyTheme);

  const handleAddObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjectiveText.trim()) return;

    const updated: MonthPlan = {
      ...activeMonthPlan,
      keyObjectives: [...activeMonthPlan.keyObjectives, newObjectiveText.trim()],
    };
    onUpdateMonthPlan(updated);
    setNewObjectiveText('');
  };

  const handleRemoveObjective = (index: number) => {
    const updated: MonthPlan = {
      ...activeMonthPlan,
      keyObjectives: activeMonthPlan.keyObjectives.filter((_, i) => i !== index),
    };
    onUpdateMonthPlan(updated);
  };

  const handleSaveTheme = () => {
    const updated: MonthPlan = {
      ...activeMonthPlan,
      monthlyTheme: themeInput.trim() || activeMonthPlan.monthlyTheme,
    };
    onUpdateMonthPlan(updated);
    setIsEditingTheme(false);
  };

  const handleUpdateReflections = (field: 'wins' | 'challenges' | 'learnings', val: string) => {
    const updated: MonthPlan = {
      ...activeMonthPlan,
      reflections: {
        wins: activeMonthPlan.reflections?.wins || '',
        challenges: activeMonthPlan.reflections?.challenges || '',
        learnings: activeMonthPlan.reflections?.learnings || '',
        [field]: val,
      },
    };
    onUpdateMonthPlan(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-emerald-400" />
            <span>Year &amp; Month Strategic Planner</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            High-level annual vision architecture and granular monthly focus OKRs.
          </p>
        </div>
      </div>

      {/* SECTION 1: ANNUAL VISION & 4 PILLARS */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Annual Master Plan • Year {yearPlan.year}
            </span>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Dr. Ravi Shankar Core Architecture
          </span>
        </div>

        <blockquote className="text-base font-medium italic text-slate-200 border-l-2 border-emerald-500 pl-4 py-1">
          "{yearPlan.visionStatement}"
        </blockquote>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {yearPlan.primaryPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">{pillar.title}</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {pillar.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{pillar.goal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: MONTHLY STRATEGY & OKRs */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-sm">
        {/* Month Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Active Focus Month
            </span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setThemeInput(
                    monthPlans.find((m) => m.monthYear === e.target.value)?.monthlyTheme ||
                      'New Monthly Focus'
                  );
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
              <span className="text-[10px] text-slate-400 uppercase">Consultations Target</span>
              <p className="text-sm font-bold text-emerald-400 font-mono">
                {activeMonthPlan.patientTarget} Patients
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
              <span className="text-[10px] text-slate-400 uppercase">Revenue Milestone</span>
              <p className="text-sm font-bold text-amber-300 font-mono">
                ₹{activeMonthPlan.financialGoal.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Theme */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Theme of the Month</span>
            </span>
            <button
              onClick={() => setIsEditingTheme(!isEditingTheme)}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              {isEditingTheme ? 'Cancel' : 'Edit Theme'}
            </button>
          </div>

          {isEditingTheme ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
              />
              <button
                onClick={handleSaveTheme}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-xs font-semibold text-white"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-sm font-semibold text-white mt-1">{activeMonthPlan.monthlyTheme}</p>
          )}
        </div>

        {/* Monthly Objectives (OKRs) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Key Deliverables &amp; Objectives (OKRs)</span>
            </h4>
            <span className="text-xs text-slate-500">
              {activeMonthPlan.keyObjectives.length} Commitments
            </span>
          </div>

          <div className="space-y-2">
            {activeMonthPlan.keyObjectives.map((obj, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{obj}</span>
                </div>
                <button
                  onClick={() => handleRemoveObjective(i)}
                  className="text-slate-500 hover:text-rose-400 cursor-pointer"
                  title="Remove objective"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add Objective Input */}
          <form onSubmit={handleAddObjective} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="+ Add another monthly objective..."
              value={newObjectiveText}
              onChange={(e) => setNewObjectiveText(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

        {/* Monthly Retrospective & Review Corner */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Monthly Retrospective &amp; Wisdom Log</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <span className="text-[11px] font-bold text-emerald-400">Wins &amp; Breakthroughs</span>
              <textarea
                rows={3}
                value={activeMonthPlan.reflections?.wins || ''}
                onChange={(e) => handleUpdateReflections('wins', e.target.value)}
                placeholder="What went exceptionally well in practice or life?"
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <span className="text-[11px] font-bold text-amber-400">Bottlenecks &amp; Friction</span>
              <textarea
                rows={3}
                value={activeMonthPlan.reflections?.challenges || ''}
                onChange={(e) => handleUpdateReflections('challenges', e.target.value)}
                placeholder="What caused friction or delayed milestones?"
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <span className="text-[11px] font-bold text-sky-400">Next Month Adjustments</span>
              <textarea
                rows={3}
                value={activeMonthPlan.reflections?.learnings || ''}
                onChange={(e) => handleUpdateReflections('learnings', e.target.value)}
                placeholder="Key lessons to carry forward..."
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
