import React, { useState } from 'react';
import type { LifeCornersData, LifeCornerGoal } from '../types';
import {
  HeartHandshake,
  Compass,
  DollarSign,
  TrendingUp,
  BookOpen,
  PieChart,
  Zap,
  Users,
  Plus,
  CheckCircle2,
  Circle,
  Sparkles,
} from 'lucide-react';

interface LifeCornersViewProps {
  data: LifeCornersData;
  onUpdateData: (newData: LifeCornersData) => void;
  isDark?: boolean;
}

type CornerTab =
  | 'lifeGoals'
  | 'wealthGeneration'
  | 'relationships'
  | 'academics'
  | 'investments'
  | 'passiveIncome';

export const LifeCornersView: React.FC<LifeCornersViewProps> = ({ data, onUpdateData, isDark = true }) => {
  const [activeTab, setActiveTab] = useState<CornerTab>('lifeGoals');
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

  // New Goal form
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('2028-12-31');
  const [newGoalMetric, setNewGoalMetric] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal: LifeCornerGoal = {
      id: `goal-${Date.now()}`,
      title: newGoalTitle.trim(),
      description: newGoalDesc.trim(),
      targetDate: newGoalTargetDate,
      progressPercent: 10,
      status: 'active',
      metric: newGoalMetric.trim() || undefined,
    };

    const updatedData = { ...data };
    updatedData[activeTab].goals = [...updatedData[activeTab].goals, newGoal];
    onUpdateData(updatedData);

    setIsAddGoalModalOpen(false);
    setNewGoalTitle('');
    setNewGoalDesc('');
    setNewGoalMetric('');
  };

  const handleUpdateGoalProgress = (goalId: string, delta: number) => {
    const updatedGoals = data[activeTab].goals.map((g) => {
      if (g.id !== goalId) return g;
      const nextVal = Math.min(100, Math.max(0, g.progressPercent + delta));
      return {
        ...g,
        progressPercent: nextVal,
        status: nextVal === 100 ? ('completed' as const) : ('active' as const),
      };
    });

    const updatedData = { ...data };
    updatedData[activeTab].goals = updatedGoals;
    onUpdateData(updatedData);
  };

  const tabsConfig = [
    { id: 'lifeGoals' as CornerTab, label: 'Life Goals', icon: Compass, color: 'text-emerald-400' },
    { id: 'wealthGeneration' as CornerTab, label: 'Wealth Generation', icon: DollarSign, color: 'text-amber-400' },
    { id: 'relationships' as CornerTab, label: 'Relationships', icon: Users, color: 'text-pink-400' },
    { id: 'academics' as CornerTab, label: 'Academics & CME', icon: BookOpen, color: 'text-blue-400' },
    { id: 'investments' as CornerTab, label: 'Investments & SIP', icon: PieChart, color: 'text-teal-400' },
    { id: 'passiveIncome' as CornerTab, label: 'Passive Income', icon: Zap, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Journey Corners</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Dedicated life spheres: Life Goals, Wealth, Relationships, Academics, Investments &amp; Passive Streams.
          </p>
        </div>

        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Milestone to {tabsConfig.find((t) => t.id === activeTab)?.label}</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CORNER 1: LIFE GOALS */}
      {activeTab === 'lifeGoals' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/20 via-teal-950/20 to-slate-900/10 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-500/30">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Guiding Shloka &amp; Doctor’s Oath
            </span>
            <p className="text-sm italic font-serif text-slate-800 dark:text-slate-200 mt-2 leading-relaxed">
              "{data.lifeGoals.visionQuote}"
            </p>
          </div>
        </div>
      )}

      {/* CORNER 2: WEALTH GENERATION */}
      {activeTab === 'wealthGeneration' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-3xl border shadow-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Current Liquid Base</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                ₹{(data.wealthGeneration.currentNetWorthEstimate / 100000).toFixed(1)} Lakhs
              </p>
            </div>
            <div className={`p-4 rounded-3xl border shadow-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Target Sovereign Net Worth</span>
              <p className="text-xl font-black text-amber-600 dark:text-amber-300 mt-1">
                ₹{(data.wealthGeneration.targetNetWorth / 10000000).toFixed(1)} Crores ({data.wealthGeneration.targetYear})
              </p>
            </div>
            <div className={`p-4 rounded-3xl border shadow-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Emergency Runway</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {data.wealthGeneration.emergencyFundMonths} Months Protected
              </p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border space-y-3 shadow-xs ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Master Wealth Rules for Dr. Ravi Shankar
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              {data.wealthGeneration.strategies.map((rule, idx) => (
                <div key={idx} className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                  isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span className="font-medium">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CORNER 3: RELATIONSHIPS */}
      {activeTab === 'relationships' && (
        <div className="space-y-6 animate-in fade-in">
          <div className={`p-5 rounded-3xl border space-y-3 shadow-xs ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400">
              Core Relationship Pillars &amp; Vaidya Ethics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {data.relationships.coreValues.map((v, i) => (
                <div key={i} className={`p-3 rounded-2xl border font-medium ${
                  isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-200' : 'bg-pink-50/50 border-pink-200 text-slate-800'
                }`}>
                  💖 {v}
                </div>
              ))}
            </div>
          </div>

          <div className={`p-5 rounded-3xl border space-y-3 shadow-xs ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Key People &amp; Mentorship Bonds
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.relationships.importantPeople.map((person, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl border space-y-1.5 text-xs ${
                  isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{person.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-700 dark:text-pink-300">
                      {person.relation}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{person.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CORNER 4: ACADEMICS & CME */}
      {activeTab === 'academics' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-3xl border space-y-3 shadow-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Specialization &amp; Clinical Research Focus
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {data.academics.bamsSpecializationInterests.map((item, i) => (
                  <li key={i} className={`p-2.5 rounded-xl border flex items-center gap-2 font-medium ${
                    isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">❖</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-5 rounded-3xl border space-y-3 shadow-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Classical Texts &amp; Samhitas Currently Mastering
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {data.academics.booksReading.map((book, i) => (
                  <li key={i} className={`p-2.5 rounded-xl border flex items-center gap-2 font-medium ${
                    isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-purple-600 dark:text-purple-400">📖</span>
                    <span>{book}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CORNER 5: INVESTMENTS & SIP */}
      {activeTab === 'investments' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-3xl border space-y-3 shadow-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Strategic Asset Allocation
              </h4>
              <div className="space-y-2.5">
                {data.investments.currentPortfolioAllocation.map((alloc, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700 dark:text-slate-300">{alloc.assetClass}</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{alloc.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${alloc.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-5 rounded-3xl border space-y-3 shadow-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Active Monthly SIP Engines
              </h4>
              <div className="space-y-2">
                {data.investments.activeSips.map((sip, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                      isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{sip.fundName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Auto-debit on {sip.date}th of month</p>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      ₹{sip.amount.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CORNER 6: PASSIVE INCOME */}
      {activeTab === 'passiveIncome' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-3xl border shadow-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Current Passive Inflow</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                ₹{data.passiveIncome.currentPassiveMonthly.toLocaleString('en-IN')}/mo
              </p>
            </div>
            <div className={`p-4 rounded-3xl border shadow-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Monthly Passive Target</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-300 mt-1 font-mono">
                ₹{data.passiveIncome.monthlyPassiveTarget.toLocaleString('en-IN')}/mo
              </p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border space-y-3 shadow-xs ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Identified Earning Channels
            </h4>
            <div className="space-y-2">
              {data.passiveIncome.streams.map((stream, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                    isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{stream.name}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          stream.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : stream.status === 'building'
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {stream.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{stream.type}</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    ₹{stream.monthlyEstimate.toLocaleString('en-IN')}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CORNER'S GOALS LIST */}
      <div className={`rounded-3xl border p-5 space-y-4 shadow-xs ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>🎯</span>
            <span>Strategic Milestones for {tabsConfig.find((t) => t.id === activeTab)?.label}</span>
          </h3>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {data[activeTab].goals.length} Goals Active
          </span>
        </div>

        <div className="space-y-3">
          {data[activeTab].goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-800/70 border-slate-700/70' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{goal.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-normal">{goal.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {goal.metric && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/20 font-mono">
                      {goal.metric}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Due: {goal.targetDate}
                  </span>
                </div>
              </div>

              {/* Progress bar & quick adjust */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progressPercent}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono w-10 text-right">
                  {goal.progressPercent}%
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleUpdateGoalProgress(goal.id, -10)}
                    className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => handleUpdateGoalProgress(goal.id, 10)}
                    className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                  >
                    +10%
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`border rounded-3xl max-w-md w-full p-6 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Add Goal to {tabsConfig.find((t) => t.id === activeTab)?.label}
            </h3>
            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Goal Milestone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Publish Monograph / Complete 100g SGB / 50 OPD patients"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Why is this meaningful and what actions are required?"
                  value={newGoalDesc}
                  onChange={(e) => setNewGoalDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newGoalTargetDate}
                    onChange={(e) => setNewGoalTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Quantifiable Metric</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50L or 300 Hrs"
                    value={newGoalMetric}
                    onChange={(e) => setNewGoalMetric(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/20 cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
